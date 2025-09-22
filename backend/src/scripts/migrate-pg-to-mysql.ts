import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../module/imc/entities/user.entity';
import { ImcRecord } from '../module/imc/entities/imc-record.entity';

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var ${name}`);
  return v;
}

async function createPostgresDS() {
  return new DataSource({
    type: 'postgres',
    host: env('PG_HOST'),
    port: parseInt(env('PG_PORT', '6543'), 10),
    username: env('PG_USER'),
    password: env('PG_PASS'),
    database: env('PG_NAME'),
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    entities: [User, ImcRecord],
    synchronize: false
  }).initialize();
}

async function createMysqlDS() {
  return new DataSource({
    type: 'mysql',
    host: env('MYSQLHOST'),
    port: parseInt(env('MYSQLPORT', '3306'), 10),
    username: env('MYSQLUSER'),
    password: env('MYSQLPASSWORD'),
    database: env('MYSQLDATABASE'),
    entities: [User, ImcRecord],
    // Solo durante la migración creamos el schema para que matchee entidades
    synchronize: true
  }).initialize();
}
async function migrate() {
  const pg = await createPostgresDS();
  const my = await createMysqlDS();
  try {
    const pgUserRepo = pg.getRepository(User);
    const pgImcRepo = pg.getRepository(ImcRecord);

    const myUserRepo = my.getRepository(User);
    const myImcRepo = my.getRepository(ImcRecord);

    //Migración de usuarios
    console.log('Lectura de usuarios desde Postgres...');
    const users = await pgUserRepo.find();
    console.log(`Users: ${users.length}`);

    if (users.length) {
      await myUserRepo
        .createQueryBuilder()
        .insert()
        .values(
          users.map((u) => ({
            id: u.id,
            email: u.email,
            password: u.password,
            createdAt: u.createdAt
          }))
        )
        .orIgnore()
        .execute();
      console.log('Usuarios insertados en MySQL');
    }

    //Migración de registros IMC
    console.log('Lectura de registros IMC desde Postgres...');
    const imcs = await pgImcRepo.find();
    console.log(`IMC records: ${imcs.length}`);

    if (imcs.length) {
      await myImcRepo
        .createQueryBuilder()
        .insert()
        .values(
          imcs.map((r) => ({
            id: r.id, // uuid como string
            pesoKg: r.pesoKg,
            alturaM: r.alturaM,
            imc: r.imc,
            categoria: r.categoria,
            createdAt: r.createdAt,
            user_id: r.user_id ?? null
          }))
        )
        .orIgnore()
        .execute();
      console.log('Registros IMC insertados en MySQL');
    }
    //Cuenta cuántos registros quedaron en MySQL para verificar la migración.
    const [myUsersCount, myImcCount] = await Promise.all([myUserRepo.count(), myImcRepo.count()]);
    console.log(`MySQL counts -> users: ${myUsersCount}, imc_records: ${myImcCount}`);

    //Cierre de conexiones
  } finally {
    await Promise.allSettled([pg.destroy(), my.destroy()]);
  }
}
//Ejecuta la migración.
migrate()
  .then(() => {
    console.log('La migración se ha completado correctamente.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migración fallida:', err);
    process.exit(1);
  });