const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all clients
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new client
router.post('/', async (req, res) => {
    const { company, contact, plan, users } = req.body;
    // Mapping frontend keys to DB columns
    const dbPayload = {
        company_name: company,
        contact_person: contact,
        plan_tier: plan,
        users_count: users
    };

    const { data, error } = await supabase
        .from('clients')
        .insert([dbPayload])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

module.exports = router;
