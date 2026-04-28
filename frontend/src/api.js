// Mock API sử dụng LocalStorage để deploy tĩnh lên Vercel

const getLocalStudents = () => {
  const data = localStorage.getItem('students');
  // Trả về dữ liệu mẫu nếu chưa có dữ liệu nào
  if (!data) {
    const defaultData = [
      { id: 1, studentCode: 'SV001', fullName: 'Nguyễn Văn A', email: 'nva@gmail.com', phone: '0901234567', major: 'Công nghệ thông tin', gpa: 8.5 }
    ];
    localStorage.setItem('students', JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveLocalStudents = (students) => {
  localStorage.setItem('students', JSON.stringify(students));
};

export const getStudents = async () => {
  return getLocalStudents();
};

export const getStats = async () => {
  const students = getLocalStudents();
  const totalStudents = students.length;
  const averageGpa = totalStudents > 0 
    ? students.reduce((sum, s) => sum + parseFloat(s.gpa || 0), 0) / totalStudents 
    : 0;
  return { totalStudents, averageGpa };
};

export const createStudent = async (studentData) => {
  const students = getLocalStudents();
  const newStudent = { ...studentData, id: Date.now() }; // Dùng timestamp làm ID tạm
  students.push(newStudent);
  saveLocalStudents(students);
  return newStudent;
};

export const updateStudent = async (id, studentData) => {
  const students = getLocalStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...studentData, id };
    saveLocalStudents(students);
    return students[index];
  }
  throw new Error("Không tìm thấy sinh viên");
};

export const deleteStudent = async (id) => {
  let students = getLocalStudents();
  students = students.filter(s => s.id !== id);
  saveLocalStudents(students);
  return { message: "Đã xóa" };
};
