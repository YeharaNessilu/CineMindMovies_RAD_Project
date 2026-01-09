import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMovie = () => {
  const navigate = useNavigate();
  
  // ෆෝම් එකේ දත්ත
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState('');
  const [telegramLink, setTelegramLink] = useState('');  
  const [error, setError] = useState(''); 

  const [isGenerating, setIsGenerating] = useState(false);

  //   AI Function
  const handleAIGenerate = async () => {
    if (!title) {
      alert("Please enter a Movie Title first!");
      return;
    }

    setIsGenerating(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('https://cinemindmovies-rad-project.onrender.com/api/movies/ai-generate', {
        title
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;

      setDescription(data.description || '');
      setGenre(data.genre || '');
      setReleaseDate(data.releaseDate || '');
      setRating(data.rating || '');
      
    } catch (error) {
      console.error(error);
      setError("Failed to generate details. Make sure you are an Admin.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await axios.post('https://cinemindmovies-rad-project.onrender.com/api/movies', {
        title,
        description,
        genre,
        releaseDate,
        rating: Number(rating),
        image,
        telegramLink //   Save කරනකොට Telegram Link එකත් යවනවා
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Movie Added Successfully! 🎬');
      navigate('/dashboard');

    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to add movie');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-[5%] left-[10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Add New Movie 🎬
          </h2>
          <p className="text-gray-300 text-sm mt-2">Use AI to auto-fill details or enter manually</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & AI Button */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Movie Title</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-1 p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                placeholder="Ex: Avatar 2"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center gap-2 ${
                  isGenerating 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25'
                }`}
              >
                {isGenerating ? <><span className="animate-spin">🌀</span> Generating...</> : <>✨ AI Fill</>}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">Tip: Type the movie title and click "AI Fill" to convert magic into data.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Description</label>
            <textarea 
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm h-28 leading-relaxed"
              placeholder="Movie synopsis..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          {/* Genre & Release Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Genre</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                placeholder="Action, Sci-Fi"
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Release Date</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                placeholder="YYYY-MM-DD"
                value={releaseDate} 
                onChange={(e) => setReleaseDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Rating & Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Rating (1-10)</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                step="0.1" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                value={rating} 
                onChange={(e) => setRating(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase">Image URL</label>
              <input 
                type="url" 
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
                placeholder="https://..."
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
            </div>
          </div>

          {/*   Telegram Link Input Field */}
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 ml-1 uppercase text-blue-300">Telegram Download Link 📥</label>
            <input 
              type="url" 
              className="w-full p-3 rounded-xl bg-blue-900/20 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
              placeholder="https://t.me/..."
              value={telegramLink} 
              onChange={(e) => setTelegramLink(e.target.value)} 
            />
            <p className="text-xs text-gray-400 mt-2 ml-1">Optional: Paste the direct telegram file link here.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-blue-500/25 active:scale-95"
            >
              Save Movie
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 backdrop-blur-md transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddMovie;