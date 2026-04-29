const express = require('express');
const cors = require('cors');
const supabase = require('./database');

const { login, authMiddleware } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API: Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  // Ghi đè lại hàm login để có thể bắt được kết quả và log
  try {
    await login(req, res);
    // Log sẽ được thực hiện bên trong hàm login hoặc sau đó
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Ghi nhật ký hoạt động
const logActivity = async (username, action, details) => {
  try {
    await supabase.from('activity_logs').insert([{ username, action, details }]);
  } catch (err) {
    console.error('Lỗi ghi log:', err.message);
  }
};

// API: Lấy nhật ký (Yêu cầu Admin)
app.get('/api/logs', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

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
  
  await logActivity(req.user.username, 'THÊM SINH VIÊN', `Mã: ${studentCode}, Tên: ${fullName}`);
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
  
  await logActivity(req.user.username, 'SỬA SINH VIÊN', `Mã: ${studentCode}, Tên: ${fullName}`);
  res.json({ message: 'Student updated', changes: data ? data.length : 0 });
});

// API: Xóa sinh viên (Yêu cầu Admin)
app.delete('/api/students/:id', authMiddleware, async (req, res) => {
  // Lấy thông tin sinh viên trước khi xóa để log
  const { data: student } = await supabase.from('students').select('studentCode, fullName').eq('id', req.params.id).single();

  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', req.params.id)
    .select();
    
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (student) {
    await logActivity(req.user.username, 'XÓA SINH VIÊN', `Mã: ${student.studentCode}, Tên: ${student.fullName}`);
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
