const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API: Lấy danh sách tất cả sinh viên
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API: Thêm sinh viên mới
app.post('/api/students', (req, res) => {
  const { studentCode, fullName, email, phone, major, gpa } = req.body;
  const sql = 'INSERT INTO students (studentCode, fullName, email, phone, major, gpa) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [studentCode, fullName, email, phone, major, gpa];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      studentCode, fullName, email, phone, major, gpa
    });
  });
});

// API: Sửa thông tin sinh viên
app.put('/api/students/:id', (req, res) => {
  const { studentCode, fullName, email, phone, major, gpa } = req.body;
  const sql = 'UPDATE students SET studentCode = ?, fullName = ?, email = ?, phone = ?, major = ?, gpa = ? WHERE id = ?';
  const params = [studentCode, fullName, email, phone, major, gpa, req.params.id];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student updated', changes: this.changes });
  });
});

// API: Xóa sinh viên
app.delete('/api/students/:id', (req, res) => {
  const sql = 'DELETE FROM students WHERE id = ?';
  db.run(sql, req.params.id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted', changes: this.changes });
  });
});

// API: Thống kê cơ bản
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as totalStudents, AVG(gpa) as averageGpa FROM students', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
