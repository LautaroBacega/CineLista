"use client"
import { Star, Heart, Eye, EyeOff, Plus, Calendar } from "lucide-react"
import { useState } from "react"
import { useUser } from "../hooks/useUser"
import { apiInterceptor } from "../utils/apiInterceptor"
import AuthRequiredModal from "./AuthRequiredModal"

const MovieCard = ({ movie, onMovieClick, userLists = [] }) => {
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [addingToList, setAddingToList] = useState(null)
  const { currentUser } = useUser()

  // Encontrar las listas por defecto
  const defaultLists = {
    favorites: userLists.find((list) => list.name === "Favoritas"),
    watchLater: userLists.find((list) => list.name === "Aún no he visto"),
    watched: userLists.find((list) => list.name === "Ya vistas"),
  }

  const handleClick = () => {
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  const handleQuickAdd = async (listId, listName) => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    setAddingToList(listName)
    try {
      await apiInterceptor.fetchWithAuth(`/api/lists/${listId}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average,
        }),
      })

      // Mostrar feedback visual temporal
      setTimeout(() => setAddingToList(null), 1000)
    } catch (error) {
      console.error("Error adding movie to list:", error)
      if (error.message.includes("401")) {
        setShowAuthModal(true)
      }
      setAddingToList(null)
    }
  }

  const isMovieInList = (list) => {
    return list?.movies.some((m) => m.movieId === movie.id) || false
  }

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-cinema-neutral-200 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        {/* Poster Container */}
        <div className="relative overflow-hidden" onClick={handleClick}>
          <div className="aspect-[2/3] relative">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-movie.png"}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Rating Badge */}
          {movie.vote_average && (
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
              <Star className="w-4 h-4 text-cinema-gold-500 fill-current" />
              <span className="text-white text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          {showQuickActions && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-3">
                {/* Favoritas */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (defaultLists.favorites) {
                      handleQuickAdd(defaultLists.favorites._id, "Favoritas")
                    }
                  }}
                  disabled={
                    !defaultLists.favorites || isMovieInList(defaultLists.favorites) || addingToList === "Favoritas"
                  }
                  className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg ${
                    isMovieInList(defaultLists.favorites)
                      ? "bg-cinema-red-500 text-white shadow-cinema"
                      : "bg-white/90 hover:bg-cinema-red-500 text-cinema-red-500 hover:text-white"
                  } ${addingToList === "Favoritas" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.favorites) ? "En Favoritas" : "Agregar a Favoritas"}
                >
                  <Heart size={18} className={isMovieInList(defaultLists.favorites) ? "fill-current" : ""} />
                </button>

                {/* Aún no he visto */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (defaultLists.watchLater) {
                      handleQuickAdd(defaultLists.watchLater._id, "Aún no he visto")
                    }
                  }}
                  disabled={
                    !defaultLists.watchLater ||
                    isMovieInList(defaultLists.watchLater) ||
                    addingToList === "Aún no he visto"
                  }
                  className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg ${
                    isMovieInList(defaultLists.watchLater)
                      ? "bg-cinema-blue-800 text-white"
                      : "bg-white/90 hover:bg-cinema-blue-800 text-cinema-blue-800 hover:text-white"
                  } ${addingToList === "Aún no he visto" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.watchLater) ? "En lista para ver" : "Quiero verla"}
                >
                  <Eye size={18} />
                </button>

                {/* Ya vistas */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (defaultLists.watched) {
                      handleQuickAdd(defaultLists.watched._id, "Ya vistas")
                    }
                  }}
                  disabled={
                    !defaultLists.watched || isMovieInList(defaultLists.watched) || addingToList === "Ya vistas"
                  }
                  className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg ${
                    isMovieInList(defaultLists.watched)
                      ? "bg-green-500 text-white"
                      : "bg-white/90 hover:bg-green-500 text-green-500 hover:text-white"
                  } ${addingToList === "Ya vistas" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.watched) ? "Ya vista" : "Marcar como vista"}
                >
                  <EyeOff size={18} />
                </button>

                {/* Más opciones */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                  className="p-3 rounded-xl bg-white/90 hover:bg-cinema-gold-500 text-cinema-gold-600 hover:text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                  title="Ver detalles y más opciones"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-6" onClick={handleClick}>
          <h3 className="font-display font-bold text-lg text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors duration-200 line-clamp-2 mb-3">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-3">
              {movie.release_date && (
                <div className="flex items-center gap-1 text-cinema-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{movie.release_date.split("-")[0]}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <span className="px-2 py-1 bg-cinema-neutral-100 text-cinema-neutral-600 rounded-lg text-xs font-semibold uppercase tracking-wide">
                  {movie.original_language}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {isMovieInList(defaultLists.favorites) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-cinema-red-100 text-cinema-red-600 rounded-lg text-xs font-medium">
                <Heart className="w-3 h-3 fill-current" />
                <span>Favorita</span>
              </div>
            )}
            {isMovieInList(defaultLists.watchLater) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-cinema-blue-100 text-cinema-blue-800 rounded-lg text-xs font-medium">
                <Eye className="w-3 h-3" />
                <span>Por ver</span>
              </div>
            )}
            {isMovieInList(defaultLists.watched) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-medium">
                <EyeOff className="w-3 h-3" />
                <span>Vista</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-cinema-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} movieTitle={movie?.title} />
    </>
  )
}

export default MovieCard
