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
import { getStudents, createStudent, updateStudent, deleteStudent } from './api';
import { ToastContainer, toast } from 'react-toastify';
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
    <motion.div 
      className="app-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer position="top-right" theme={isDark ? 'dark' : 'light'} />
      
      <motion.header variants={itemVariants}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {user ? (
            <div className="user-profile">
              <span className="user-badge">Admin</span>
              <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => setShowLogin(true)}>Đăng nhập Admin</button>
          )}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Hệ Thống Quản Lý Sinh Viên
        </motion.h1>
        <p>Phiên bản nâng cao với React và Node.js</p>
      </motion.header>

      <motion.main variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Dashboard students={students} isLoading={isLoading} />
        </motion.div>
        
        {user && (
          <motion.div variants={itemVariants}>
            <StudentForm 
              onSubmit={handleAddOrUpdate} 
              editingStudent={editingStudent}
              onCancel={() => setEditingStudent(null)}
              onOpenImport={() => setShowImport(true)}
            />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <StudentList 
            students={students} 
            onEdit={user ? handleEdit : null} 
            onDelete={user ? handleDelete : null}
            onViewDetail={handleViewDetail}
            isLoading={isLoading}
            isAdmin={!!user}
          />
        </motion.div>
      </motion.main>

      {/* Modals */}
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
    </motion.div>
  );
}

export default App;
