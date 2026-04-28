import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Search, Download, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';

const StudentList = ({ students, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Lọc danh sách chuyên ngành duy nhất từ data hiện tại
  const majors = ['All', ...new Set(students.map(s => s.major).filter(Boolean))];

  // Xử lý logic Sắp xếp, Lọc, Tìm kiếm
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 1. Tìm kiếm
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        s => s.fullName.toLowerCase().includes(lowerSearch) || 
             s.studentCode.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Lọc theo chuyên ngành
    if (filterMajor !== 'All') {
      result = result.filter(s => s.major === filterMajor);
    }

    // 3. Sắp xếp
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [students, searchTerm, filterMajor, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    // Chuẩn bị dữ liệu để xuất
    const exportData = processedStudents.map(s => ({
      'Mã SV': s.studentCode,
      'Họ Tên': s.fullName,
      'Chuyên Ngành': s.major,
      'GPA': s.gpa,
      'Email': s.email,
      'Số Điện Thoại': s.phone
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sinh_Vien");
    XLSX.writeFile(workbook, "Danh_Sach_Sinh_Vien.xlsx");
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <h2 className="form-title" style={{ margin: 0 }}>Danh Sách Sinh Viên</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm tên hoặc mã SV..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginLeft: '0.5rem', width: '200px', background: 'transparent', border: 'none', color: 'white', outline: 'none' }} 
            />
          </div>

          <select 
            value={filterMajor} 
            onChange={(e) => setFilterMajor(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'white', outline: 'none' }}
          >
            {majors.map(m => <option key={m} value={m}>{m === 'All' ? 'Tất cả ngành' : m}</option>)}
          </select>

          <button onClick={handleExport} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Download size={18} /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('studentCode')} style={{ cursor: 'pointer' }}>Mã SV <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('fullName')} style={{ cursor: 'pointer' }}>Họ và Tên <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('major')} style={{ cursor: 'pointer' }}>Chuyên Ngành <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('gpa')} style={{ cursor: 'pointer' }}>GPA <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
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
            {processedStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy sinh viên nào.
                </td>
              </tr>
            ) : (
              processedStudents.map((student) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
