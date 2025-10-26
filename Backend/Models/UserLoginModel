import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            sparse: true
        },

        email: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            lowercase: true,
            sparse: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a Valid Email Address.']
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['User', 'Admin'],
            default: 'User'
        }
    },

    {
        timestamps: true
    }
);

UserSchema.pre('validate', function (next) {
    if (this.identifierType === 'email') {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(this.identifier)) {
            this.invalidate('identifier', 'Please enter a valid email address');
        }
    }
    next();
});

UserSchema.pre('save', function (next) {
    if (this.identifier.toLowerCase() === 'admin' ||
        this.identifier.toLowerCase() === 'admin@example.com') {
        this.role = 'Admin';
    }
    next();
});

export const User = mongoose.model('User', UserSchema, 'User');
export default User;