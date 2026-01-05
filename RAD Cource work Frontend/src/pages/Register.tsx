import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // ✅ Role එක තෝරන State එක ඒ විදිහටම තියෙනවා
  const [error, setError] = useState(''); // Error පෙන්නන්න අලුත් state එකක්

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Role එකත් එක්කම Backend එකට යවනවා
      await axios.post('http://https://cinemindmovies-rad-project.onrender.com/api/users/register', {  
        firstName,
        lastName,
        email,
        password,
        role 
      });

      alert('Registration Successful! Please Login.');
      navigate('/login');

    } catch (err: any) {
      console.error(err);
      // Backend එකෙන් එන error message එක පෙන්නනවා, නැත්නම් පොදු එකක්
      setError(err.response?.data?.message || 'Registration Failed. Please try again.');
    }
  };

  return (
    // 🌌 1. Background: Dark Gradient (Login එකේ වගේමයි)
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
      
      {/* Background Blobs for Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* 🧊 2. Glass Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2">
            Create Account
          </h2>
          <p className="text-gray-300 text-sm">Join us and start your journey!</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* First Name & Last Name Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">First Name</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Last Name</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* ✅ 3. Role Selection Dropdown (Glass Style) */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Select Role</label>
            <div className="relative">
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer appearance-none transition backdrop-blur-sm"
              >
                <option value="user" className="bg-gray-800 text-white">User (View Only)</option>
                <option value="admin" className="bg-gray-800 text-white">Admin (Full Access)</option>
              </select>
              {/* Dropdown Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-blue-500/25 active:scale-95 mt-4"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-300 hover:text-white font-semibold transition hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;