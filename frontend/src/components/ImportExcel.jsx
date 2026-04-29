import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportExcel = ({ onImport, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const EXPECTED_FIELDS = ['studentCode', 'fullName', 'email', 'phone', 'major', 'gpa'];
  const FIELD_MAP = {
    'mã sv': 'studentCode', 'ma sv': 'studentCode', 'mã sinh viên': 'studentCode', 'studentcode': 'studentCode', 'student code': 'studentCode',
    'họ tên': 'fullName', 'ho ten': 'fullName', 'họ và tên': 'fullName', 'fullname': 'fullName', 'full name': 'fullName', 'tên': 'fullName',
    'email': 'email',
    'số điện thoại': 'phone', 'sdt': 'phone', 'phone': 'phone', 'điện thoại': 'phone', 'so dien thoai': 'phone',
    'chuyên ngành': 'major', 'chuyen nganh': 'major', 'ngành': 'major', 'major': 'major',
    'gpa': 'gpa', 'điểm': 'gpa', 'điểm gpa': 'gpa', 'diem': 'gpa'
  };

  const mapHeaders = (headers) => {
    return headers.map(h => {
      const normalized = h.toLowerCase().trim();
      return FIELD_MAP[normalized] || normalized;
    });
  };

  const parseFile = (file) => {
    setError('');
    setImportResult(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          setError('File không có dữ liệu hoặc chỉ có header.');
          return;
        }

        const rawHeaders = jsonData[0].map(String);
        const mappedHeaders = mapHeaders(rawHeaders);

        // Check if we have the minimum required fields
        const hasName = mappedHeaders.includes('fullName');
        const hasCode = mappedHeaders.includes('studentCode');

        if (!hasName || !hasCode) {
          setError(`File cần có ít nhất cột "Mã SV" và "Họ Tên". Các cột tìm thấy: ${rawHeaders.join(', ')}`);
          return;
        }

        const rows = jsonData.slice(1)
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map(row => {
            const obj = {};
            mappedHeaders.forEach((header, idx) => {
              if (EXPECTED_FIELDS.includes(header)) {
                obj[header] = row[idx] !== undefined ? String(row[idx]).trim() : '';
              }
            });
            // Set defaults for missing fields
            EXPECTED_FIELDS.forEach(field => {
              if (!obj[field]) obj[field] = '';
            });
            if (obj.gpa) obj.gpa = parseFloat(obj.gpa) || 0;
            return obj;
          })
          .filter(obj => obj.studentCode && obj.fullName);

        if (rows.length === 0) {
          setError('Không tìm thấy dữ liệu hợp lệ trong file.');
          return;
        }

        setPreviewData(rows);
      } catch (err) {
        setError('Không thể đọc file. Vui lòng kiểm tra định dạng.');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;
    setImporting(true);
    let success = 0;
    let failed = 0;

    for (const student of previewData) {
      try {
        await onImport(student);
        success++;
      } catch {
        failed++;
      }
    }

    setImporting(false);
    setImportResult({ success, failed });
    setPreviewData(null);
  };

  const handleReset = () => {
    setPreviewData(null);
    setFileName('');
    setError('');
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%' }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={22} /> Import từ Excel/CSV
          </h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {importResult ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Import hoàn tất!</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Thành công: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{importResult.success}</span>
              {importResult.failed > 0 && (
                <> | Thất bại: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{importResult.failed}</span></>
              )}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={handleReset}>Import thêm</button>
              <button className="btn btn-primary" onClick={onClose}>Đóng</button>
            </div>
          </div>
        ) : !previewData ? (
          <>
            <div
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={40} style={{ color: dragActive ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.3s' }} />
              <p style={{ marginTop: '1rem', fontWeight: 500 }}>
                Kéo thả file vào đây hoặc <span style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>chọn file</span>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Hỗ trợ: .xlsx, .xls, .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📋 <strong>Hướng dẫn:</strong></p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                File cần có các cột: <strong>Mã SV</strong>, <strong>Họ Tên</strong>, Email, Số Điện Thoại, Chuyên Ngành, GPA.<br/>
                Hệ thống sẽ tự động nhận diện tên cột tiếng Việt lẫn tiếng Anh.
              </p>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <FileSpreadsheet size={16} /> {fileName} — <strong style={{ color: 'var(--text-main)' }}>{previewData.length} sinh viên</strong>
            </div>

            <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã SV</th>
                    <th>Họ Tên</th>
                    <th>Ngành</th>
                    <th>GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 20).map((s, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td><span className="badge">{s.studentCode}</span></td>
                      <td>{s.fullName}</td>
                      <td>{s.major || '—'}</td>
                      <td>{s.gpa || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 20 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '0.5rem', fontSize: '0.85rem' }}>
                  ...và {previewData.length - 20} sinh viên khác
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={handleReset}>
                <X size={16} /> Hủy
              </button>
              <button className="btn btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? (
                  <><span className="spinner"></span> Đang import...</>
                ) : (
                  <><Upload size={16} /> Import {previewData.length} sinh viên</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportExcel;
