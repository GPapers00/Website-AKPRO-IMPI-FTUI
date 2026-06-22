const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory (frontend)
const path = require('path');
app.use(express.static(path.join(__dirname, '')));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── API Endpoints ──────────────────────────────────────────────

// 1. Universities Endpoint
app.get('/api/universities', async (req, res) => {
  try {
    const { data, error } = await supabase.from('universities').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ error: "Failed to fetch universities" });
  }
});

// 2. Global Partners Endpoint
app.get('/api/partners', async (req, res) => {
  try {
    const { data, error } = await supabase.from('global_partners').select('*').order('country', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

// 3. Syllabus Mapping Endpoint
app.get('/api/syllabi', async (req, res) => {
  try {
    const { data, error } = await supabase.from('syllabus_mapping').select('*').order('id', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching syllabi:", error);
    res.status(500).json({ error: "Failed to fetch syllabi" });
  }
});

// 4. Diktat Endpoint
app.get('/api/diktat', async (req, res) => {
  try {
    const { data, error } = await supabase.from('diktat').select('*').order('id', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching diktat:", error);
    res.status(500).json({ error: "Failed to fetch diktat" });
  }
});

// 5. Academic Calendar Endpoint
app.get('/api/calendar', async (req, res) => {
  try {
    const { data, error } = await supabase.from('academic_calendar').select('*').order('id', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching calendar:", error);
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
});

// 6. Asistensi Endpoint
app.get('/api/asistensi', async (req, res) => {
  try {
    const { data, error } = await supabase.from('asistensi').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching asistensi:", error);
    res.status(500).json({ error: "Failed to fetch asistensi" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
