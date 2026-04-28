import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { getStudents, createStudent, updateStudent, deleteStudent } from './api';
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
      console.error("Failed to fetch students", error);
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
        setEditingStudent(null);
      } else {
        await createStudent(studentData);
      }
      triggerUpdate();
    } catch (error) {
      console.error("Failed to save student", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await deleteStudent(id);
        triggerUpdate();
      } catch (error) {
        console.error("Failed to delete student", error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hệ Thống Quản Lý Sinh Viên</h1>
        <p>Phiên bản nâng cao với React và Node.js</p>
      </header>

      <main>
        <Dashboard updateTrigger={updateTrigger} />
        
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
