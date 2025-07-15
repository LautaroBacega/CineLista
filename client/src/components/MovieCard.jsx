"use client"

import { Star, Heart, Eye, EyeOff, Plus } from "lucide-react"
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1 relative"
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        {/* Imagen del póster */}
        <div className="relative overflow-hidden" onClick={handleClick}>
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

          {/* Quick Actions Overlay */}
          {showQuickActions && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
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
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isMovieInList(defaultLists.favorites)
                      ? "bg-red-500 text-white"
                      : "bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white"
                  } ${addingToList === "Favoritas" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.favorites) ? "En Favoritas" : "Agregar a Favoritas"}
                >
                  <Heart size={16} className={isMovieInList(defaultLists.favorites) ? "fill-current" : ""} />
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
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isMovieInList(defaultLists.watchLater)
                      ? "bg-blue-500 text-white"
                      : "bg-white/90 hover:bg-blue-500 text-gray-700 hover:text-white"
                  } ${addingToList === "Aún no he visto" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.watchLater) ? "En lista para ver" : "Quiero verla"}
                >
                  <Eye size={16} />
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
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isMovieInList(defaultLists.watched)
                      ? "bg-green-500 text-white"
                      : "bg-white/90 hover:bg-green-500 text-gray-700 hover:text-white"
                  } ${addingToList === "Ya vistas" ? "animate-pulse" : ""}`}
                  title={isMovieInList(defaultLists.watched) ? "Ya vista" : "Marcar como vista"}
                >
                  <EyeOff size={16} />
                </button>

                {/* Más opciones */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                  className="p-2 rounded-full bg-white/90 hover:bg-purple-500 text-gray-700 hover:text-white transition-all duration-200"
                  title="Ver detalles y más opciones"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4" onClick={handleClick}>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs font-medium uppercase">
                {movie.original_language}
              </span>

              <span className="text-gray-400">•</span>

              <span className="font-medium">{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Indicadores de estado en la esquina inferior */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {isMovieInList(defaultLists.favorites) && (
            <div className="w-2 h-2 bg-red-500 rounded-full" title="En Favoritas"></div>
          )}
          {isMovieInList(defaultLists.watchLater) && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Quiero verla"></div>
          )}
          {isMovieInList(defaultLists.watched) && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Ya vista"></div>
          )}
        </div>
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} movieTitle={movie?.title} />
    </>
  )
}

export default MovieCard
