import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ students, isLoading }) => {
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const averageGpa = totalStudents > 0 
      ? students.reduce((sum, s) => sum + parseFloat(s.gpa || 0), 0) / totalStudents 
      : 0;

    // Đếm số lượng theo ngành cho PieChart
    const majorCount = {};
    students.forEach(s => {
      majorCount[s.major] = (majorCount[s.major] || 0) + 1;
    });
    const majorData = Object.keys(majorCount).map(key => ({ name: key, value: majorCount[key] }));

    // Phân khúc điểm cho BarChart
    const gpaBands = { 'Giỏi (>=3.2)': 0, 'Khá (2.5 - 3.19)': 0, 'TB (<2.5)': 0 };
    students.forEach(s => {
      const gpa = parseFloat(s.gpa);
      if (gpa >= 3.2) gpaBands['Giỏi (>=3.2)']++;
      else if (gpa >= 2.5) gpaBands['Khá (2.5 - 3.19)']++;
      else gpaBands['TB (<2.5)']++;
    });
    const gpaData = Object.keys(gpaBands).map(key => ({ name: key, count: gpaBands[key] }));

    return { totalStudents, averageGpa, majorData, gpaData };
  }, [students]);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ marginBottom: '3rem' }}>
        <div className="dashboard">
          {[1, 2, 3].map(i => (
            <div key={i} className="stat-card glass skeleton" style={{ height: '100px' }}></div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass skeleton" style={{ height: '300px' }}></div>
          <div className="glass skeleton" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      style={{ marginBottom: '3rem' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="dashboard">
        <motion.div className="stat-card glass" variants={cardVariants} whileHover={{ y: -5 }}>
          <div className="stat-icon primary">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Tổng Sinh Viên</h3>
            <p>{stats.totalStudents}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass" variants={cardVariants} whileHover={{ y: -5 }}>
          <div className="stat-icon secondary">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <h3>Chuyên Ngành</h3>
            <p>{stats.majorData.length}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass" variants={cardVariants} whileHover={{ y: -5 }}>
          <div className="stat-icon success">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <h3>GPA Trung Bình</h3>
            <p>{stats.averageGpa ? stats.averageGpa.toFixed(2) : '0.00'}</p>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <motion.div className="glass" variants={cardVariants} style={{ padding: '1.5rem', height: '300px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Tỷ Lệ Chuyên Ngành</h3>
          {stats.majorData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.majorData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.majorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu</p>
          )}
        </motion.div>

        <motion.div className="glass" variants={cardVariants} style={{ padding: '1.5rem', height: '300px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Phổ Điểm GPA</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.gpaData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
