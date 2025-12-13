import React, { useState, useEffect } from 'react';
import { MdOutlineDone, MdModeEditOutline, MdAdd, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const TaskManager = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', priority: 'Medium', urgency: 'Medium' });
    const [editTask, setEditTask] = useState({ id: null, title: '', description: '' });
    const [newSubTask, setNewSubTask] = useState({ taskId: null, title: '' });
    const [expandedTasks, setExpandedTasks] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user && fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/tasks/user/${user.id}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.description || !user) return;

        setLoading(true);
        try {
            const dueDateToSend = newTask.due_date ? new Date(newTask.due_date + 'T00:00:00').toISOString() : null;

            const response = await axios.post('http://localhost:5555/tasks', {
                userId: user.id,
                Task_Title: newTask.title,
                Description: newTask.description,
                Task_Completed: false,
                Due_Date: dueDateToSend,
                Priority: newTask.priority,
                Urgency: newTask.urgency
            });
            
            setTasks([...tasks, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Failed to add task: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const response = await axios.put(`http://localhost:5555/tasks/${id}`, {
                Task_Completed: !task.Task_Completed
            });

            setTasks(tasks.map(t => t._id === id ? response.data : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await axios.delete(`http://localhost:5555/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    const saveEdit = async () => {
        if (!editTask.title.trim() || !editTask.description.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5555/tasks/${editTask.id}`, {
                Task_Title: editTask.title,
                Description: editTask.description
            });

            setTasks(tasks.map(t => t._id === editTask.id ? response.data : t));
            setEditTask({ id: null, title: '', description: '' });
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const addSubTask = async (taskId) => {
        if (!newSubTask.title.trim()) {
            alert('Please enter a subtask title');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5555/tasks/${taskId}/subtasks`, {
                title: newSubTask.title
            });

            setTasks(tasks.map(t => t._id === taskId ? response.data : t));
            setNewSubTask({ taskId: null, title: '' });
        } catch (error) {
            console.error('Error adding subtask:', error);
            alert('Failed to add subtask. Please try again.');
        }
    };

    const toggleSubTask = async (taskId, subTaskId, completed) => {
        try {
            const response = await axios.put(`http://localhost:5555/tasks/${taskId}/subtasks/${subTaskId}`, {
                completed: !completed
            });

            setTasks(tasks.map(t => t._id === taskId ? response.data : t));
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
    };

    const deleteSubTask = async (taskId, subTaskId) => {
        if (!window.confirm('Are you sure you want to delete this subtask?')) return;

        try {
            const response = await axios.delete(`http://localhost:5555/tasks/${taskId}/subtasks/${subTaskId}`);
            setTasks(tasks.map(t => t._id === taskId ? response.data : t));
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('Failed to delete subtask. Please try again.');
        }
    };

    const calculateProgress = (task) => {
        if (!task.SubTasks?.length) return 0;
        const completed = task.SubTasks.filter(sub => sub.completed).length;
        return (completed / task.SubTasks.length) * 100;
    };

    const resetForm = () => {
        setNewTask({ title: '', description: '', due_date: '', priority: 'Medium', urgency: 'Medium' });
        setIsModalOpen(false);
    };

    const toggleExpandTask = (taskId) => {
        setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const Modal = ({ title, isOpen, onClose, children }) => {
        if (!isOpen) return null;
        
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                            <IoClose size={24} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen p-4">
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="mb-4 bg-green-600 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Task'}
            </button>

            <div className="flex flex-col space-y-4 w-full">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No tasks yet. Add your first task!</div>
                ) : (
                    tasks.map(task => {
                        const progress = calculateProgress(task);
                        return (
                            <div key={task._id} className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleExpandTask(task._id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {expandedTasks[task._id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                            </button>
                                            <button
                                                onClick={() => toggleTask(task._id)}
                                                className={`h-6 w-6 border rounded-full flex items-center justify-center transition-colors ${
                                                    task.Task_Completed 
                                                        ? "bg-green-500 border-green-500" 
                                                        : "border-gray-300 hover:border-green-500"
                                                }`}
                                            >
                                                {task.Task_Completed && <MdOutlineDone className="text-white" size={14} />}
                                            </button>
                                            <span className={`text-lg font-semibold ${task.Task_Completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {task.Task_Title}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 mt-1 ml-7">{task.Description}</span>
                                        <div className="text-xs text-gray-500 mt-1 ml-7">
                                            Priority: {task.Priority} | Urgency: {task.Urgency} | Due: {new Date(task.Due_Date).toLocaleDateString()}
                                        </div>
                                        
                                        {task.SubTasks?.length > 0 && (
                                            <div className="mt-2 ml-7">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-x-2 ml-4">
                                        <button
                                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                                            onClick={() => setEditTask({ id: task._id, title: task.Task_Title, description: task.Description })}
                                        >
                                            <MdModeEditOutline />
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {expandedTasks[task._id] && (
                                    <div className="mt-4 ml-7 border-t pt-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-700">Subtasks</h4>
                                            <button
                                                onClick={() => setNewSubTask({ taskId: task._id, title: '' })}
                                                className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                                            >
                                                <MdAdd size={16} />
                                                Add Subtask
                                            </button>
                                        </div>

                                        {newSubTask.taskId === task._id && (
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={newSubTask.title}
                                                    onChange={(e) => setNewSubTask({ ...newSubTask, title: e.target.value })}
                                                    placeholder="Enter subtask title"
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => addSubTask(task._id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => setNewSubTask({ taskId: null, title: '' })}
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {task.SubTasks?.length > 0 ? (
                                                task.SubTasks.map((subTask) => (
                                                    <div key={subTask._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <button
                                                                onClick={() => toggleSubTask(task._id, subTask._id, subTask.completed)}
                                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                                    subTask.completed 
                                                                        ? 'bg-green-500 border-green-500 text-white' 
                                                                        : 'border-gray-300 hover:border-green-500'
                                                                }`}
                                                            >
                                                                {subTask.completed && <MdOutlineDone size={14} />}
                                                            </button>
                                                            <span className={`flex-1 ${subTask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                                {subTask.title}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteSubTask(task._id, subTask._id)}
                                                            className="text-red-400 hover:text-red-600 transition-colors ml-2"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-gray-400 py-4">No subtasks yet. Add your first subtask!</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Task Modal */}
            <Modal title="Add New Task" isOpen={isModalOpen} onClose={() => !loading && setIsModalOpen(false)}>
                <form onSubmit={addTask} className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="Enter task title"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Enter task description"
                            rows="3"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <select
                            value={newTask.urgency}
                            onChange={(e) => setNewTask({ ...newTask, urgency: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Low">Low Urgency</option>
                            <option value="Medium">Medium Urgency</option>
                            <option value="High">High Urgency</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Task Modal */}
            <Modal title="Edit Task" isOpen={!!editTask.id} onClose={() => setEditTask({ id: null, title: '', description: '' })}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    saveEdit();
                }} className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            value={editTask.title}
                            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                            placeholder="Enter task title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editTask.description}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                            placeholder="Enter task description"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditTask({ id: null, title: '', description: '' })}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TaskManager;