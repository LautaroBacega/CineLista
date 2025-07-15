"use client"

import { useState, useEffect } from "react"
import { X, Star, Calendar, Clock, Users, Plus, Check } from "lucide-react"
import { useUser } from "../hooks/useUser"
import { apiInterceptor } from "../utils/apiInterceptor"
import AuthRequiredModal from "./AuthRequiredModal"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

export default function MovieModal({ movie, isOpen, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null)
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userLists, setUserLists] = useState([])
  const [showListSelector, setShowListSelector] = useState(false)
  const [addingToList, setAddingToList] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { currentUser } = useUser()

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails()
      if (currentUser) {
        fetchUserLists()
      }
    }
  }, [isOpen, movie, currentUser])

  const fetchMovieDetails = async () => {
    setLoading(true)
    try {
      const [detailsResponse, creditsResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}`, API_OPTIONS),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, API_OPTIONS),
      ])

      const details = await detailsResponse.json()
      const creditsData = await creditsResponse.json()

      setMovieDetails(details)
      setCredits(creditsData)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLists = async () => {
    if (!currentUser) return

    try {
      const response = await apiInterceptor.fetchWithAuth("/api/lists")
      const lists = await response.json()
      setUserLists(lists)
    } catch (error) {
      console.error("Error fetching user lists:", error)
    }
  }

  const handleAddToListClick = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }
    setShowListSelector(!showListSelector)
  }

  const addToList = async (listId) => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    setAddingToList(true)
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

      // Update local lists state
      await fetchUserLists()
      setShowListSelector(false)
    } catch (error) {
      console.error("Error adding movie to list:", error)
      if (error.message.includes("401")) {
        setShowAuthModal(true)
      }
    } finally {
      setAddingToList(false)
    }
  }

  const isMovieInList = (listId) => {
    const list = userLists.find((l) => l._id === listId)
    return list?.movies.some((m) => m.movieId === movie.id) || false
  }

  if (!isOpen || !movie) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalles de la Película</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="p-6">
            {/* Movie Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=400&width=300"
                  }
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-lg mx-auto md:mx-0"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{movie.title}</h1>

                {/* Rating and Year */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                    </span>
                  </div>
                  {movieDetails?.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{movieDetails.runtime} min</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movieDetails?.genres && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movieDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sinopsis</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {movieDetails?.overview || movie.overview || "No hay sinopsis disponible."}
                  </p>
                </div>

                {/* Add to List Button - Siempre visible */}
                <div className="relative">
                  <button
                    onClick={handleAddToListClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus size={20} />
                    {currentUser ? "Agregar a Lista" : "Agregar a Lista (Requiere cuenta)"}
                  </button>

                  {/* List Selector Dropdown - Solo si hay usuario */}
                  {showListSelector && currentUser && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                      {userLists.map((list) => (
                        <button
                          key={list._id}
                          onClick={() => addToList(list._id)}
                          disabled={isMovieInList(list._id) || addingToList}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-gray-900 dark:text-white">{list.name}</span>
                          {isMovieInList(list._id) && <Check size={16} className="text-green-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cast */}
            {credits?.cast && credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users size={24} />
                  Reparto Principal
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "/placeholder.svg?height=150&width=100"
                        }
                        alt={actor.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{actor.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Info */}
            {movieDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Productoras</h3>
                    <div className="space-y-1">
                      {movieDetails.production_companies.map((company) => (
                        <p key={company.id} className="text-gray-600 dark:text-gray-400">
                          {company.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {movieDetails.production_countries && movieDetails.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Países</h3>
                    <div className="space-y-1">
                      {movieDetails.production_countries.map((country) => (
                        <p key={country.iso_3166_1} className="text-gray-600 dark:text-gray-400">
                          {country.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Auth Required Modal */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} movieTitle={movie?.title} />
    </div>
  )
}
