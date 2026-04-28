import React from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';

const StudentList = ({ students, onEdit, onDelete }) => {
  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="form-title" style={{ margin: 0 }}>Danh Sách Sinh Viên</h2>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Tìm kiếm sinh viên..." style={{ marginLeft: '0.5rem', width: '250px' }} />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có dữ liệu sinh viên nào.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ và Tên</th>
                <th>Chuyên Ngành</th>
                <th>GPA</th>
                <th>Liên Hệ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><span className="badge">{student.studentCode}</span></td>
                  <td style={{ fontWeight: 500 }}>{student.fullName}</td>
                  <td>{student.major}</td>
                  <td>
                    <span style={{ 
                      color: student.gpa >= 3.2 ? 'var(--success)' : (student.gpa < 2.0 ? 'var(--danger)' : 'inherit'),
                      fontWeight: 'bold'
                    }}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {student.email}<br />{student.phone}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" onClick={() => onEdit(student)} title="Sửa">
                        <Pencil size={16} />
                      </button>
                      <button className="btn-icon danger" onClick={() => onDelete(student.id)} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
