import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import AdminStats from '../components/AdminStats';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  rating: number;
  image?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  //   Filter States (Dropdowns සඳහා)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');   // Year Filter
  const [minRating, setMinRating] = useState('All');         // Rating Filter

  // AI Mood Search State
  const [moodInput, setMoodInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiActive, setIsAiActive] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMovies();
    if (token) {
      fetchWatchlist();
    }
  }, [token]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://cinemindmovies-rad-project.onrender.com/api/movies');
      setMovies(response.data);
      setIsAiActive(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleMoodSearch = async (mood: string) => {
    if (!mood.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await axios.post('https://cinemindmovies-rad-project.onrender.com/api/movies/mood-search', { mood });
      setMovies(response.data);
      setIsAiActive(true);
      setMoodInput(mood);
    } catch (error) {
      console.error("AI Search Error:", error);
      alert("AI Error. Try again!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get('https://cinemindmovies-rad-project.onrender.com/api/users/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ids = response.data.map((item: any) => item._id);
      setWatchlist(ids);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const handleToggleWatchlist = async (e: React.MouseEvent, movieId: string) => {
    e.preventDefault();
    if (!token) { alert("Please login to use Watchlist!"); return; }

    const isInWatchlist = watchlist.includes(movieId);
    const url = isInWatchlist 
      ? 'https://cinemindmovies-rad-project.onrender.com/api/users/watchlist/remove' 
      : 'https://cinemindmovies-rad-project.onrender.com/api/users/watchlist/add';

    try {
      await axios.put(url, { movieId }, { headers: { Authorization: `Bearer ${token}` } });
      if (isInWatchlist) {
        setWatchlist(watchlist.filter(id => id !== movieId));
      } else {
        setWatchlist([...watchlist, movieId]);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`https://cinemindmovies-rad-project.onrender.com/api/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMovies(); 
      } catch (error) {
        console.error(error);
        alert('Failed to delete');
      }
    }
  };

  //   Helper: අලුත් Unique Years ලිස්ට් එක හදාගැනීම
  const uniqueGenres = ['All', ...new Set(movies.map((movie) => movie.genre))];
  const uniqueYears = ['All', ...new Set(movies.map((movie) => movie.releaseDate.split('-')[0]))].sort().reverse();

  //  . Updated Filtering Logic (Year & Rating Selectors)
  const filteredMovies = movies.filter((movie) => {
    // Search
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Genre
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    
    // Year Check (Dropdown)
    const movieYear = movie.releaseDate.split('-')[0];
    const matchesYear = selectedYear === 'All' || movieYear === selectedYear;

    // Rating Check (Dropdown)
    const matchesRating = minRating === 'All' || movie.rating >= Number(minRating);

    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

  const quickMoods = [
    { emoji: "😂", text: "Funny" },
    { emoji: "😢", text: "Sad" },
    { emoji: "🔥", text: "Action" },
    { emoji: "❤️", text: "Romantic" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full bg-gradient-to-b from-[#240b36] via-[#240b36] to-[#0f0c29] pb-20 pt-6 px-6 shadow-2xl">
          
          <div className="max-w-7xl mx-auto flex justify-between items-center mb-16">
             <div className="text-2xl font-bold tracking-wider text-purple-400">CINEMIND<span className="text-white">MOVIES</span></div>
             <div className="flex gap-4 items-center">
                {isAdmin && <Link to="/add-movie" className="text-sm font-medium text-gray-300 hover:text-white">+ Add</Link>}
                <Link to="/watchlist" className="text-sm font-medium text-gray-300 hover:text-white">My List</Link>
                <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition">Logout</button>
             </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                  Welcome back, {user?.firstName}
              </h1>
              <p className="text-gray-400 mb-8 text-lg">What are you in the mood for today?</p>

              <div className="relative group max-w-xl mx-auto">
                <input 
                    type="text" 
                    placeholder="Type a mood (e.g. I want to cry...)" 
                    className="w-full py-4 pl-6 pr-20 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-purple-500 backdrop-blur-md transition-all text-lg shadow-xl"
                    value={moodInput}
                    onChange={(e) => setMoodInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMoodSearch(moodInput)}
                />
                <button 
                    onClick={() => handleMoodSearch(moodInput)}
                    disabled={isAiLoading}
                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 rounded-full font-bold transition-all shadow-lg disabled:opacity-50"
                >
                    {isAiLoading ? '...' : 'Go'}
                </button>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                 {quickMoods.map((m) => (
                    <button key={m.text} onClick={() => handleMoodSearch(m.text)} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm hover:bg-white/20 transition flex gap-2 items-center">
                        <span>{m.emoji}</span> {m.text}
                    </button>
                 ))}
                 {isAiActive && <button onClick={fetchMovies} className="text-red-300 text-sm hover:underline">Reset</button>}
              </div>
          </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 pb-20">
        
        {isAdmin && <div className="mb-8"><AdminStats /></div>}

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isAiActive ? '✨ AI Recommendations' : '🔥 Trending Now'}
            </h2>
            
            {/*   New Dropdowns (Search, Year, Rating, Genre) */}
            <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-end w-full lg:w-auto">
                 
                 {/* Search Input */}
                 <input
                    type="text"
                    placeholder="Search..."
                    className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500 w-full sm:w-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />

                 {/* Year Select */}
                 <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer"
                 >
                    <option value="All" className="bg-gray-900">📅 Year: All</option>
                    {uniqueYears.filter(y => y !== 'All').map((year) => (
                      <option key={year} value={year} className="bg-gray-900">{year}</option>
                    ))}
                 </select>

                 {/* Rating Select */}
                 <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer"
                 >
                    <option value="All" className="bg-gray-900">⭐ Rating: All</option>
                    <option value="9" className="bg-gray-900">9+ Stars</option>
                    <option value="8" className="bg-gray-900">8+ Stars</option>
                    <option value="7" className="bg-gray-900">7+ Stars</option>
                    <option value="6" className="bg-gray-900">6+ Stars</option>
                 </select>
                 
                 {/* Genre Select */}
                 <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer"
                 >
                    <option value="All" className="bg-gray-900">🎬 Genre: All</option>
                    {uniqueGenres.filter(g => g !== 'All').map((genre) => (
                      <option key={genre} value={genre} className="bg-gray-900">{genre}</option>
                    ))}
                 </select>
            </div>
        </div>

        {/* Grid */}
        {isAiLoading ? (
             <div className="text-center py-20">
                <div className="text-4xl mb-4 animate-bounce">🔮</div>
                <p className="text-purple-300">Finding the perfect match...</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => {
                const isInWatchlist = watchlist.includes(movie._id);
                return (
                    <div key={movie._id} className="group bg-[#16162c] rounded-xl overflow-hidden hover:scale-105 transition duration-300 shadow-lg hover:shadow-purple-500/20">
                    
                    <Link to={`/movie/${movie._id}`} className="block relative aspect-[2/3]">
                        {movie.image ? (
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                        )}
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                        {movie.rating.toFixed(1)}
                        </div>
                    </Link>
                    
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                            <Link to={`/movie/${movie._id}`} className="text-sm font-bold text-white leading-tight hover:text-purple-400 line-clamp-1">{movie.title}</Link>
                            <button onClick={(e) => handleToggleWatchlist(e, movie._id)} className="text-sm hover:scale-110 transition">
                            {isInWatchlist ? '❤️' : '🤍'}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-3">{movie.genre} • {movie.releaseDate.split('-')[0]}</p>
                        
                        {isAdmin && (
                            <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
                            <Link to={`/edit-movie/${movie._id}`} state={{ movie }} className="text-[10px] text-blue-400 hover:text-blue-300">Edit</Link>
                            <button onClick={() => handleDelete(movie._id)} className="text-[10px] text-red-400 hover:text-red-300">Delete</button>
                            </div>
                        )}
                    </div>
                    </div>
                );
                })
            ) : (
                <div className="col-span-full text-center py-20 opacity-50">
                    <div className="text-4xl mb-2">😕</div>
                    <p>No movies found matching your filters.</p>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;