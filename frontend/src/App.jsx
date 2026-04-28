import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { getStudents, createStudent, updateStudent, deleteStudent } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu sinh viên!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [updateTrigger]);

  const triggerUpdate = () => setUpdateTrigger(prev => prev + 1);

  const handleAddOrUpdate = async (studentData) => {
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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await deleteStudent(id);
        toast.success("Đã xóa sinh viên!");
        triggerUpdate();
      } catch (error) {
        toast.error("Không thể xóa sinh viên này!");
        console.error(error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" theme="dark" />
      <header>
        <h1>Hệ Thống Quản Lý Sinh Viên</h1>
        <p>Phiên bản nâng cao với React và Node.js</p>
      </header>

      <main>
        <Dashboard students={students} />
        
        <StudentForm 
          onSubmit={handleAddOrUpdate} 
          editingStudent={editingStudent}
          onCancel={() => setEditingStudent(null)}
        />
        
        <StudentList 
          students={students} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </main>
    </div>
  );
}

export default App;
