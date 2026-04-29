import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload } from 'lucide-react';

const StudentForm = ({ onSubmit, editingStudent, onCancel, onOpenImport }) => {
  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    email: '',
    phone: '',
    major: '',
    gpa: ''
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    } else {
      setFormData({ studentCode: '', fullName: '', email: '', phone: '', major: '', gpa: '' });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingStudent) {
      setFormData({ studentCode: '', fullName: '', email: '', phone: '', major: '', gpa: '' });
    }
  };

  return (
    <motion.div 
      className="form-container glass"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="form-title" style={{ margin: 0 }}>
          {editingStudent ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}
        </h2>
        {!editingStudent && onOpenImport && (
          <button type="button" className="btn btn-secondary" onClick={onOpenImport} style={{ padding: '0.5rem 1rem' }}>
            <Upload size={16} /> Import Excel
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Mã Sinh Viên</label>
            <input required type="text" name="studentCode" value={formData.studentCode} onChange={handleChange} placeholder="VD: SV001" />
          </div>
          <div className="form-group">
            <label>Họ và Tên</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="0901234567" />
          </div>
          <div className="form-group">
            <label>Chuyên Ngành</label>
            <select 
              required 
              name="major" 
              value={formData.major} 
              onChange={handleChange}
              style={{ padding: '0.75rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' }}
            >
              <option value="" disabled>-- Chọn chuyên ngành --</option>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Kiến trúc máy tính">Kiến trúc máy tính</option>
              <option value="Khoa học dữ liệu">Khoa học dữ liệu</option>
              <option value="An toàn thông tin">An toàn thông tin</option>
              <option value="Hệ thống thông tin">Hệ thống thông tin</option>
              <option value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</option>
              <option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</option>
              <option value="Mạng máy tính">Mạng máy tính</option>
            </select>
          </div>
          <div className="form-group">
            <label>Điểm GPA (Hệ 4.0)</label>
            <input required type="number" step="0.1" min="0" max="4" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="3.5" />
          </div>
        </div>
        <div className="form-actions">
          {editingStudent && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <X size={18} /> Hủy
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            <Save size={18} /> {editingStudent ? 'Cập Nhật' : 'Lưu Thông Tin'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default StudentForm;
