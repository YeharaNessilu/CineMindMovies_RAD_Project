import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalMovies: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('https://cinemindmovies-rad-project.onrender.com/api/users/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      
      {/* Total Movies Card */}
      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
            <h3 className="text-gray-400 text-sm font-bold">Total Movies</h3>
            <p className="text-4xl font-extrabold text-white mt-2">{stats.totalMovies}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-full text-3xl">🎬</div>
      </div>

      {/* Total Users Card */}
      <div className="bg-gradient-to-br from-pink-600/20 to-orange-600/20 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
            <h3 className="text-gray-400 text-sm font-bold">Total Users</h3>
            <p className="text-4xl font-extrabold text-white mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-full text-3xl">👤</div>
      </div>

      {}
      
    </div>
  );
};

export default AdminStats;