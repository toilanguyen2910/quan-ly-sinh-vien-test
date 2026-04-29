const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-admin-key-2024';

// Tài khoản admin mặc định (Duy nhất, không có chức năng tạo tài khoản)
const ADMIN_USER = {
  username: 'admin',
  // Mật khẩu hash của 'admin29102007'
  passwordHash: '$2b$10$LvljhV9a9Fgb.RUzYYoFQuDlxJIkYvBNLluXm7GELLxmyz2oVvB.e' 
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER.username) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_USER.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
  }

  const token = jwt.sign(
    { username: ADMIN_USER.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, user: { username: ADMIN_USER.username, role: 'admin' } });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Không có quyền truy cập. Vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = { login, authMiddleware };
