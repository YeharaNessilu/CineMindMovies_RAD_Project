import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Watchlist from './pages/Watchlist'; // 1. උඩින්ම Import කරන්න
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import MovieDetails from './pages/MovieDetails'; // ✅ 1. මේක අලුතෙන් එකතු වුනා

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/edit-movie/:id" element={<EditMovie />} />
        
        {/* ✅ 2. ෆිල්ම් එකක් Click කළාම යන පාර මෙතනින් හැදුවා */}
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;