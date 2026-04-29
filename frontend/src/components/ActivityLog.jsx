import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Clock, User, Activity } from 'lucide-react';
import { getActivityLogs } from '../api';
import { toast } from 'react-toastify';

const ActivityLog = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      toast.error('Không thể tải nhật ký hoạt động');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content activity-modal"
          style={{ maxWidth: '700px', width: '90%' }}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="form-title" style={{ margin: 0 }}>
              <History size={20} /> Nhật Ký Hoạt Động
            </h2>
            <button className="btn-icon" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="log-list" style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '1rem' }}>
            {isLoading ? (
              <div className="empty-state">Đang tải nhật ký...</div>
            ) : logs.length === 0 ? (
              <div className="empty-state">Chưa có hoạt động nào được ghi lại.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="log-item glass" style={{ padding: '1rem', marginBottom: '0.75rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={14} /> {log.action}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {formatTime(log.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{log.details}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={12} /> Thực hiện bởi: <strong>{log.username}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityLog;
