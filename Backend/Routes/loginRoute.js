import express from 'express';
import User from '../Models/UserLoginModel.js';
import bcrypt from 'bcrypt'; //Encryption for Password

const router = express.Router();