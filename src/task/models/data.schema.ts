import mongoose, { Schema } from 'mongoose';

export const DataStatus = {
    success: 'success',
    failure: 'failure',
}

export const DataSchema = new Schema({
    taskId: { type: String, required: true },
    formatId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum:  Object.keys(DataStatus),
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
        required: true,
    }
});

export const DataModel = mongoose.model('Data', DataSchema);



