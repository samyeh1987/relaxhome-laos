/**
 * RelaxHome — Database Layer
 * Uses sql.js (pure JS SQLite, async init)
 */
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'relaxhome.db');

let db = null;
let SQL = null;

async function loadDB() {
  SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  return db;
}

function saveDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function run(sql, params = []) {
  db.run(sql, params);
  const res = db.exec('SELECT last_insert_rowid()');
  const id = res[0] ? res[0].values[0][0] : null;
  return { lastInsertRowid: id };
}

function get(sql, params = []) {
  const res = db.exec(sql, params);
  if (!res || !res[0]) return undefined;
  const cols = res[0].columns;
  const row = res[0].values[0];
  if (!row) return undefined;
  const obj = {};
  cols.forEach((c, i) => (obj[c] = row[i]));
  return obj;
}

function all(sql, params = []) {
  const res = db.exec(sql, params);
  if (!res || !res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = row[i]));
    return obj;
  });
}

function initDB() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS therapists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    shop_name TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    experience_years INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    lat REAL DEFAULT 0,
    lng REAL DEFAULT 0,
    address TEXT DEFAULT '',
    fee_paid INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    therapist_id INTEGER,
    name_zh TEXT NOT NULL,
    name_en TEXT DEFAULT '',
    name_th TEXT DEFAULT '',
    category TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL,
    desc_zh TEXT DEFAULT '',
    desc_en TEXT DEFAULT '',
    desc_th TEXT DEFAULT '',
    active INTEGER DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    therapist_id INTEGER,
    service_id INTEGER,
    duration INTEGER DEFAULT 60,
    price INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    address TEXT DEFAULT '',
    lat REAL DEFAULT 0,
    lng REAL DEFAULT 0,
    scheduled_at DATETIME,
    completed_at DATETIME,
    coupon_code TEXT DEFAULT '',
    discount INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    user_id INTEGER,
    therapist_id INTEGER,
    rating INTEGER NOT NULL,
    comment_zh TEXT DEFAULT '',
    comment_en TEXT DEFAULT '',
    comment_th TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    title TEXT DEFAULT '',
    type TEXT DEFAULT 'percent',
    value INTEGER NOT NULL,
    min_order INTEGER DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    used_count INTEGER DEFAULT 0,
    max_used INTEGER DEFAULT 999,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    label TEXT DEFAULT '',
    address TEXT NOT NULL,
    lat REAL DEFAULT 0,
    lng REAL DEFAULT 0,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT DEFAULT '',
    lat REAL DEFAULT 0,
    lng REAL DEFAULT 0,
    phone TEXT DEFAULT '',
    therapist_count INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title_zh TEXT DEFAULT '',
    title_en TEXT DEFAULT '',
    title_th TEXT DEFAULT '',
    body_zh TEXT DEFAULT '',
    body_en TEXT DEFAULT '',
    body_th TEXT DEFAULT '',
    type TEXT DEFAULT 'info',
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS fee_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    therapist_id INTEGER,
    amount INTEGER DEFAULT 0,
    method TEXT DEFAULT 'transfer',
    status TEXT DEFAULT 'pending',
    evidence_url TEXT DEFAULT '',
    admin_note TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME
  )`);

  saveDB();
  console.log('[DB] Tables initialized.');
}

function seedData() {
  const c = get('SELECT COUNT(*) as c FROM users');
  if (c && c.c > 0) {
    console.log('[DB] Data already seeded, skipping.');
    return;
  }

  const hash = bcrypt.hashSync('123456', 10);

  // Users
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['02012345678', hash, '王小明', 'user']);
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['02087654321', hash, '李小姐', 'user']);
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['admin', hash, '管理員', 'admin']);
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['02022222222', hash, 'Nana · 娜娜', 'therapist']);
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['02033333333', hash, 'Lily · 莉莉', 'therapist']);
  run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)', ['02044444444', hash, 'Mali · 玛丽', 'therapist']);

  const tUsers = all("SELECT id FROM users WHERE role = 'therapist' ORDER BY id");

  // Therapists
  run('INSERT INTO therapists (user_id, shop_name, bio, experience_years, rating, review_count, lat, lng, address, verified, fee_paid) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [tUsers[0].id, 'Vientiane Relax Center', '拥有3年专业按摩经验，擅长寮式传统按摩', 3, 4.9, 280, 17.9757, 102.6331, '万象市中心 Lane Xang Ave', 1, 1]);
  run('INSERT INTO therapists (user_id, shop_name, bio, experience_years, rating, review_count, lat, lng, address, verified, fee_paid) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [tUsers[1].id, 'That Luang Spa', '5年经验，精通泰式按摩与精油护理', 5, 4.8, 195, 17.9880, 102.6200, '塔銮附近 That Luang Rd', 1, 1]);
  run('INSERT INTO therapists (user_id, shop_name, bio, experience_years, rating, review_count, lat, lng, address, verified, fee_paid) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [tUsers[2].id, 'Sikhottabong Wellness', '精油按摩专家，天然精油调配师', 4, 4.7, 150, 17.9667, 102.6000, '西可他邦县 Sikhottabong', 1, 1]);

  const t1 = get('SELECT id FROM therapists WHERE user_id = ?', [tUsers[0].id]);
  const t2 = get('SELECT id FROM therapists WHERE user_id = ?', [tUsers[1].id]);
  const t3 = get('SELECT id FROM therapists WHERE user_id = ?', [tUsers[2].id]);

  // Services
  const svcs = [
    [t1.id, '寮式传统按摩', 'Lao Traditional Massage', 'ນວດລາວ', 'lao', 60, 150000, '老挝传统手法，疏经活络'],
    [t1.id, '寮式传统按摩 90min', 'Lao Traditional 90min', 'ນວດລາວ 90 ນທ', 'lao', 90, 220000, '深度放松，消除全身疲劳'],
    [t1.id, '足底按摩', 'Foot Massage', 'ນວດຕີນ', 'foot', 60, 80000, '刺激足部穴位，缓解腿部疲劳'],
    [t2.id, '泰式按摩', 'Thai Massage', 'ນວດໄທ', 'thai', 60, 130000, '传统泰式伸展，活络筋骨'],
    [t2.id, '泰式按摩 90min', 'Thai Massage 90min', 'ນວດໄທ 90 ນທ', 'thai', 90, 200000, '深度泰式按压，恢复柔韧性'],
    [t2.id, '头颈肩背按摩', 'Head Neck Shoulder', 'ນວດຫົວ ຄໍ ບ່າ', 'neck', 45, 90000, '针对办公族，解除颈肩酸痛'],
    [t3.id, '精油按摩', 'Oil Massage', 'ນວດນ້ຳມັນ', 'oil', 60, 150000, '天然香薰精油，滋润肌肤'],
    [t3.id, '精油全身按摩 90min', 'Full Body Oil 90min', 'ນວດນ້ຳມັນ 90 ນທ', 'oil', 90, 230000, '全身精油护理，深层滋润放松'],
  ];
  for (const s of svcs) {
    run('INSERT INTO services (therapist_id, name_zh, name_en, name_th, category, duration, price, desc_zh) VALUES (?,?,?,?,?,?,?,?)', s);
  }

  // Shops
  run('INSERT INTO shops (name, address, lat, lng, phone, therapist_count, rating) VALUES (?,?,?,?,?,?,?)',
    ['Vientiane Relax Center', '万象市中心 Lane Xang Ave', 17.9757, 102.6331, '02022222222', 6, 4.8]);
  run('INSERT INTO shops (name, address, lat, lng, phone, therapist_count, rating) VALUES (?,?,?,?,?,?,?)',
    ['That Luang Spa', '塔銮附近 That Luang Rd', 17.9880, 102.6200, '02033333333', 4, 4.7]);
  run('INSERT INTO shops (name, address, lat, lng, phone, therapist_count, rating) VALUES (?,?,?,?,?,?,?)',
    ['Sikhottabong Wellness', '西可他邦县 Sikhottabong', 17.9667, 102.6000, '02044444444', 3, 4.6]);

  // Coupons
  run('INSERT INTO coupons (code, title, type, value, min_order, max_used) VALUES (?,?,?,?,?,?)',
    ['WELCOME10', '新用户专享9折', 'percent', 10, 100000, 1]);
  run('INSERT INTO coupons (code, title, type, value, min_order, max_used) VALUES (?,?,?,?,?,?)',
    ['NEWUSER20', '首单立减20%', 'percent', 20, 150000, 1]);
  run('INSERT INTO coupons (code, title, type, value, min_order, max_used) VALUES (?,?,?,?,?,?)',
    ['RELAX50K', '满减优惠券', 'fixed', 50000, 200000, 99]);

  // Demo orders
  const o1 = run('INSERT INTO orders (order_no, user_id, therapist_id, service_id, duration, price, status, address, scheduled_at) VALUES (?,?,?,?,?,?,?,?,?)',
    ['R2026001', 1, t1.id, 1, 60, 150000, 'completed', '万象市中心 Lane Xang Ave 123号', '2026-06-20 14:00:00']);
  run('INSERT INTO orders (order_no, user_id, therapist_id, service_id, duration, price, status, address, scheduled_at) VALUES (?,?,?,?,?,?,?,?,?)',
    ['R2026002', 1, t2.id, 4, 60, 130000, 'confirmed', '万象市 Samsenthai Rd 45号', '2026-06-28 15:00:00']);
  run('INSERT INTO orders (order_no, user_id, therapist_id, service_id, duration, price, status, address) VALUES (?,?,?,?,?,?,?,?)',
    ['R2026003', 2, t3.id, 7, 60, 150000, 'pending', '西可他邦县某街道']);

  // Demo reviews
  run('INSERT INTO reviews (order_id, user_id, therapist_id, rating, comment_zh, tags) VALUES (?,?,?,?,?,?)',
    [o1.lastInsertRowid, 1, t1.id, 5, '技师非常专业，手法到位，全身放松！', '["手法专业","准时到达","环境整洁"]']);

  // Addresses
  run('INSERT INTO addresses (user_id, label, address, lat, lng, is_default) VALUES (?,?,?,?,?,?)',
    [1, '家', '万象市中心 Lane Xang Ave 123号', 17.9757, 102.6331, 1]);
  run('INSERT INTO addresses (user_id, label, address, lat, lng, is_default) VALUES (?,?,?,?,?,?)',
    [1, '公司', '万象市 Samsenthai Rd 45号', 17.9650, 102.6200, 0]);

  // Notifications
  run('INSERT INTO notifications (user_id, title_zh, title_en, body_zh, body_en, type) VALUES (?,?,?,?,?,?)',
    [1, '订单确认', 'Order Confirmed', '您的订单 R2026002 已确认，技师将于明日15:00准时到达', 'Your order R2026002 is confirmed', 'order']);
  run('INSERT INTO notifications (user_id, title_zh, title_en, body_zh, body_en, type) VALUES (?,?,?,?,?,?)',
    [1, '优惠活动', 'Promotion', '新用户专享折扣券 WELCOME10 已发放到您账户', 'Your coupon WELCOME10 is ready', 'promo']);

  saveDB();
  console.log('[DB] Seed data inserted.');
}

module.exports = { run, get, all, initDB, seedData, saveDB, loadDB };
