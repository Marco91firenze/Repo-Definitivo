"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
exports.createJob = createJob;
exports.getJobs = getJobs;
exports.deleteJob = deleteJob;
exports.saveCVAnalysis = saveCVAnalysis;
exports.getCVAnalysesForJob = getCVAnalysesForJob;
exports.getSyncStatus = getSyncStatus;
exports.updateSyncStatus = updateSyncStatus;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
let db;
const getDbPath = () => {
    const userDataPath = electron_1.app.getPath('userData');
    return path_1.default.join(userDataPath, 'cv-fit-check.db');
};
function initializeDatabase() {
    const dbPath = getDbPath();
    db = new better_sqlite3_1.default(dbPath);
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    // Create tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT,
      min_experience INTEGER,
      required_skills TEXT,
      english_level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cv_analyses (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      cv_filename TEXT NOT NULL,
      cv_content TEXT NOT NULL,
      fit_score REAL,
      experience_score REAL,
      skills_score REAL,
      location_score REAL,
      english_score REAL,
      analysis_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sync_status (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      credits_remaining INTEGER DEFAULT 10,
      total_cvs_processed INTEGER DEFAULT 0,
      last_sync DATETIME,
      license_valid BOOLEAN DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_cv_analyses_job_id ON cv_analyses(job_id);
    CREATE INDEX IF NOT EXISTS idx_cv_analyses_created_at ON cv_analyses(created_at);
  `);
    return db;
}
function getDatabase() {
    if (!db) {
        initializeDatabase();
    }
    return db;
}
function closeDatabase() {
    if (db) {
        db.close();
    }
}
// Job operations
function createJob(jobData) {
    const stmt = db.prepare(`
    INSERT INTO jobs (id, title, location, min_experience, required_skills, english_level)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    return stmt.run(jobData.id, jobData.title, jobData.location, jobData.min_experience, jobData.required_skills, jobData.english_level);
}
function getJobs() {
    const stmt = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC');
    return stmt.all();
}
function deleteJob(jobId) {
    const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');
    return stmt.run(jobId);
}
// CV Analysis operations
function saveCVAnalysis(analysisData) {
    const stmt = db.prepare(`
    INSERT INTO cv_analyses (
      id, job_id, cv_filename, cv_content, fit_score,
      experience_score, skills_score, location_score, english_score, analysis_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    return stmt.run(analysisData.id, analysisData.job_id, analysisData.cv_filename, analysisData.cv_content, analysisData.fit_score, analysisData.experience_score, analysisData.skills_score, analysisData.location_score, analysisData.english_score, analysisData.analysis_json);
}
function getCVAnalysesForJob(jobId) {
    const stmt = db.prepare(`
    SELECT * FROM cv_analyses
    WHERE job_id = ?
    ORDER BY fit_score DESC
  `);
    return stmt.all(jobId);
}
function getSyncStatus() {
    const stmt = db.prepare('SELECT * FROM sync_status LIMIT 1');
    return stmt.get();
}
function updateSyncStatus(data) {
    const existing = getSyncStatus();
    if (!existing) {
        const stmt = db.prepare(`
      INSERT INTO sync_status (user_id, credits_remaining, total_cvs_processed, last_sync, license_valid)
      VALUES (?, ?, ?, ?, ?)
    `);
        return stmt.run(data.user_id || null, data.credits_remaining ?? 10, data.total_cvs_processed ?? 0, data.last_sync || new Date().toISOString(), data.license_valid ?? 1);
    }
    const updates = Object.entries(data)
        .filter(([_key, value]) => value !== undefined)
        .map(([key]) => `${key} = ?`)
        .join(', ');
    const values = Object.entries(data)
        .filter(([_key, value]) => value !== undefined)
        .map(([_key, value]) => value);
    const stmt = db.prepare(`UPDATE sync_status SET ${updates} WHERE id = ?`);
    return stmt.run(...values, existing.id);
}
