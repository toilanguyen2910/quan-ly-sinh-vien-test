import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const StudentForm = ({ onSubmit, editingStudent, onCancel }) => {
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
    <div className="form-container glass">
      <h2 className="form-title">
        {editingStudent ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}
      </h2>
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
            <input required type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Công nghệ thông tin" />
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
    </div>
  );
};

export default StudentForm;
