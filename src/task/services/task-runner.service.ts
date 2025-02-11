import { Service } from "typedi";
import {DataModel, DataStatus, Format, Task, TaskModel, TaskStatus} from "../models";
import Excel, { Row, ValueType } from "exceljs";
import path from "path";
import { bufferCount, concatMap, forkJoin, observeOn, queueScheduler, range } from "rxjs";

const excelTypeToSchemaType: Record<ValueType, string> = {
    [ValueType.Null]: "null",
    [ValueType.Merge]: "string",
    [ValueType.Number]: "number",
    [ValueType.String]: "string",
    [ValueType.Date]: "string",
    [ValueType.Hyperlink]: "string",
    [ValueType.Formula]: "string",
    [ValueType.SharedString]: "string",
    [ValueType.RichText]: "string",
    [ValueType.Boolean]: "boolean",
    [ValueType.Error]: "string"
};

class Validator {
    static convertValue(value: any, schemaType: string): any {
        if (schemaType === "number") return Number(+value) || undefined;
        if (schemaType === "boolean") return value.toString().toLowerCase() === "true";
        if (schemaType === "string") return String(value);
        return value;
    }

    static validateType(excelType: ValueType, schemaType: string, value: any, required: boolean): boolean {
        const expectedType = excelTypeToSchemaType[excelType];

        if (required && (value === undefined || value === null || value === "")) {
            return false;
        }

        if (schemaType === "array") return Array.isArray(value);

        return expectedType === schemaType;
    }
}

@Service()
export class TaskRunnerService {
    async run(task: Task, format: Format): Promise<void> {
        const filePath = path.resolve(process.cwd(), "uploads", task.filename);

        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        const formatIdx = task.formats.findIndex(v => v.formatId === format.formatId)

        format.status = TaskStatus.processing;
        task.formats[formatIdx] = format;
        await task.save();

        range(2, worksheet.rowCount - 1)
            .pipe(
                bufferCount(1000),
                observeOn(queueScheduler),
                concatMap(batch =>
                    forkJoin(batch.map(rowIndex => {
                        const row = worksheet.getRow(rowIndex);
                        return this.processRow(row, format, task);
                    }))
                )
            ).subscribe({
            complete: () => {
                format.status = TaskStatus.done;
                task.formats[formatIdx] = format;
                task.save();
            }
        });
    }

    async processRow(row: Row, format: Format, task: Task): Promise<void> {
        const rowData: Record<string, any> = {};
        const errors: any[] = [];

        Object.entries(format.jsonSchema.properties).forEach(([key, prop]: any, i) => {
            const cell = row.getCell(i + 1);
            let value: any;

            const isRequired = format.jsonSchema.required.includes(key);

            if (prop.type === "array") {
                value = this.processArrayValue(cell, prop, isRequired, errors);
            } else {
                value = Validator.convertValue(cell.value, prop.type);
                if (!Validator.validateType(cell.type, prop.type, value, isRequired)) {
                    errors.push({ row: cell.row, col: cell.col });
                    return;
                }
            }

            rowData[key] = value;
        });

        if (errors.length > 0) {
            await this.saveErrors(errors, task, format);
            return;
        }

        await DataModel.create({
            taskId: task.taskId,
            formatId: format.formatId,
            status: DataStatus.success,
            value: rowData
        });
    }

    private processArrayValue(cell: any, prop: any, isRequired: boolean, errors: any[]): any[] | undefined {
        if (isRequired && !cell.value) {
            errors.push({ row: cell.row, col: cell.col });
            return undefined;
        }

        if (cell.value) {
            const itemType = prop.items.type;
            return String(cell.value).split(",").map(v => Validator.convertValue(v.trim(), itemType));
        }

        return undefined;
    }

    private async saveErrors(errors: any[], task: Task, format: Format): Promise<void> {
        await Promise.all(errors.map(error =>
            DataModel.create({
                taskId: task.taskId,
                formatId: format.formatId,
                status: DataStatus.failure,
                value: error
            })
        ));
    }
}
