import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  rating: number;
  image?: string;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://https://cinemindmovies-rad-project.onrender.com/api/users/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://https://cinemindmovies-rad-project.onrender.com/api/users/watchlist/remove', 
        { movieId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ලිස්ට් එකෙන් අයින් වුන එක UI එකෙනුත් අයින් කරනවා
      setWatchlist(watchlist.filter(movie => movie._id !== movieId));
      alert("Removed from Watchlist 💔");
    } catch (error) {
      console.error(error);
      alert("Failed to remove");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white text-2xl">Loading your list... 🍿</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 md:p-10 font-sans text-white">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                My Watchlist ❤️
            </h1>
        </div>

        {/* Content */}
        {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlist.map((movie) => (
                    <div key={movie._id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition duration-300">
                        
                        {/* Image Link */}
                        <Link to={`/movie/${movie._id}`} className="block h-56 overflow-hidden relative">
                            {movie.image ? (
                                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">★ {movie.rating}</div>
                        </Link>

                        {/* Details */}
                        <div className="p-4">
                            <h3 className="text-lg font-bold mb-1 truncate">{movie.title}</h3>
                            <p className="text-xs text-gray-400 mb-4">{movie.genre}</p>
                            
                            <button 
                                onClick={() => removeFromWatchlist(movie._id)}
                                className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                            >
                                💔 Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-4 opacity-50">😢</div>
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Your Watchlist is Empty</h2>
                <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition">
                    Find Movies to Add
                </Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default Watchlist;