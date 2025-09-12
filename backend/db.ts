import { Pool } from 'pg';

const pool = new Pool({
  user: 'imc_user',
  host: 'localhost',
  database: 'db_imc',
  password: 'asdasd',
  port: 5432,
  
});

export default pool;