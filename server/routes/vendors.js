const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all vendors
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new vendor
router.post('/', async (req, res) => {
    const { name, category, rating, revenue } = req.body;
    const { data, error } = await supabase
        .from('vendors')
        .insert([{ name, category, rating, revenue }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

module.exports = router;
