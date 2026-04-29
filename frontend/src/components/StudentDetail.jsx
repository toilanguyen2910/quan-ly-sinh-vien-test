import React from 'react';
import { X, Mail, Phone, GraduationCap, Hash, Award, BookOpen } from 'lucide-react';

const StudentDetail = ({ student, onClose }) => {
  if (!student) return null;

  const gpaLevel = student.gpa >= 3.6 ? 'Xuất sắc' : student.gpa >= 3.2 ? 'Giỏi' : student.gpa >= 2.5 ? 'Khá' : student.gpa >= 2.0 ? 'Trung bình' : 'Yếu';
  const gpaColor = student.gpa >= 3.2 ? 'var(--success)' : student.gpa >= 2.0 ? 'var(--warning, #f59e0b)' : 'var(--danger)';

  // Generate avatar initials
  const initials = student.fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  // GPA progress percentage (out of 4.0)
  const gpaPercent = Math.min((parseFloat(student.gpa) / 4.0) * 100, 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass student-detail-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%' }}>
        <button className="btn-icon modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="detail-header">
          <div className="detail-avatar" style={{ '--gpa-color': gpaColor }}>
            {initials}
          </div>
          <h2 className="detail-name">{student.fullName}</h2>
          <span className="badge" style={{ fontSize: '0.85rem', padding: '0.3rem 1rem' }}>{student.studentCode}</span>
        </div>

        {/* GPA Ring */}
        <div className="detail-gpa-section">
          <div className="gpa-ring-container">
            <svg className="gpa-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={gpaColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${gpaPercent * 3.14} 314`}
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 6px ${gpaColor})`, transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="gpa-ring-text">
              <span className="gpa-value" style={{ color: gpaColor }}>{student.gpa}</span>
              <span className="gpa-label">{gpaLevel}</span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <div className="detail-info-icon"><BookOpen size={16} /></div>
            <div>
              <span className="detail-info-label">Chuyên ngành</span>
              <span className="detail-info-value">{student.major || '—'}</span>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="detail-info-icon"><Mail size={16} /></div>
            <div>
              <span className="detail-info-label">Email</span>
              <span className="detail-info-value">{student.email || '—'}</span>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="detail-info-icon"><Phone size={16} /></div>
            <div>
              <span className="detail-info-label">Điện thoại</span>
              <span className="detail-info-value">{student.phone || '—'}</span>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="detail-info-icon"><Award size={16} /></div>
            <div>
              <span className="detail-info-label">Xếp loại</span>
              <span className="detail-info-value" style={{ color: gpaColor, fontWeight: 600 }}>{gpaLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
