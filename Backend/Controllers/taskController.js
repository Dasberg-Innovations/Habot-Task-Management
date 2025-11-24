import { Task } from '../Models/TaskMode'

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('username');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
