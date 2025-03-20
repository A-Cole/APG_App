const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role must be either owner or customer').isIn(['owner', 'customer'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, address, badgeID, profilePhoto } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            address,
            badgeID: role === 'owner' ? badgeID : null,
            profilePhoto
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;