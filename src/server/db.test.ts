import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseService, translateSql, normalizeParams } from './db';
import { migrations } from './migrations';

describe('SQL Translation & Dialect Compatibility', () => {
  it('translates INSERT OR REPLACE INTO to REPLACE INTO for MySQL', () => {
    const sqliteSql = 'INSERT OR REPLACE INTO users (id, name, email) VALUES (?, ?, ?)';
    const mysqlSql = translateSql(sqliteSql, 'mysql');
    assert.match(mysqlSql, /REPLACE INTO users/i);
    assert.doesNotMatch(mysqlSql, /INSERT OR REPLACE/i);
  });

  it('translates datetime("now") to NOW() for MySQL', () => {
    const sqliteSql = "INSERT INTO records (marked_at) VALUES (datetime('now'))";
    const mysqlSql = translateSql(sqliteSql, 'mysql');
    assert.match(mysqlSql, /NOW\(\)/i);
    assert.doesNotMatch(mysqlSql, /datetime\('now'\)/i);
  });

  it('translates date("now") to CURDATE() for MySQL', () => {
    const sqliteSql = "INSERT INTO sessions (session_date) VALUES (date('now'))";
    const mysqlSql = translateSql(sqliteSql, 'mysql');
    assert.match(mysqlSql, /CURDATE\(\)/i);
  });

  it('translates AUTOINCREMENT to AUTO_INCREMENT for MySQL', () => {
    const sqliteSql = 'CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT)';
    const mysqlSql = translateSql(sqliteSql, 'mysql');
    assert.match(mysqlSql, /INT AUTO_INCREMENT PRIMARY KEY/i);
  });

  it('normalizes boolean parameters for SQLite (true -> 1, false -> 0)', () => {
    const params = [true, false, 'text', 42];
    const normalized = normalizeParams(params, 'sqlite');
    assert.deepEqual(normalized, [1, 0, 'text', 42]);
  });
});

describe('Migrations Definition', () => {
  it('contains expected smart attendance migrations', () => {
    assert.ok(migrations.length >= 5);
    const names = migrations.map((m) => m.name);
    assert.ok(names.includes('create_users_table'));
    assert.ok(names.includes('create_courses_table'));
    assert.ok(names.includes('create_sessions_table'));
    assert.ok(names.includes('create_attendance_records_table'));
    assert.ok(names.includes('create_app_settings_table'));
  });

  it('provides both sqliteUp and mysqlUp DDL definitions for every migration', () => {
    for (const migration of migrations) {
      assert.ok(migration.sqliteUp.length > 0, `${migration.name} missing sqliteUp`);
      assert.ok(migration.mysqlUp.length > 0, `${migration.name} missing mysqlUp`);
    }
  });
});

describe('SQLite Database Service (Fallback when MYSQL_HOST is not set)', () => {
  let db: DatabaseService;

  it('falls back to SQLite when MYSQL_HOST is not set', () => {
    db = new DatabaseService({ sqlitePath: ':memory:' });
    assert.equal(db.getDialect(), 'sqlite');
    assert.ok(db.getSqlite() !== null);
    assert.equal(db.getPool(), null);
  });

  it('executes async migrations and creates tables', async () => {
    await db.initSchema();
    const tables = await db.query<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const tableNames = tables.map((t) => t.name);
    assert.ok(tableNames.includes('users'));
    assert.ok(tableNames.includes('courses'));
    assert.ok(tableNames.includes('sessions'));
    assert.ok(tableNames.includes('attendance_records'));
    assert.ok(tableNames.includes('app_settings'));
  });

  it('performs async INSERT and query operations on users table', async () => {
    const insertRes = await db.execute(
      'INSERT INTO users (name, email, role, is_active) VALUES (?, ?, ?, ?)',
      ['Jane Doe', 'jane@example.com', 'teacher', true]
    );
    assert.ok(insertRes.insertId && insertRes.insertId > 0);
    assert.equal(insertRes.changes, 1);

    const user = await db.get<{ id: number; name: string; email: string; role: string; is_active: number }>(
      'SELECT * FROM users WHERE email = ?',
      ['jane@example.com']
    );
    assert.ok(user !== null);
    assert.equal(user.name, 'Jane Doe');
    assert.equal(user.role, 'teacher');
    assert.equal(user.is_active, 1);
  });

  it('performs async INSERT OR REPLACE operations via translated SQL and helper', async () => {
    await db.execute(
      "INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))",
      ['attendance_window_mins', '15']
    );

    let setting = await db.get<{ key: string; value: string }>(
      'SELECT * FROM app_settings WHERE key = ?',
      ['attendance_window_mins']
    );
    assert.equal(setting?.value, '15');

    // Replace existing setting
    await db.execute(
      "INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))",
      ['attendance_window_mins', '30']
    );

    setting = await db.get<{ key: string; value: string }>(
      'SELECT * FROM app_settings WHERE key = ?',
      ['attendance_window_mins']
    );
    assert.equal(setting?.value, '30');
  });

  it('records attendance session and marks attendance', async () => {
    const courseRes = await db.execute(
      'INSERT INTO courses (code, name) VALUES (?, ?)',
      ['CS101', 'Intro to Computer Science']
    );
    const courseId = courseRes.insertId;

    const sessionRes = await db.execute(
      "INSERT INTO sessions (course_id, title, session_date) VALUES (?, ?, date('now'))",
      [courseId, 'Lecture 1: Basics']
    );
    const sessionId = sessionRes.insertId;

    const userRes = await db.execute(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      ['Bob Smith', 'bob@example.com', 'student']
    );
    const userId = userRes.insertId;

    // Mark attendance
    const recordRes = await db.execute(
      "INSERT INTO attendance_records (session_id, user_id, status, is_verified, marked_at) VALUES (?, ?, ?, ?, datetime('now'))",
      [sessionId, userId, 'present', true]
    );
    assert.equal(recordRes.changes, 1);

    const record = await db.get<{ status: string; is_verified: number }>(
      'SELECT status, is_verified FROM attendance_records WHERE session_id = ? AND user_id = ?',
      [sessionId, userId]
    );
    assert.equal(record?.status, 'present');
    assert.equal(record?.is_verified, 1);
  });

  it('closes SQLite connection cleanly', async () => {
    await db.close();
    assert.equal(db.getSqlite(), null);
  });
});

describe('MySQL Connection Configuration & Selection', () => {
  it('selects MySQL when MYSQL_HOST is specified and initializes connection pool', () => {
    const mysqlDb = new DatabaseService({
      mysqlHost: '127.0.0.1',
      mysqlPort: 3306,
      mysqlDatabase: 'smart_attendance',
      mysqlUser: 'attendance_user',
      mysqlPassword: 'secretpassword',
      mysqlInitSchema: false,
    });

    assert.equal(mysqlDb.getDialect(), 'mysql');
    const pool = mysqlDb.getPool();
    assert.ok(pool !== null);
    assert.equal(typeof pool.query, 'function');
    assert.equal(typeof pool.execute, 'function');
  });

  it('respects MYSQL_INIT_SCHEMA environment configuration', () => {
    const mysqlDb = new DatabaseService({
      mysqlHost: 'mysql.internal',
      mysqlInitSchema: true,
    });
    assert.equal(mysqlDb.getDialect(), 'mysql');
  });
});
