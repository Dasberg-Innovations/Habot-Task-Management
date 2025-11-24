import { Task } from '../Models/TaskMode'

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('username');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTask = async (req, res) => {
    const task = new Task({
        username: req.body.username,
        Task_Title: req.body.Task_Title,
        Description: req.body.Description,
        Task_Completed: req.body.Task_Completed || false
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
