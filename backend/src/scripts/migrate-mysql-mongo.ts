// src/scripts/migrate-mysql-mongo.ts
import 'reflect-metadata';
import path from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.migration') });

import {
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { MongoClient } from 'mongodb';

/* ========== Entidades mínimas MySQL (lectura) ========== */
@Entity({ name: 'users' })
class MysqlUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt!: Date;
}

@Entity({ name: 'imc_records' })
class MysqlImcRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('numeric', { name: 'pesokg', precision: 5, scale: 2 })
  pesoKg!: number;

  @Column('numeric', { name: 'alturam', precision: 3, scale: 2 })
  alturaM!: number;

  @Column('numeric', { precision: 5, scale: 2 })
  imc!: number;

  @Column({ type: 'varchar', length: 20 })
  categoria!: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  user_id!: number | null;
}

/* ========== Helpers ========== */
function maskUrl(u: string | undefined) {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch {
    return u.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@');
  }
}
function envReq(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

const MYSQL_URL = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || '';
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_PUBLIC_URL || '';

/* ========== Conexión MySQL (TypeORM) ========== */
const mysqlDs = new DataSource({
  type: 'mysql',
  url: MYSQL_URL || undefined,
  host: MYSQL_URL ? undefined : envReq('MYSQLHOST'),
  port: MYSQL_URL ? undefined : Number(process.env.MYSQLPORT || 3306),
  username: MYSQL_URL ? undefined : envReq('MYSQLUSER'),
  password: MYSQL_URL ? undefined : envReq('MYSQLPASSWORD'),
  database: MYSQL_URL ? undefined : envReq('MYSQLDATABASE'),
  entities: [MysqlUser, MysqlImcRecord],
  synchronize: false,
  logging: false,
  ssl: MYSQL_URL || process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

/* ========== Conexión Mongo (driver nativo) ========== */
/** Construimos la URL si no hay MONGO_URL */
const mongoUrlFromParts =
  `mongodb://${envReq('MONGOUSER')}:${envReq('MONGOPASSWORD')}` +
  `@${envReq('MONGOHOST')}:${envReq('MONGOPORT')}/${envReq('MONGODATABASE')}` +
  // tls=true (alias de ssl=true en drivers nuevos), authSource admin,
  // retryWrites off para proxies, directConnection true.
  `?authSource=admin&tls=true&retryWrites=false&directConnection=true`;

let mongoConnString = MONGO_URL || mongoUrlFromParts;

/** Aseguramos que tenga tls=true aunque venga desde MONGO_URL */
try {
  const u = new URL(mongoConnString);
  if (!u.searchParams.has('tls') && !u.searchParams.has('ssl')) {
    u.searchParams.set('tls', 'true');
  }
  // En Railway proxy el cert no es público -> permitimos cert inválido via opción (ver abajo)
  if (!u.searchParams.has('retryWrites')) u.searchParams.set('retryWrites', 'false');
  if (!u.searchParams.has('directConnection')) u.searchParams.set('directConnection', 'true');
  mongoConnString = u.toString();
} catch { /* si no parsea como URL, lo dejamos tal cual */ }

/* ========== Main (smoke test) ========== */
async function main() {
  console.log('🔧 .env.migration:', path.resolve(process.cwd(), '.env.migration'));
  console.log('🔎 MYSQL usando:', MYSQL_URL ? maskUrl(MYSQL_URL) : `${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`);
  console.log('🔎 Mongo usando:', maskUrl(mongoConnString));

  // 1) MySQL
  await mysqlDs.initialize();
  console.log('✅ Conectado a MySQL');

  // 2) Mongo (forzamos TLS y permitimos cert del proxy)
  const mongoClient = new MongoClient(mongoConnString, {
    /** Estas opciones evitan el “socket disconnected before secure TLS” en proxies */
    tls: true,
    tlsAllowInvalidCertificates: true,   // ⚠️ solo para migración / entorno controlado
    serverSelectionTimeoutMS: 20000,
  });

  await mongoClient.connect();

  const dbName = (() => {
    try { const u = new URL(mongoConnString); return u.pathname.replace(/^\//, '') || process.env.MONGODATABASE!; }
    catch { return process.env.MONGODATABASE!; }
  })();

  const mongoDb = mongoClient.db(dbName);
  console.log('✅ Conectado a MongoDB');

  // 3) Conteos
  const mysqlUserRepo = mysqlDs.getRepository(MysqlUser);
  const mysqlImcRepo = mysqlDs.getRepository(MysqlImcRecord);

  const [mysqlUsersCount, mysqlImcCount] = await Promise.all([
    mysqlUserRepo.count(),
    mysqlImcRepo.count(),
  ]);

  const [mongoUsersCount, mongoImcCount] = await Promise.all([
    mongoDb.collection('users').countDocuments(),
    mongoDb.collection('imc_records').countDocuments(),
  ]);

  console.log('📊 Conteos actuales:');
  console.table([
    { origen: 'MySQL', tabla: 'users', count: mysqlUsersCount },
    { origen: 'MySQL', tabla: 'imc_records', count: mysqlImcCount },
    { origen: 'Mongo', coleccion: 'users', count: mongoUsersCount },
    { origen: 'Mongo', coleccion: 'imc_records', count: mongoImcCount },
  ]);

  await mysqlDs.destroy();
  await mongoClient.close();
  console.log('🏁 Paso 1 OK (conexiones y conteos).');
}

main().catch((err) => {
  console.error('❌ Error en Paso 1:', err);
  process.exit(1);
});
