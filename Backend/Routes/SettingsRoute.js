import express from 'express';
import { UserSettings } from '../Models/SettingsModel.js';
import { User } from '../Models/UserLoginModel.js';

const router = express.Router();

router.use(express.json());

router.post('/', async (req, res) => {
    const { userId, theme } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const settings = await UserSettings.findOneAndUpdate(
            { user: userId },
            { theme },
            { new: true, upsert: true }
        );

        res.status(201).json(settings);
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const settings = await UserSettings.findOne({ user: req.params.userId });
        res.status(200).json(settings || {});
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;