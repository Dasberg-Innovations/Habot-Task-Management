import mongoose, { mongo } from "mongoose";

const TaskSchema = mongoose.Schema(
    {
    Task_Title: {
        type: String,
        required: true,
        trim: true,
    },
    Task_Completed: {
        type: Boolean,
        default: false
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        }
    },

    {
        timestamps: true
    }
);

export const Task = mongoose.model('Task', TaskSchema, 'Tasks')