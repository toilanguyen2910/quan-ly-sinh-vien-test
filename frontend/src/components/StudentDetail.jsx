import { X, Mail, Phone, GraduationCap, Hash, Award, BookOpen, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDetail = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const gpaLevel = student.gpa >= 3.6 ? 'Xuất sắc' : student.gpa >= 3.2 ? 'Giỏi' : student.gpa >= 2.5 ? 'Khá' : student.gpa >= 2.0 ? 'Trung bình' : 'Yếu';
  const gpaColor = student.gpa >= 3.2 ? 'var(--success)' : student.gpa >= 2.5 ? 'var(--warning, #f59e0b)' : 'var(--danger)';

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
    <AnimatePresence>
      <motion.div 
        className="modal-overlay" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content glass student-detail-modal" 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()} 
          style={{ maxWidth: '560px', width: '95%' }}
        >
          <div className="no-print" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', gap: '0.75rem' }}>
            <button className="btn-icon" onClick={handlePrint} title="In hồ sơ">
              <Printer size={18} />
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Profile Header */}
          <div className="detail-header">
            <div className="detail-avatar" style={{ '--gpa-color': gpaColor }}>
              {initials}
            </div>
            <h2 className="detail-name">{student.fullName}</h2>
            <span className="badge" style={{ fontSize: '0.85rem', padding: '0.4rem 1.2rem' }}>MSSV: {student.studentCode}</span>
          </div>

          {/* GPA Ring */}
          <div className="detail-gpa-section">
            <div className="gpa-ring-container">
              <svg className="gpa-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={gpaColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 340" }}
                  animate={{ strokeDasharray: `${(gpaPercent / 100) * 340} 340` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  transform="rotate(-90 60 60)"
                  style={{ filter: `drop-shadow(0 0 8px ${gpaColor})` }}
                />
              </svg>
              <div className="gpa-ring-text">
                <span className="gpa-value" style={{ color: gpaColor }}>{student.gpa}</span>
                <span className="gpa-label">Điểm GPA</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="detail-info-grid">
            <div className="detail-info-item">
              <div className="detail-info-icon"><BookOpen size={18} /></div>
              <div>
                <span className="detail-info-label">Chuyên ngành</span>
                <span className="detail-info-value">{student.major || '—'}</span>
              </div>
            </div>

            <div className="detail-info-item">
              <div className="detail-info-icon"><Mail size={18} /></div>
              <div>
                <span className="detail-info-label">Email liên hệ</span>
                <span className="detail-info-value">{student.email || '—'}</span>
              </div>
            </div>

            <div className="detail-info-item">
              <div className="detail-info-icon"><Phone size={18} /></div>
              <div>
                <span className="detail-info-label">Số điện thoại</span>
                <span className="detail-info-value">{student.phone || '—'}</span>
              </div>
            </div>

            <div className="detail-info-item">
              <div className="detail-info-icon"><Award size={18} /></div>
              <div>
                <span className="detail-info-label">Xếp loại học lực</span>
                <span className="detail-info-value" style={{ color: gpaColor }}>{gpaLevel}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentDetail;
