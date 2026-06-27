/**
 * RelaxHome API Server
 * Node.js + Express + sql.js (async SQLite)
 */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'relaxhome_secret_2026';

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, '../app')));

// ─── Auth Middleware ───────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}

// ─── Bootstrap: async start ───────────────────────────────
async function start() {
  const { run, get, all, initDB, seedData, saveDB, loadDB } = require('./database');

  await loadDB();
  initDB();
  seedData();

  // ═══════════════════════════════════
  //  AUTH
  // ═══════════════════════════════════
  app.post('/api/auth/register', (req, res) => {
    const { phone, password, name } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'phone and password required' });
    try {
      const hash = bcrypt.hashSync(password, 10);
      const r = run('INSERT INTO users (phone, password, name, role) VALUES (?,?,?,?)',
        [phone.trim(), hash, (name || '').trim(), 'user']);
      const token = jwt.sign({ id: r.lastInsertRowid, phone, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });
      saveDB();
      res.json({ token, user: { id: r.lastInsertRowid, phone, name: name || '', role: 'user' } });
    } catch {
      res.status(400).json({ error: 'Phone number already registered' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { phone, password, role } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'phone and password required' });
    const user = get('SELECT * FROM users WHERE phone = ?', [phone.trim()]);
    if (!user) return res.status(401).json({ error: 'Phone not registered' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Wrong password' });
    if (role && role !== user.role) return res.status(403).json({ error: `This phone is not a ${role} account` });
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, phone: user.phone, name: user.name, role: user.role, avatar: user.avatar } });
  });

  // ═══════════════════════════════════
  //  USERS
  // ═══════════════════════════════════
  app.get('/api/users/me', auth, (req, res) => {
    const user = get('SELECT id, phone, name, avatar, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const addresses = all('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]);
    let therapist = null;
    if (user.role === 'therapist') {
      therapist = get('SELECT * FROM therapists WHERE user_id = ?', [req.user.id]);
    }
    res.json({ ...user, addresses, therapist });
  });

  app.put('/api/users/me', auth, (req, res) => {
    const { name, avatar } = req.body;
    run('UPDATE users SET name = COALESCE(?,name), avatar = COALESCE(?,avatar) WHERE id = ?',
      [name || null, avatar || null, req.user.id]);
    saveDB();
    res.json({ ok: true });
  });

  // ═══════════════════════════════════
  //  THERAPISTS (public)
  // ═══════════════════════════════════
  app.get('/api/therapists', (req, res) => {
    const { category, limit = 20, offset = 0 } = req.query;
    let sql = `SELECT t.*, u.name, u.avatar, u.phone
      FROM therapists t JOIN users u ON u.id = t.user_id
      WHERE t.active = 1`;
    const params = [];
    if (category && category !== 'all') {
      sql += ` AND EXISTS (SELECT 1 FROM services s WHERE s.therapist_id = t.id AND s.category = ? AND s.active = 1)`;
      params.push(category);
    }
    sql += ` ORDER BY t.rating DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    const list = all(sql, params).map(t => {
      t.services = all('SELECT * FROM services WHERE therapist_id = ? AND active = 1', [t.id]);
      return t;
    });
    res.json(list);
  });

  app.get('/api/therapists/:id', (req, res) => {
    const t = get(
      `SELECT t.*, u.name, u.avatar, u.phone FROM therapists t JOIN users u ON u.id = t.user_id WHERE t.id = ?`,
      [req.params.id]
    );
    if (!t) return res.status(404).json({ error: 'Therapist not found' });
    t.services = all('SELECT * FROM services WHERE therapist_id = ? AND active = 1 ORDER BY price ASC', [t.id]);
    t.reviews = all(
      `SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.therapist_id = ? ORDER BY r.created_at DESC LIMIT 20`,
      [t.id]
    );
    res.json(t);
  });

  // Therapist self-update (for therapist role)
  app.put('/api/therapists/me', auth, authRole('therapist'), (req, res) => {
    const { shop_name, bio, address, lat, lng } = req.body;
    run(
      `UPDATE therapists SET shop_name = COALESCE(?,shop_name), bio = COALESCE(?,bio),
       address = COALESCE(?,address), lat = COALESCE(?,lat), lng = COALESCE(?,lng)
       WHERE user_id = ?`,
      [shop_name || null, bio || null, address || null, lat || null, lng || null, req.user.id]
    );
    saveDB();
    res.json({ ok: true });
  });

  // ═══════════════════════════════════
  //  SERVICES
  // ═══════════════════════════════════
  app.get('/api/services', (req, res) => {
    const { category, therapist_id } = req.query;
    let sql = `SELECT s.*, t.shop_name, u.name as therapist_name, u.avatar as therapist_avatar
      FROM services s
      JOIN therapists t ON t.id = s.therapist_id
      JOIN users u ON u.id = t.user_id
      WHERE s.active = 1`;
    const params = [];
    if (category && category !== 'all') { sql += ' AND s.category = ?'; params.push(category); }
    if (therapist_id) { sql += ' AND s.therapist_id = ?'; params.push(therapist_id); }
    sql += ' ORDER BY s.price ASC';
    res.json(all(sql, params));
  });

  app.post('/api/services', auth, authRole('therapist'), (req, res) => {
    const th = get('SELECT id FROM therapists WHERE user_id = ?', [req.user.id]);
    if (!th) return res.status(404).json({ error: 'Therapist profile not found' });
    const { name_zh, name_en, name_th, category, duration, price, desc_zh } = req.body;
    const r = run(
      `INSERT INTO services (therapist_id, name_zh, name_en, name_th, category, duration, price, desc_zh) VALUES (?,?,?,?,?,?,?,?)`,
      [th.id, name_zh, name_en || '', name_th || '', category, duration, price, desc_zh || '']
    );
    saveDB();
    res.json({ ok: true, id: r.lastInsertRowid });
  });

  // ═══════════════════════════════════
  //  ORDERS
  // ═══════════════════════════════════
  app.get('/api/orders', auth, (req, res) => {
    const { status } = req.query;
    let sql, params;

    if (req.user.role === 'therapist') {
      const th = get('SELECT id FROM therapists WHERE user_id = ?', [req.user.id]);
      sql = `SELECT o.*, s.name_zh as service_name, s.duration as service_duration,
             u2.name as user_name, u2.phone as user_phone
             FROM orders o
             JOIN services s ON s.id = o.service_id
             JOIN users u2 ON u2.id = o.user_id
             WHERE o.therapist_id = ?`;
      params = [th ? th.id : 0];
    } else if (req.user.role === 'admin') {
      sql = `SELECT o.*, s.name_zh as service_name, u.name as user_name,
             u2.name as therapist_name
             FROM orders o
             JOIN services s ON s.id = o.service_id
             JOIN users u ON u.id = o.user_id
             JOIN therapists t ON t.id = o.therapist_id
             JOIN users u2 ON u2.id = t.user_id
             WHERE 1=1`;
      params = [];
    } else {
      sql = `SELECT o.*, s.name_zh as service_name, s.duration as service_duration,
             u.name as therapist_name, u.avatar as therapist_avatar
             FROM orders o
             JOIN services s ON s.id = o.service_id
             JOIN therapists t ON t.id = o.therapist_id
             JOIN users u ON u.id = t.user_id
             WHERE o.user_id = ?`;
      params = [req.user.id];
    }

    if (status) { sql += ` AND o.status = ?`; params.push(status); }
    sql += ' ORDER BY o.created_at DESC';
    res.json(all(sql, params));
  });

  app.post('/api/orders', auth, authRole('user'), (req, res) => {
    const { therapist_id, service_id, address, scheduled_at, notes, coupon_code } = req.body;
    if (!therapist_id || !service_id || !address) {
      return res.status(400).json({ error: 'therapist_id, service_id, address required' });
    }
    const svc = get('SELECT * FROM services WHERE id = ?', [service_id]);
    if (!svc) return res.status(400).json({ error: 'Service not found' });

    let discount = 0;
    let finalPrice = svc.price;
    if (coupon_code) {
      const coupon = get('SELECT * FROM coupons WHERE code = ? AND active = 1', [coupon_code]);
      if (coupon && finalPrice >= coupon.min_order) {
        discount = coupon.type === 'percent'
          ? Math.round(finalPrice * coupon.value / 100)
          : coupon.value;
        finalPrice = Math.max(0, finalPrice - discount);
        run('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?', [coupon_code]);
      }
    }

    const order_no = 'R' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const r = run(
      `INSERT INTO orders (order_no, user_id, therapist_id, service_id, duration, price, address, scheduled_at, notes, coupon_code, discount, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [order_no, req.user.id, therapist_id, service_id, svc.duration, finalPrice, address,
       scheduled_at || null, notes || '', coupon_code || '', discount, 'pending']
    );

    // Notify therapist
    const thUser = get('SELECT u.id FROM therapists t JOIN users u ON u.id = t.user_id WHERE t.id = ?', [therapist_id]);
    if (thUser) {
      run('INSERT INTO notifications (user_id, title_zh, title_en, body_zh, body_en, type) VALUES (?,?,?,?,?,?)',
        [thUser.id, '新订单', 'New Order',
         `您有新订单 ${order_no}，服务: ${svc.name_zh}`,
         `New order ${order_no}, service: ${svc.name_en || svc.name_zh}`, 'order']);
    }

    saveDB();
    res.json({ ok: true, id: r.lastInsertRowid, order_no, price: finalPrice, discount, status: 'pending' });
  });

  app.put('/api/orders/:id/status', auth, (req, res) => {
    const { status, note } = req.body;
    const allowed = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (status === 'completed') {
      run('UPDATE orders SET completed_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
    }

    // Notify user when therapist confirms/starts
    if (['confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      const msgs = {
        confirmed: ['订单已确认', 'Order Confirmed', `您的订单 ${order.order_no} 已被确认`, `Your order ${order.order_no} confirmed`],
        in_progress: ['技师已出发', 'Therapist On The Way', `技师正在前往您的地址`, `Therapist is on the way`],
        completed: ['服务已完成', 'Service Completed', `订单 ${order.order_no} 完成，请给予评价`, `Please rate your service`],
        cancelled: ['订单已取消', 'Order Cancelled', `订单 ${order.order_no} 已取消`, `Your order has been cancelled`],
      };
      const m = msgs[status];
      if (m) {
        run('INSERT INTO notifications (user_id, title_zh, title_en, body_zh, body_en, type) VALUES (?,?,?,?,?,?)',
          [order.user_id, m[0], m[1], m[2], m[3], 'order']);
      }
    }

    saveDB();
    res.json({ ok: true });
  });

  // ═══════════════════════════════════
  //  REVIEWS
  // ═══════════════════════════════════
  app.get('/api/reviews', (req, res) => {
    const { therapist_id, limit = 20 } = req.query;
    if (!therapist_id) return res.status(400).json({ error: 'therapist_id required' });
    const reviews = all(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.therapist_id = ? ORDER BY r.created_at DESC LIMIT ?`,
      [therapist_id, parseInt(limit)]
    );
    res.json(reviews);
  });

  app.post('/api/reviews', auth, authRole('user'), (req, res) => {
    const { order_id, therapist_id, rating, comment_zh, tags } = req.body;
    if (!order_id || !therapist_id || !rating) {
      return res.status(400).json({ error: 'order_id, therapist_id, rating required' });
    }
    // Check: order belongs to user and is completed
    const order = get('SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = "completed"',
      [order_id, req.user.id]);
    if (!order) return res.status(400).json({ error: 'Order not found or not completed' });

    // Check: not reviewed yet
    const existing = get('SELECT id FROM reviews WHERE order_id = ? AND user_id = ?', [order_id, req.user.id]);
    if (existing) return res.status(400).json({ error: 'Already reviewed' });

    const r = run(
      `INSERT INTO reviews (order_id, user_id, therapist_id, rating, comment_zh, tags) VALUES (?,?,?,?,?,?)`,
      [order_id, req.user.id, therapist_id, rating, comment_zh || '', JSON.stringify(tags || [])]
    );

    // Update therapist rating avg
    const stats = get('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE therapist_id = ?', [therapist_id]);
    run('UPDATE therapists SET rating = ?, review_count = ? WHERE id = ?',
      [Math.round((stats.avg || 0) * 10) / 10, stats.cnt, therapist_id]);

    saveDB();
    res.json({ ok: true, id: r.lastInsertRowid });
  });

  // ═══════════════════════════════════
  //  COUPONS
  // ═══════════════════════════════════
  app.get('/api/coupons', (req, res) => {
    res.json(all(`SELECT id, code, title, type, value, min_order, end_date, max_used, used_count
      FROM coupons WHERE active = 1 AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC`));
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, order_amount } = req.body;
    const c = get('SELECT * FROM coupons WHERE code = ? AND active = 1', [(code || '').trim().toUpperCase()]);
    if (!c) return res.status(404).json({ error: '优惠码无效' });
    if (c.max_used && c.used_count >= c.max_used) return res.status(400).json({ error: '优惠码已用完' });
    if (order_amount < c.min_order) return res.status(400).json({ error: `需满 ₭${c.min_order.toLocaleString()} 才能使用` });
    const discount = c.type === 'percent'
      ? Math.round(order_amount * c.value / 100)
      : c.value;
    res.json({ ...c, discount, final_price: order_amount - discount });
  });

  // ═══════════════════════════════════
  //  ADDRESSES
  // ═══════════════════════════════════
  app.get('/api/addresses', auth, (req, res) => {
    res.json(all('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]));
  });

  app.post('/api/addresses', auth, (req, res) => {
    const { label, address, lat, lng, is_default } = req.body;
    if (!address) return res.status(400).json({ error: 'address required' });
    if (is_default) run('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
    const r = run(
      'INSERT INTO addresses (user_id, label, address, lat, lng, is_default) VALUES (?,?,?,?,?,?)',
      [req.user.id, label || '', address, lat || 0, lng || 0, is_default ? 1 : 0]
    );
    saveDB();
    res.json({ ok: true, id: r.lastInsertRowid });
  });

  app.delete('/api/addresses/:id', auth, (req, res) => {
    run('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    saveDB();
    res.json({ ok: true });
  });

  // ═══════════════════════════════════
  //  NOTIFICATIONS
  // ═══════════════════════════════════
  app.get('/api/notifications', auth, (req, res) => {
    res.json(all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.id]));
  });

  app.put('/api/notifications/read', auth, (req, res) => {
    run('UPDATE notifications SET read = 1 WHERE user_id = ?', [req.user.id]);
    saveDB();
    res.json({ ok: true });
  });

  // ═══════════════════════════════════
  //  FEE PAYMENT (Therapist)
  // ═══════════════════════════════════
  app.post('/api/fee-payments', auth, authRole('therapist'), (req, res) => {
    const th = get('SELECT id FROM therapists WHERE user_id = ?', [req.user.id]);
    if (!th) return res.status(404).json({ error: 'Therapist not found' });
    const { amount, method, evidence_url } = req.body;
    const r = run(
      'INSERT INTO fee_payments (therapist_id, amount, method, evidence_url, status) VALUES (?,?,?,?,?)',
      [th.id, amount || 0, method || 'transfer', evidence_url || '', 'pending']
    );
    saveDB();
    res.json({ ok: true, id: r.lastInsertRowid });
  });

  app.get('/api/fee-payments/my', auth, authRole('therapist'), (req, res) => {
    const th = get('SELECT id FROM therapists WHERE user_id = ?', [req.user.id]);
    if (!th) return res.json([]);
    res.json(all('SELECT * FROM fee_payments WHERE therapist_id = ? ORDER BY created_at DESC', [th.id]));
  });

  // ═══════════════════════════════════
  //  ADMIN APIs
  // ═══════════════════════════════════
  app.get('/api/admin/stats', auth, authRole('admin'), (req, res) => {
    const users = get("SELECT COUNT(*) as c FROM users WHERE role = 'user'").c;
    const therapists = get('SELECT COUNT(*) as c FROM therapists WHERE active = 1').c;
    const orders = get('SELECT COUNT(*) as c FROM orders').c;
    const revenue = (get('SELECT SUM(price) as s FROM orders WHERE status = "completed"') || {}).s || 0;
    const pending_fees = get("SELECT COUNT(*) as c FROM fee_payments WHERE status = 'pending'").c;
    const today_orders = get("SELECT COUNT(*) as c FROM orders WHERE date(created_at) = date('now')").c;
    res.json({ users, therapists, orders, revenue, pending_fees, today_orders });
  });

  app.get('/api/admin/orders', auth, authRole('admin'), (req, res) => {
    const { status, limit = 100 } = req.query;
    let sql = `SELECT o.*, u.name as user_name, u.phone as user_phone,
               u2.name as therapist_name, s.name_zh as service_name
               FROM orders o
               JOIN users u ON u.id = o.user_id
               JOIN therapists t ON t.id = o.therapist_id
               JOIN users u2 ON u2.id = t.user_id
               JOIN services s ON s.id = o.service_id WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND o.status = ?'; params.push(status); }
    sql += ` ORDER BY o.created_at DESC LIMIT ?`;
    params.push(parseInt(limit));
    res.json(all(sql, params));
  });

  app.get('/api/admin/therapists', auth, authRole('admin'), (req, res) => {
    res.json(all(`SELECT t.*, u.name, u.phone, u.avatar
      FROM therapists t JOIN users u ON u.id = t.user_id ORDER BY t.created_at DESC`));
  });

  app.put('/api/admin/therapists/:id', auth, authRole('admin'), (req, res) => {
    const { verified, active } = req.body;
    run('UPDATE therapists SET verified = COALESCE(?,verified), active = COALESCE(?,active) WHERE id = ?',
      [verified !== undefined ? verified : null, active !== undefined ? active : null, req.params.id]);
    saveDB();
    res.json({ ok: true });
  });

  app.get('/api/admin/shops', auth, authRole('admin'), (req, res) => {
    res.json(all('SELECT * FROM shops ORDER BY created_at DESC'));
  });

  app.get('/api/admin/fee-payments', auth, authRole('admin'), (req, res) => {
    res.json(all(`SELECT fp.*, u.name as therapist_name, u.phone as therapist_phone
      FROM fee_payments fp
      JOIN therapists t ON t.id = fp.therapist_id
      JOIN users u ON u.id = t.user_id
      ORDER BY fp.created_at DESC`));
  });

  app.put('/api/admin/fee-payments/:id', auth, authRole('admin'), (req, res) => {
    const { status, admin_note } = req.body;
    run('UPDATE fee_payments SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, admin_note || '', req.params.id]);
    if (status === 'approved') {
      const fp = get('SELECT * FROM fee_payments WHERE id = ?', [req.params.id]);
      if (fp) run('UPDATE therapists SET fee_paid = 1 WHERE id = ?', [fp.therapist_id]);
    }
    saveDB();
    res.json({ ok: true });
  });

  app.get('/api/admin/users', auth, authRole('admin'), (req, res) => {
    res.json(all("SELECT id, phone, name, avatar, role, created_at FROM users ORDER BY created_at DESC"));
  });

  // ─── Health check ──────────────────────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), version: '1.0.0' });
  });

  // ─── SPA fallback ──────────────────────────────────────────
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n🚀 RelaxHome API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Therapists: http://localhost:${PORT}/api/therapists\n`);
  });
}

start().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});
