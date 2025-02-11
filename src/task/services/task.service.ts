import {Service} from "typedi";
import {DataModel, DataStatus, Format, Task, TaskModel, TaskStatus} from "../models";
import short from "short-uuid"
import {BadRequestError, NotFoundError} from "routing-controllers";
import {TaskFormat} from "../dto";
import {TaskRunnerService} from "./task-runner.service";

@Service()
export class TaskService {
    constructor(private taskRunnerService: TaskRunnerService) {}

    processTask(task: Task, format: Format): void {
        this.taskRunnerService.run(task, format).then()
    }

    async startTask(file: Express.Multer.File): Promise<any> {
        const task = await TaskModel.create({
            filename: file.filename,
            taskId: short.generate()
        });

        return {
            taskId: task.taskId,
        }
    }

    async getStatus(taskId: string, formatId: string): Promise<any> {
        const task = await TaskModel.findOne({
            taskId
        });

        if (!task) {
            throw new NotFoundError("Task not found");
        }

        const format = task.formats.find((f) => f.formatId === formatId);

        if (!format) {
            throw new NotFoundError("Format not found");
        }

        const errors = await DataModel
            .find({
                taskId,
                formatId: formatId,
                status: DataStatus.failure
            })
            .lean();

        return {
            taskId: task.taskId,
            formatId: format.formatId,
            status: format.status,
            errors: errors.map(e => e.value)
        }
    }

    async addFormat(taskId: string, input: TaskFormat): Promise<any> {
        const task = await TaskModel.findOne<Task>({
            taskId
        });

        if (!task) {
            throw new NotFoundError("Task not found");
        }

        const existFormat = task.formats.find((f) => f.formatName === input.formatName);

        if (existFormat) {
            throw new BadRequestError("Format already exists");
        }

        const format = {
            formatId: short.generate(),
            formatName: input.formatName,
            jsonSchema: input.schema,
            status: TaskStatus.pending
        }

        task.formats.push(format)

        await task.save()

        // dispatch action to run process
        this.processTask(task, format);

        return {
            formatId: format.formatId,
        };
    }

    async getTasks() {
        return TaskModel.find().lean();
    }

    async getFormats(taskId: string) {
        const task = await TaskModel.findOne({
            taskId
        });

        if (!task) {
            throw new NotFoundError("Task not found");
        }

        return task.formats.map(f => JSON.stringify(f));

    }

    async getData(taskId: string, formatId: string, page: number, limit: number) {
        const data = await DataModel
            .find({
                taskId,
                formatId,
                status: DataStatus.success
            })
            .select('value')
            .sort({
                createdAt: -1
            })
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .lean()

        const total = await DataModel.countDocuments({
            taskId,
            formatId,
            status: DataStatus.success
        });

        return {
            page,
            limit,
            totalPages: Math.ceil(total / +limit),
            totalRecords: total,
            data: data.map(v => v.value)
        }
    }
}
