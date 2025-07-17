"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Film, User, Calendar, Share2, Star, Eye, Clock, Users } from "lucide-react"
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
    // Show success feedback
    const button = document.getElementById("share-button")
    const originalText = button.innerHTML
    button.innerHTML =
      '<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>¡Copiado!'
    setTimeout(() => {
      button.innerHTML = originalText
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Film className="h-8 w-8 text-white" />
          </div>
          <div className="w-8 h-8 border-4 border-cinema-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cinema-neutral-600 font-medium">Cargando lista compartida...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Film className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">Lista no encontrada</h1>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 lg:p-12 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* List Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cinema-gradient rounded-2xl flex items-center justify-center shadow-cinema flex-shrink-0">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-display font-bold text-cinema-neutral-800 mb-2">
                    {list.name}
                  </h1>
                  {list.description && (
                    <p className="text-cinema-neutral-600 text-lg leading-relaxed">{list.description}</p>
                  )}
                </div>
              </div>

              {/* List Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-cinema-neutral-50 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-cinema-blue-800 mb-2">
                    <User size={18} />
                    <span className="font-semibold text-sm">Creador</span>
                  </div>
                  <p className="font-bold text-cinema-neutral-800">{list.user.username}</p>
                </div>

                <div className="bg-cinema-neutral-50 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-cinema-red-500 mb-2">
                    <Film size={18} />
                    <span className="font-semibold text-sm">Películas</span>
                  </div>
                  <p className="font-bold text-cinema-neutral-800">
                    {list.movies.length} {list.movies.length === 1 ? "película" : "películas"}
                  </p>
                </div>

                <div className="bg-cinema-neutral-50 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-cinema-gold-600 mb-2">
                    <Calendar size={18} />
                    <span className="font-semibold text-sm">Creada</span>
                  </div>
                  <p className="font-bold text-cinema-neutral-800">
                    {new Date(list.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>

                <div className="bg-cinema-neutral-50 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <Users size={18} />
                    <span className="font-semibold text-sm">Estado</span>
                  </div>
                  <p className="font-bold text-cinema-neutral-800">Pública</p>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex-shrink-0">
              <button id="share-button" onClick={shareList} className="btn-secondary flex items-center gap-2">
                <Share2 size={18} />
                Compartir Lista
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {list.movies.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-12 text-center">
            <div className="w-20 h-20 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-cinema-neutral-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-cinema-neutral-700 mb-3">Lista vacía</h2>
            <p className="text-cinema-neutral-500 font-medium">Esta lista no contiene películas aún.</p>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-cinema-gradient rounded-xl flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cinema-neutral-800">Películas en esta lista</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {list.movies.map((movie) => (
                <div key={movie.movieId} className="group cursor-pointer" onClick={() => handleMovieClick(movie)}>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                    {/* Movie Poster */}
                    <div className="aspect-[2/3] relative">
                      <img
                        src={
                          movie.posterPath
                            ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
                            : "/placeholder.svg?height=400&width=300"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Rating Badge */}
                      {movie.voteAverage && (
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-xl px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-cinema-gold-500 fill-current" />
                          <span className="text-white text-xs font-bold">{movie.voteAverage.toFixed(1)}</span>
                        </div>
                      )}

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Eye className="w-6 h-6 text-cinema-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-cinema-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Movie Info */}
                  <div className="mt-4">
                    <h3 className="font-display font-bold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors duration-200 line-clamp-2 mb-2">
                      {movie.title}
                    </h3>

                    <div className="flex items-center justify-between text-sm">
                      {movie.releaseDate && (
                        <div className="flex items-center gap-1 text-cinema-neutral-500">
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">{new Date(movie.releaseDate).getFullYear()}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-cinema-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">Ver detalles</span>
                      </div>
                    </div>
                  </div>
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
