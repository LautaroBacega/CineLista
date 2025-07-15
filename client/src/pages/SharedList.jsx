"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Film, User, Calendar, Share2 } from "lucide-react"
import MovieModal from "../components/MovieModal"

export default function SharedList() {
  const { token } = useParams()
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  useEffect(() => {
    fetchSharedList()
  }, [token])

  const fetchSharedList = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/lists/shared/${token}`)

      if (response.ok) {
        const data = await response.json()
        setList(data)
      } else {
        setError("Lista no encontrada o no disponible")
      }
    } catch (error) {
      console.error("Error fetching shared list:", error)
      setError("Error al cargar la lista")
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movie) => {
    const tmdbMovie = {
      id: movie.movieId,
      title: movie.title,
      poster_path: movie.posterPath,
      release_date: movie.releaseDate,
      vote_average: movie.voteAverage,
    }
    setSelectedMovie(tmdbMovie)
    setShowMovieModal(true)
  }

  const shareList = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("¡Enlace copiado al portapapeles!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lista no encontrada</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{list.name}</h1>
              {list.description && <p className="text-gray-600 mb-4">{list.description}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>Por {list.user.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film size={16} />
                  <span>
                    {list.movies.length} película{list.movies.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Creada el {new Date(list.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={shareList}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {list.movies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lista vacía</h2>
            <p className="text-gray-600">Esta lista no contiene películas aún.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {list.movies.map((movie) => (
                <div key={movie.movieId} className="group cursor-pointer" onClick={() => handleMovieClick(movie)}>
                  <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                    <img
                      src={
                        movie.posterPath
                          ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
                          : "/placeholder.svg?height=400&width=300"
                      }
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {movie.voteAverage && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">⭐ {movie.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {movie.title}
                  </h3>
                  {movie.releaseDate && (
                    <p className="text-xs text-gray-500 mt-1">{new Date(movie.releaseDate).getFullYear()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movie Modal */}
        <MovieModal movie={selectedMovie} isOpen={showMovieModal} onClose={() => setShowMovieModal(false)} />
      </div>
    </div>
  )
}
