import mongoose, { Schema, Document } from 'mongoose';

export const TaskStatus = {
    pending: "pending",
    processing: "processing",
    done: "done",
} as const;

export interface Task extends Document{
    taskId: string;
    filename: string;
    uploadedAt: Date;
    formats: Format[]
}

export interface Format {
    formatId: string;
    formatName: string;
    jsonSchema: Record<string, any>,
    status: keyof typeof TaskStatus;
    processedAt?: Date;
}

export const TaskSchema = new Schema({
    taskId: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    formats: {
        type: [
            {
                formatId: { type: 'string', required: true, unique: true },
                formatName: { type: 'string', required: true, unique: true },
                jsonSchema: { type: Schema.Types.Mixed, required: true },
                status: {
                    type: String,
                    enum:  Object.keys(TaskStatus),
                    default: TaskStatus.pending
                },
                processedAt: { type: Date }
            }
        ],
        default: []
    },
});

export const TaskModel = mongoose.model<Task>('Task', TaskSchema);



