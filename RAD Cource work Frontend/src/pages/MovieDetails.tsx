import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  trailerLink?: string; // ✅ 1. Trailer Link එක Interface එකට දැම්මා
}

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(response.data);

        const allMoviesResponse = await axios.get('http://localhost:5000/api/movies');
        const allMovies: Movie[] = allMoviesResponse.data;

        const recommended = allMovies
          .filter((m) => m.genre === response.data.genre && m._id !== id)
          .slice(0, 3);
        
        setSimilarMovies(recommended);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white text-2xl">Loading... 🍿</div>;
  if (!movie) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white text-2xl">Movie not found 😕</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 md:p-10 font-sans text-white">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
          <span>←</span> Back to Dashboard
        </Link>

        {/* Main Details Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Image */}
          <div className="w-full md:w-1/3 h-[500px] md:h-auto relative">
             {movie.image ? (
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">No Image</div>
             )}
          </div>

          {/* Text Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-2/3">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm">★ {movie.rating}</span>
               <span className="text-gray-400 text-sm">{movie.releaseDate?.substring(0, 10)}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              {movie.title}
            </h1>
            
            <div className="mb-8">
              <span className="bg-purple-600/40 border border-purple-500/50 px-4 py-1.5 rounded-lg text-sm font-semibold text-purple-100 tracking-wide">
                {movie.genre}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-gray-200 border-b border-white/10 pb-2 inline-block w-fit">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-10 font-light">
              {movie.description}
            </p>

            {/* ✅ 2. Action Buttons Section (Download & Trailer) */}
            <div className="flex flex-wrap gap-4">
              
              {/* Telegram Button */}
              {movie.telegramLink ? (
                <a 
                  href={movie.telegramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#229ED9] hover:bg-[#1e8dbf] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center gap-3 border border-blue-400/30"
                >
                  <span className="text-xl">✈️</span> Download via Telegram
                </a>
              ) : (
                <button className="bg-gray-600/50 text-gray-400 font-bold px-8 py-4 rounded-xl cursor-not-allowed flex items-center gap-2 border border-white/10">
                  <span>🚫</span> Download Unavailable
                </button>
              )}

              {/* ✅ 3. Watch Trailer Button */}
              {movie.trailerLink ? (
                <a 
                  href={movie.trailerLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2 border border-red-500/30"
                >
                  <span className="text-xl">▶️</span> Watch Trailer
                </a>
              ) : (
                <button className="bg-gray-600/50 text-gray-400 font-bold px-8 py-4 rounded-xl cursor-not-allowed flex items-center gap-2 border border-white/10">
                  <span>🚫</span> No Trailer
                </button>
              )}

            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        {similarMovies.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
              You Might Also Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarMovies.map((similar) => (
                <Link to={`/movie/${similar._id}`} key={similar._id} className="group">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/30 transition duration-300 h-full flex flex-col hover:-translate-y-2 shadow-xl">
                    <div className="h-48 overflow-hidden relative">
                      {similar.image && (
                        <img src={similar.image} alt={similar.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-yellow-400 text-xs px-2 py-1 rounded-md">★ {similar.rating}</div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-lg mb-1 text-gray-200 group-hover:text-blue-300 transition">{similar.title}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{similar.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MovieDetails;