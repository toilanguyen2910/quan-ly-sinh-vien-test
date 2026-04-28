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
              {/* Sinh viên mẫu cố định */}
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <td><span className="badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)' }}>VIP</span></td>
                <td className="rainbow-text" style={{ fontSize: '1.2rem' }}>Bách Khoa</td>
                <td style={{ fontWeight: 600 }}>CNTT</td>
                <td>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>4.0</span>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Ví dụ mẫu<br />Vĩnh viễn
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem' }}>Bất tử 🛡️</span>
                  </div>
                </td>
              </tr>
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
