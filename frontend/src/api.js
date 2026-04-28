const API_URL = import.meta.env.PROD 
  ? 'https://quan-ly-sinh-vien-test.onrender.com/api' 
  : 'http://localhost:3000/api';

export const getStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  return response.json();
};

export const createStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return response.json();
};

export const updateStudent = async (id, studentData) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return response.json();
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
