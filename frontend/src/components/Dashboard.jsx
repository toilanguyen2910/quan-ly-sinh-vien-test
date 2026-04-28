import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Award } from 'lucide-react';
import { getStats } from '../api';

const Dashboard = ({ updateTrigger }) => {
  const [stats, setStats] = useState({ totalStudents: 0, averageGpa: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, [updateTrigger]);

  return (
    <div className="dashboard">
      <div className="stat-card glass">
        <div className="stat-icon primary">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <h3>Tổng Sinh Viên</h3>
          <p>{stats.totalStudents || 0}</p>
        </div>
      </div>

      <div className="stat-card glass">
        <div className="stat-icon secondary">
          <GraduationCap size={24} />
        </div>
        <div className="stat-info">
          <h3>Chuyên Ngành</h3>
          <p>4</p>
        </div>
      </div>

      <div className="stat-card glass">
        <div className="stat-icon success">
          <Award size={24} />
        </div>
        <div className="stat-info">
          <h3>GPA Trung Bình</h3>
          <p>{stats.averageGpa ? stats.averageGpa.toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
