import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import ImportExcel from './components/ImportExcel';
import ConfirmModal from './components/ConfirmModal';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import ActivityLog from './components/ActivityLog';
import { getStudents, createStudent, updateStudent, deleteStudent } from './api';
import { ToastContainer, toast } from 'react-toastify';
import { History } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, studentId: null });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu sinh viên!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [updateTrigger]);

  const triggerUpdate = () => setUpdateTrigger(prev => prev + 1);

  const handleAddOrUpdate = async (studentData) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thực hiện hành động này!");
      setShowLogin(true);
      return;
    }
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData);
        toast.success("Cập nhật sinh viên thành công!");
        setEditingStudent(null);
      } else {
        await createStudent(studentData);
        toast.success("Đã thêm sinh viên mới!");
      }
      triggerUpdate();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    toast.info("Đã đăng xuất");
  };

  const handleImportStudent = async (studentData) => {
    if (!user) return;
    await createStudent(studentData);
  };

  const handleImportClose = () => {
    setShowImport(false);
    triggerUpdate();
  };

  const handleDelete = (idOrIds) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để xóa!");
      setShowLogin(true);
      return;
    }
    setConfirmDelete({ isOpen: true, studentId: idOrIds });
  };

  const executeDelete = async () => {
    const idOrIds = confirmDelete.studentId;
    try {
      if (Array.isArray(idOrIds)) {
        await Promise.all(idOrIds.map(id => deleteStudent(id)));
        toast.success(`Đã xóa ${idOrIds.length} sinh viên!`);
      } else {
        await deleteStudent(idOrIds);
        toast.success("Đã xóa sinh viên!");
      }
      triggerUpdate();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa!");
      console.error(error);
    } finally {
      setConfirmDelete({ isOpen: false, studentId: null });
    }
  };

  const handleEdit = (student) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để sửa!");
      setShowLogin(true);
      return;
    }
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" theme={isDark ? 'dark' : 'light'} />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="title-gradient">Hệ Thống Quản Lý Sinh Viên</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Nền tảng quản trị dữ liệu sinh viên thông minh, hiện đại và bảo mật cao
          </p>
        </header>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {user ? (
            <motion.div 
              className="glass" 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                  A
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>Quản trị viên</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online</span>
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--surface-border)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  className="btn-icon" 
                  onClick={() => setShowActivityLog(true)} 
                  title="Nhật ký hoạt động"
                  style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))' }}
                >
                  <History size={18} style={{ color: 'var(--primary)' }} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="btn-logout"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    color: 'var(--danger)', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </motion.div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowLogin(true)}>
              Đăng nhập Admin
            </button>
          )}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.main
          key="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Dashboard students={students} isLoading={isLoading} />
          
          {user && (
            <StudentForm 
              onSubmit={handleAddOrUpdate} 
              editingStudent={editingStudent}
              onCancel={() => setEditingStudent(null)}
              onOpenImport={() => setShowImport(true)}
            />
          )}

          <StudentList 
            students={students} 
            onEdit={user ? handleEdit : null} 
            onDelete={user ? handleDelete : null}
            onViewDetail={handleViewDetail}
            isLoading={isLoading}
            isAdmin={!!user}
          />
        </motion.main>
      </AnimatePresence>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetail student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
        {showImport && (
          <ImportExcel onImport={handleImportStudent} onClose={handleImportClose} />
        )}
        {showLogin && (
          <Login 
            isOpen={showLogin} 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={(userData) => setUser(userData)} 
          />
        )}
        {showActivityLog && (
          <ActivityLog 
            isOpen={showActivityLog} 
            onClose={() => setShowActivityLog(false)} 
          />
        )}
        <ConfirmModal 
          isOpen={confirmDelete.isOpen}
          title="Xác nhận xóa"
          message={Array.isArray(confirmDelete.studentId) 
            ? `Bạn có chắc chắn muốn xóa ${confirmDelete.studentId.length} sinh viên đã chọn?` 
            : "Bạn có chắc chắn muốn xóa sinh viên này? Hành động này không thể hoàn tác."
          }
          onConfirm={executeDelete}
          onCancel={() => setConfirmDelete({ isOpen: false, studentId: null })}
          confirmText="Xóa ngay"
          cancelText="Để sau"
        />
      </AnimatePresence>
    </div>
  );
}

export default App;
