import { Router, Request, Response } from 'express';
const bcrypt = require('bcrypt');
import pool from '../db';
const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  console.log('BODY:', req.body); // <-- Agrega este log
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err: any) {
    console.error('REGISTER ERROR:', err); // <-- Agrega este log
    if (err.code === '23505') { // unique_violation
      res.status(409).json({ error: 'Email ya registrado' });
    } else {
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
});


// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Puedes enviar más info si lo necesitas
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;