const bcrypt = require('bcrypt');
const { User } = require('../models/user');

async function register(name, email, password) {
    const existing = await User.findOne({ email });

    if (existing) {
        const err = new Error('Email is already used');
        err.errors = { email: 'Email is already used' };
        throw err;
    }

    const user = new User({
        email,
        name,
        password: await bcrypt.hash(password, 10)
    });

    try {
        await user.save();
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            if (field === 'name') {
                throw new Error('This name is already used!');
            } else if (field === 'email') {
                throw new Error('This email is already used!');
            }
        }
        throw err; // Rethrow any other errors
    }
    return user;
}

async function login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return user;
}

module.exports = {
    register,
    login
};