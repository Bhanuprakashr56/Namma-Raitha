import dotenv from 'dotenv';
import { DatabaseSync } from 'node:sqlite';
import mysql, { Pool } from 'mysql2/promise';
import { migrations } from './migrations';

dotenv.config();

export type DatabaseDialect = 'mysql' | 'sqlite';

export interface QueryResult {
  insertId?: number;
  changes?: number;
  affectedRows?: number;
}

export interface DatabaseConfig {
  mysqlHost?: string;
  mysqlPort?: number;
  mysqlDatabase?: string;
  mysqlUser?: string;
  mysqlPassword?: string;
  mysqlInitSchema?: boolean;
  sqlitePath?: string;
}

/**
 * SQL Translator between SQLite and MySQL dialects.
 * Converts SQLite-specific SQL constructs (INSERT OR REPLACE, datetime functions,
 * AUTOINCREMENT, boolean columns) to MySQL equivalents when running against MySQL.
 */
export function translateSql(sql: string, targetDialect: DatabaseDialect): string {
  if (targetDialect === 'mysql') {
    let converted = sql;

    // Convert "INSERT OR REPLACE INTO" -> "REPLACE INTO"
    converted = converted.replace(/INSERT\s+OR\s+REPLACE\s+INTO/gi, 'REPLACE INTO');

    // Convert SQLite datetime('now') -> NOW()
    converted = converted.replace(/datetime\(\s*'now'\s*\)/gi, 'NOW()');
    converted = converted.replace(/date\(\s*'now'\s*\)/gi, 'CURDATE()');

    // Convert SQLite AUTOINCREMENT -> AUTO_INCREMENT
    converted = converted.replace(/INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'INT AUTO_INCREMENT PRIMARY KEY');

    return converted;
  }

  if (targetDialect === 'sqlite') {
    let converted = sql;

    // Convert MySQL "REPLACE INTO" -> "INSERT OR REPLACE INTO" if needed
    converted = converted.replace(/^REPLACE\s+INTO/gi, 'INSERT OR REPLACE INTO');

    // Convert MySQL NOW() -> datetime('now')
    converted = converted.replace(/NOW\(\)/gi, "datetime('now')");
    converted = converted.replace(/CURDATE\(\)/gi, "date('now')");

    // Convert MySQL INT AUTO_INCREMENT PRIMARY KEY -> INTEGER PRIMARY KEY AUTOINCREMENT
    converted = converted.replace(/INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');

    return converted;
  }

  return sql;
}

/**
 * Normalize query parameter values across dialects
 * e.g., convert booleans to 1/0 for SQLite if needed.
 */
export function normalizeParams(params: any[] = [], targetDialect: DatabaseDialect): any[] {
  return params.map((p) => {
    if (typeof p === 'boolean') {
      return targetDialect === 'sqlite' ? (p ? 1 : 0) : p;
    }
    return p;
  });
}

export class DatabaseService {
  private dialect: DatabaseDialect = 'sqlite';
  private sqliteDb: DatabaseSync | null = null;
  private mysqlPool: Pool | null = null;
  private initialized = false;

  constructor(private config?: DatabaseConfig) {
    this.configure(config);
  }

  public configure(customConfig?: DatabaseConfig) {
    const host = customConfig?.mysqlHost ?? process.env.MYSQL_HOST;
    const port = customConfig?.mysqlPort ?? (process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306);
    const database = customConfig?.mysqlDatabase ?? process.env.MYSQL_DATABASE ?? 'attendance';
    const user = customConfig?.mysqlUser ?? process.env.MYSQL_USER ?? 'root';
    const password = customConfig?.mysqlPassword ?? process.env.MYSQL_PASSWORD ?? '';
    const initSchema = customConfig?.mysqlInitSchema ?? (process.env.MYSQL_INIT_SCHEMA?.toLowerCase() === 'true');
    const sqlitePath = customConfig?.sqlitePath ?? process.env.SQLITE_DB_PATH ?? ':memory:';

    if (host && host.trim().length > 0) {
      this.dialect = 'mysql';
      this.mysqlPool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });

      if (initSchema) {
        // Asynchronously initialize schema on startup
        this.initSchema().catch((err) => {
          console.error('[DB] Failed to initialize MySQL schema on startup:', err);
        });
      }
    } else {
      // Fallback to SQLite (node:sqlite DatabaseSync)
      this.dialect = 'sqlite';
      this.sqliteDb = new DatabaseSync(sqlitePath);
      // Auto-run migrations for SQLite fallback so database is ready
      this.initSchemaSync();
    }

    this.initialized = true;
  }

  public getDialect(): DatabaseDialect {
    return this.dialect;
  }

  public getPool(): Pool | null {
    return this.mysqlPool;
  }

  public getSqlite(): DatabaseSync | null {
    return this.sqliteDb;
  }

  /**
   * Run schema migrations to create all tables
   */
  public async initSchema(): Promise<void> {
    if (this.dialect === 'mysql') {
      if (!this.mysqlPool) throw new Error('MySQL pool is not configured');
      for (const migration of migrations) {
        for (const sql of migration.mysqlUp) {
          await this.mysqlPool.query(sql);
        }
      }
    } else {
      this.initSchemaSync();
    }
  }

  private initSchemaSync(): void {
    if (!this.sqliteDb) return;
    for (const migration of migrations) {
      for (const sql of migration.sqliteUp) {
        this.sqliteDb.exec(sql);
      }
    }
  }

  /**
   * Execute an async query returning a list of rows
   */
  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const finalSql = translateSql(sql, this.dialect);
    const finalParams = normalizeParams(params, this.dialect);

    if (this.dialect === 'mysql') {
      if (!this.mysqlPool) throw new Error('MySQL pool not initialized');
      const [rows] = await this.mysqlPool.query(finalSql, finalParams);
      return rows as T[];
    } else {
      if (!this.sqliteDb) throw new Error('SQLite database not initialized');
      const stmt = this.sqliteDb.prepare(finalSql);
      const rows = stmt.all(...finalParams);
      return rows as T[];
    }
  }

  /**
   * Execute an async statement returning a single row or null
   */
  public async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Execute an async INSERT/UPDATE/DELETE statement returning affected rows / insert ID
   */
  public async execute(sql: string, params: any[] = []): Promise<QueryResult> {
    const finalSql = translateSql(sql, this.dialect);
    const finalParams = normalizeParams(params, this.dialect);

    if (this.dialect === 'mysql') {
      if (!this.mysqlPool) throw new Error('MySQL pool not initialized');
      const [result] = await this.mysqlPool.execute(finalSql, finalParams);
      const header = result as any;
      return {
        insertId: header.insertId,
        changes: header.affectedRows,
        affectedRows: header.affectedRows,
      };
    } else {
      if (!this.sqliteDb) throw new Error('SQLite database not initialized');
      const stmt = this.sqliteDb.prepare(finalSql);
      const result = stmt.run(...finalParams);
      return {
        insertId: Number(result.lastInsertRowid),
        changes: Number(result.changes),
        affectedRows: Number(result.changes),
      };
    }
  }

  /**
   * Insert or replace helper with cross-dialect compatibility
   */
  public async insertOrReplace(table: string, data: Record<string, any>): Promise<QueryResult> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map((k) => `\`${k}\``).join(', ');
    const values = keys.map((k) => data[k]);

    let sql = '';
    if (this.dialect === 'mysql') {
      sql = `REPLACE INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
    } else {
      sql = `INSERT OR REPLACE INTO "${table}" (${keys.join(', ')}) VALUES (${placeholders})`;
    }

    return this.execute(sql, values);
  }

  /**
   * Gracefully close database connection / pool
   */
  public async close(): Promise<void> {
    if (this.mysqlPool) {
      await this.mysqlPool.end();
      this.mysqlPool = null;
    }
    if (this.sqliteDb) {
      this.sqliteDb.close();
      this.sqliteDb = null;
    }
    this.initialized = false;
  }
}

// Default singleton instance exported for application usage
export const db = new DatabaseService();
export default db;
