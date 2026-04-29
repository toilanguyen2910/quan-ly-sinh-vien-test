import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../api';
import { toast } from 'react-toastify';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin29102007');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      toast.success('Đăng nhập thành công!');
      onLoginSuccess(data.user);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Sai tên đăng nhập hoặc mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content login-modal"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="login-header">
            <h2>Quản Trị Viên</h2>
            <p>Vui lòng đăng nhập để thực hiện các thao tác quản lý</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="admin"
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
            </div>

            <div className="login-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập'}
              </button>
            </div>
          </form>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
