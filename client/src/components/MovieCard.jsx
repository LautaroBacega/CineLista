"use client"

import { Star } from "lucide-react"

const MovieCard = ({ movie, onMovieClick }) => {
  const handleClick = () => {
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Imagen del póster */}
      <div className="relative overflow-hidden">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-movie.png"}
          alt={movie.title}
          className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay con calificación */}
        {movie.vote_average && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          {/* Información adicional */}
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs font-medium uppercase">
              {movie.original_language}
            </span>

            <span className="text-gray-400">•</span>

            <span className="font-medium">{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
