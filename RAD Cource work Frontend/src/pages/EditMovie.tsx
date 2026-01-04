import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  rating: number;
  image?: string;
  telegramLink?: string;
  trailerLink?: string; 
}

const EditMovie = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const { id } = useParams(); 

  const movieData: Movie = state?.movie;

  // Form Data
  const [title, setTitle] = useState(movieData?.title || '');
  const [description, setDescription] = useState(movieData?.description || '');
  const [genre, setGenre] = useState(movieData?.genre || '');
  const [releaseDate, setReleaseDate] = useState(movieData?.releaseDate ? movieData.releaseDate.split('T')[0] : '');
  const [rating, setRating] = useState(movieData?.rating?.toString() || '');
  const [image, setImage] = useState(movieData?.image || '');
  
  const [telegramLink, setTelegramLink] = useState(movieData?.telegramLink || '');
  const [trailerLink, setTrailerLink] = useState(movieData?.trailerLink || '');
  
  const [error, setError] = useState('');

  // Data Loading Logic
  useEffect(() => {
    if (!movieData) {
      const fetchMovie = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
          const movie = res.data;
          
          setTitle(movie.title);
          setDescription(movie.description);
          setGenre(movie.genre);
          setReleaseDate(movie.releaseDate ? movie.releaseDate.split('T')[0] : '');
          setRating(movie.rating.toString());
          setImage(movie.image || '');
          setTelegramLink(movie.telegramLink || '');
          setTrailerLink(movie.trailerLink || ''); 
          
        } catch (err) {
          console.error(err);
          setError("Movie not found");
        }
      };
      fetchMovie();
    }
  }, [id, movieData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:5000/api/movies/${id}`, {
        title,
        description,
        genre,
        releaseDate,
        rating: Number(rating),
        image,
        telegramLink,
        trailerLink 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Movie Updated Successfully! ✨');
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update movie');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Edit Movie ✏️
          </h2>
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm font-medium">
            ✕ Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Movie Title</label>
            <input type="text" className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Description</label>
            <textarea className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm h-28 leading-relaxed" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Genre</label>
              <select className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer appearance-none" value={genre} onChange={(e) => setGenre(e.target.value)} required>
                <option value="Action" className="bg-gray-800">Action</option>
                <option value="Comedy" className="bg-gray-800">Comedy</option>
                <option value="Drama" className="bg-gray-800">Drama</option>
                <option value="Sci-Fi" className="bg-gray-800">Sci-Fi</option>
                <option value="Horror" className="bg-gray-800">Horror</option>
                <option value="Animation" className="bg-gray-800">Animation</option>
                <option value="Thriller" className="bg-gray-800">Thriller</option>
                <option value="Romance" className="bg-gray-800">Romance</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Release Date</label>
              <input type="date" className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Rating</label>
              <input type="number" min="1" max="10" step="0.1" className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm" value={rating} onChange={(e) => setRating(e.target.value)} required />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Image URL</label>
              <input type="url" className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
          </div>

          {/* ✅✅ LINKS SECTION: මේ ටික තමයි ඔයාගේ Code එකේ අඩු වෙලා තිබුණේ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase text-blue-300">Telegram Link 📥</label>
              <input 
                type="url" 
                className="w-full p-3 rounded-xl bg-blue-900/20 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm" 
                placeholder="https://t.me/..." 
                value={telegramLink} 
                onChange={(e) => setTelegramLink(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase text-red-300">YouTube Trailer Link ▶️</label>
              <input 
                type="url" 
                className="w-full p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition backdrop-blur-sm" 
                placeholder="https://youtube.com/..." 
                value={trailerLink} 
                onChange={(e) => setTrailerLink(e.target.value)} 
              />
            </div>
          </div>
          {/* ✅✅ END LINKS SECTION */}

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-blue-500/25 active:scale-95">
              Update Movie
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 backdrop-blur-md transition">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditMovie;