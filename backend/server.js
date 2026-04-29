const express = require('express');
const cors = require('cors');
const supabase = require('./database');

const { login, authMiddleware } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API: Đăng nhập
app.post('/api/auth/login', login);

// API: Lấy danh sách tất cả sinh viên
app.get('/api/students', async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// API: Thêm sinh viên mới (Yêu cầu Admin)
app.post('/api/students', authMiddleware, async (req, res) => {
  const { studentCode, fullName, email, phone, major, gpa } = req.body;
  
  const { data, error } = await supabase
    .from('students')
    .insert([{ studentCode, fullName, email, phone, major, gpa }])
    .select()
    .single();
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

// API: Sửa thông tin sinh viên (Yêu cầu Admin)
app.put('/api/students/:id', authMiddleware, async (req, res) => {
  const { studentCode, fullName, email, phone, major, gpa } = req.body;
  
  const { data, error } = await supabase
    .from('students')
    .update({ studentCode, fullName, email, phone, major, gpa })
    .eq('id', req.params.id)
    .select();
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ message: 'Student updated', changes: data ? data.length : 0 });
});

// API: Xóa sinh viên (Yêu cầu Admin)
app.delete('/api/students/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', req.params.id)
    .select();
    
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ message: 'Student deleted', changes: data ? data.length : 0 });
});

// API: Thống kê cơ bản
app.get('/api/stats', async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('gpa');
    
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  const totalStudents = data.length;
  const averageGpa = totalStudents > 0 
    ? data.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / totalStudents 
    : 0;
    
  res.json({ totalStudents, averageGpa });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
