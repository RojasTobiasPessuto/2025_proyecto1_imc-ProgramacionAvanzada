import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import pool from '../db';

@Controller('api')
export class AuthController {
  @Post('register')
  async register(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;
    if (!email || !password) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email y contraseña requeridos' });
    try {
      const hash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hash]
      );
      return res.status(HttpStatus.CREATED).json({ user: result.rows[0] });
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(HttpStatus.CONFLICT).json({ error: 'Email ya registrado' });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error del servidor' });
      }
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;
    if (!email || !password) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email y contraseña requeridos' });
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Credenciales inválidas' });
      }
      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Credenciales inválidas' });
      }
      return res.json({ id: user.id, email: user.email });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error del servidor' });
    }
  }
}
