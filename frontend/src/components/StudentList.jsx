import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Search, Download, ArrowUpDown, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';

const StudentList = ({ students, onEdit, onDelete, onViewDetail, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('All');
  const [filterGpa, setFilterGpa] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);

  // Lọc danh sách chuyên ngành duy nhất từ data hiện tại
  const majors = ['All', ...new Set(students.map(s => s.major).filter(Boolean))];

  // Xử lý logic Sắp xếp, Lọc, Tìm kiếm
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 1. Tìm kiếm
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        s => (s.fullName || '').toLowerCase().includes(lowerSearch) || 
             (s.studentCode || '').toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Lọc theo chuyên ngành
    if (filterMajor !== 'All') {
      result = result.filter(s => s.major === filterMajor);
    }

    // 2.5 Lọc theo GPA
    if (filterGpa !== 'All') {
      if (filterGpa === 'high') result = result.filter(s => parseFloat(s.gpa) >= 3.6);
      else if (filterGpa === 'good') result = result.filter(s => parseFloat(s.gpa) >= 3.2 && parseFloat(s.gpa) < 3.6);
      else if (filterGpa === 'average') result = result.filter(s => parseFloat(s.gpa) >= 2.5 && parseFloat(s.gpa) < 3.2);
      else if (filterGpa === 'low') result = result.filter(s => parseFloat(s.gpa) < 2.5);
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

  const toggleSelectAll = () => {
    if (selectedIds.length === processedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedStudents.map(s => s.id));
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = () => {
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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
  };

  if (isLoading) {
    return (
      <div className="glass" style={{ padding: '2rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '2rem' }}></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '1rem' }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <h2 className="form-title" style={{ margin: 0 }}>Danh Sách Sinh Viên</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', background: 'var(--input-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
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
            style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
          >
            {majors.map(m => <option key={m} value={m}>{m === 'All' ? 'Tất cả ngành' : m}</option>)}
          </select>

          <select 
            value={filterGpa} 
            onChange={(e) => setFilterGpa(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
          >
            <option value="All">Mọi điểm số</option>
            <option value="high">Xuất sắc (>= 3.6)</option>
            <option value="good">Giỏi (3.2 - 3.59)</option>
            <option value="average">Khá (2.5 - 3.19)</option>
            <option value="low">Cần lưu ý (< 2.5)</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedIds.length > 0 && (
              <button 
                onClick={() => onDelete(selectedIds)} 
                className="btn btn-primary" 
                style={{ background: 'var(--danger)', padding: '0.5rem 1rem' }}
              >
                <Trash2 size={18} /> Xóa ({selectedIds.length})
              </button>
            )}
            <button onClick={handleExport} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <Download size={18} /> Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={processedStudents.length > 0 && selectedIds.length === processedStudents.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th onClick={() => requestSort('studentCode')} style={{ cursor: 'pointer' }}>Mã SV <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('fullName')} style={{ cursor: 'pointer' }}>Họ và Tên <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('major')} style={{ cursor: 'pointer' }}>Chuyên Ngành <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th onClick={() => requestSort('gpa')} style={{ cursor: 'pointer' }}>GPA <ArrowUpDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th>Liên Hệ</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {processedStudents.length === 0 ? (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty"
                >
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy sinh viên nào.
                  </td>
                </motion.tr>
              ) : (
                processedStudents.map((student) => (
                  <motion.tr 
                    key={student.id} 
                    layout
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`clickable-row ${selectedIds.includes(student.id) ? 'selected-row' : ''}`} 
                    onClick={() => onViewDetail && onViewDetail(student)}
                  >
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(student.id)}
                        onChange={(e) => toggleSelect(e, student.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
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
                        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(student); }} title="Chi tiết">
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onEdit(student); }} title="Sửa">
                          <Pencil size={16} />
                        </button>
                        <button className="btn-icon danger" onClick={(e) => { e.stopPropagation(); onDelete(student.id); }} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
