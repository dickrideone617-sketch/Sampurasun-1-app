
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampurasun'
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Login Admin
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token });
});

// Dashboard Admin
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
    const [totalVisitors] = await db.promise().query(`
        SELECT SUM(nusantara + mancanegara) as total FROM reports
    `);
    const [avgOccupancy] = await db.promise().query(`
        SELECT AVG(occupancy_rate) as avg FROM reports
    `);
    const [stakeholders] = await db.promise().query(`
        SELECT s.name, s.type, 
               CASE 
                   WHEN MAX(r.submitted_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 'green'
                   WHEN MAX(r.submitted_at) IS NULL OR MAX(r.submitted_at) < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 'red'
                   ELSE 'yellow'
               END as status
        FROM stakeholders s
        LEFT JOIN reports r ON s.id = r.stakeholder_id
        GROUP BY s.id
    `);

    res.json({
        totalVisitors: totalVisitors[0]?.total || 0,
        avgOccupancy: avgOccupancy[0]?.avg?.toFixed(2) || 0,
        stakeholders
    });
});

// Ekspor Laporan (CSV)
app.get('/api/admin/export/:period', authenticateToken, async (req, res) => {
    const { period } = req.params;
    let query = 'SELECT s.name, s.type, r.nusantara, r.mancanegara, r.occupancy_rate, r.avg_spending FROM reports r JOIN stakeholders s ON r.stakeholder_id = s.id';

    if (period === 'monthly') {
        query += ' WHERE r.report_month = MONTH(CURDATE()) AND r.report_year = YEAR(CURDATE())';
    } else if (period === 'yearly') {
        query += ' WHERE r.report_year = YEAR(CURDATE())';
    }

    const [rows] = await db.promise().query(query);

    let csv = 'Nama Stakeholder,Jenis,Nusantara,Mancanegara,Okupansi,Pengeluaran\n';
    rows.forEach(row => {
        csv += `${row.name},${row.type},${row.nusantara},${row.mancanegara},${row.occupancy_rate},${row.avg_spending}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`laporan_${period}.csv`);
    res.send(csv);
});

// Notifikasi Otomatis (Cron Job)
cron.schedule('0 0 2 * * *', () => {
    console.log('Memeriksa pelaporan...');
    db.query(`
        INSERT INTO notifications (message, target_user_id)
        SELECT 'Harap segera laporkan data bulan ini.', s.id
        FROM stakeholders s
        LEFT JOIN reports r ON s.id = r.stakeholder_id AND r.report_month = MONTH(NOW())
        WHERE r.id IS NULL
    `, (err) => {
        if (err) console.error(err);
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
```

---
