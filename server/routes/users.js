const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all users
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
