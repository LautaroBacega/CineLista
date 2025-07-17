"use client"

import { useState, useEffect } from "react"
import {
  X,
  Star,
  Calendar,
  Clock,
  Users,
  Plus,
  Check,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Award,
  Globe,
  Film,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { useUser } from "../hooks/useUser"
import { apiInterceptor } from "../utils/apiInterceptor"
import AuthRequiredModal from "./AuthRequiredModal"
import CopySuccessModal from "./CopySuccessModal"

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
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
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

      // Show success feedback
      const button = document.getElementById("add-to-list-btn")
      if (button) {
        const originalText = button.innerHTML
        button.innerHTML =
          '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>¡Agregada!'
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      }
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

  const shareMovie = async () => {
    const shareData = {
      title: movie.title,
      text: `¡Mirá esta película increíble: ${movie.title}! 🎬`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        setShowCopyModal(true)
      }
    } catch (error) {
      // If native sharing fails, fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShowCopyModal(true)
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError)
      }
    }
  }

  if (!isOpen || !movie) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
          {/* Header with Close Button */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-cinema-neutral-200 p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cinema-gradient rounded-xl flex items-center justify-center shadow-cinema">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-cinema-neutral-800">Detalles de la Película</h2>
                <p className="text-sm text-cinema-neutral-500">Información completa y reparto</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-cinema-neutral-400 hover:text-cinema-red-500 hover:bg-cinema-red-50 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(95vh-88px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 border-4 border-cinema-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-cinema-neutral-600 font-medium">Cargando detalles cinematográficos...</p>
              </div>
            ) : (
              <div className="p-8">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                  {/* Poster */}
                  <div className="flex-shrink-0 lg:w-80">
                    <div className="relative group">
                      <div className="aspect-[2/3] relative overflow-hidden rounded-3xl shadow-2xl">
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : "/placeholder.svg?height=600&width=400"
                          }
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>

                      {/* Floating Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                          onClick={shareMovie}
                          className="w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-cinema-blue-800 text-cinema-blue-800 hover:text-white rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                          title="Compartir película"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1">
                    {/* Title and Basic Info */}
                    <div className="mb-8">
                      <h1 className="text-4xl lg:text-5xl font-display font-black text-cinema-neutral-800 mb-4 leading-tight">
                        {movie.title}
                      </h1>

                      {movieDetails?.tagline && (
                        <p className="text-xl text-cinema-neutral-600 font-medium italic mb-6">
                          "{movieDetails.tagline}"
                        </p>
                      )}

                      {/* Rating and Meta Info */}
                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        {movie.vote_average && (
                          <div className="flex items-center gap-2 bg-cinema-gold-50 border border-cinema-gold-200 rounded-2xl px-4 py-2">
                            <Star className="w-5 h-5 text-cinema-gold-500 fill-current" />
                            <span className="font-bold text-cinema-gold-700 text-lg">
                              {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="text-cinema-gold-600 text-sm">/10</span>
                          </div>
                        )}

                        {movie.release_date && (
                          <div className="flex items-center gap-2 bg-cinema-blue-50 border border-cinema-blue-200 rounded-2xl px-4 py-2">
                            <Calendar className="w-5 h-5 text-cinema-blue-800" />
                            <span className="font-semibold text-cinema-blue-800">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          </div>
                        )}

                        {movieDetails?.runtime && (
                          <div className="flex items-center gap-2 bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-2xl px-4 py-2">
                            <Clock className="w-5 h-5 text-cinema-neutral-600" />
                            <span className="font-semibold text-cinema-neutral-700">{movieDetails.runtime} min</span>
                          </div>
                        )}

                        {movieDetails?.vote_count && (
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-2">
                            <Users className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-700">
                              {movieDetails.vote_count.toLocaleString()} votos
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Genres */}
                      {movieDetails?.genres && movieDetails.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {movieDetails.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-4 py-2 bg-cinema-gradient text-white rounded-xl text-sm font-semibold shadow-cinema"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="relative">
                        <button
                          id="add-to-list-btn"
                          onClick={handleAddToListClick}
                          className="btn-primary flex items-center gap-2 px-6 py-3"
                        >
                          <Plus size={20} />
                          {currentUser ? "Agregar a Lista" : "Agregar a Lista (Requiere cuenta)"}
                        </button>

                        {/* List Selector Dropdown */}
                        {showListSelector && currentUser && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-cinema-neutral-200 rounded-2xl shadow-2xl z-20 min-w-64 animate-slide-down">
                            <div className="p-4 border-b border-cinema-neutral-200">
                              <h3 className="font-semibold text-cinema-neutral-800 flex items-center gap-2">
                                <Bookmark className="w-4 h-4 text-cinema-red-500" />
                                Seleccionar Lista
                              </h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {userLists.map((list) => (
                                <button
                                  key={list._id}
                                  onClick={() => addToList(list._id)}
                                  disabled={isMovieInList(list._id) || addingToList}
                                  className="w-full text-left px-4 py-3 hover:bg-cinema-neutral-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-cinema-neutral-100 rounded-lg flex items-center justify-center">
                                      {list.name === "Favoritas" ? (
                                        <Heart className="w-4 h-4 text-cinema-red-500" />
                                      ) : list.name === "Aún no he visto" ? (
                                        <Eye className="w-4 h-4 text-cinema-blue-800" />
                                      ) : (
                                        <Film className="w-4 h-4 text-cinema-neutral-600" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-cinema-neutral-800">{list.name}</p>
                                      <p className="text-xs text-cinema-neutral-500">
                                        {list.movies.length} película{list.movies.length !== 1 ? "s" : ""}
                                      </p>
                                    </div>
                                  </div>
                                  {isMovieInList(list._id) ? (
                                    <Check size={16} className="text-green-500" />
                                  ) : (
                                    <ChevronRight size={16} className="text-cinema-neutral-400" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {movieDetails?.homepage && (
                        <a
                          href={movieDetails.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 px-6 py-3"
                        >
                          <ExternalLink size={18} />
                          Sitio Oficial
                        </a>
                      )}
                    </div>

                    {/* Overview */}
                    <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-3xl p-8">
                      <h3 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-cinema-gold-500" />
                        Sinopsis
                      </h3>
                      <p className="text-cinema-neutral-700 leading-relaxed text-lg">
                        {movieDetails?.overview || movie.overview || "No hay sinopsis disponible para esta película."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-cinema-neutral-200 mb-8">
                  <nav className="flex space-x-8">
                    {[
                      { id: "overview", label: "Información", icon: Film },
                      { id: "cast", label: "Reparto", icon: Users },
                      { id: "details", label: "Detalles", icon: Award },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 font-semibold transition-all duration-200 ${
                          activeTab === id
                            ? "border-cinema-red-500 text-cinema-red-500"
                            : "border-transparent text-cinema-neutral-600 hover:text-cinema-red-500"
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-64">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Production Info */}
                      {movieDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                            <div className="bg-white border border-cinema-neutral-200 rounded-2xl p-6">
                              <h4 className="text-lg font-display font-bold text-cinema-neutral-800 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-cinema-gold-500" />
                                Productoras
                              </h4>
                              <div className="space-y-3">
                                {movieDetails.production_companies.slice(0, 5).map((company) => (
                                  <div key={company.id} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-cinema-red-500 rounded-full"></div>
                                    <span className="text-cinema-neutral-700 font-medium">{company.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {movieDetails.production_countries && movieDetails.production_countries.length > 0 && (
                            <div className="bg-white border border-cinema-neutral-200 rounded-2xl p-6">
                              <h4 className="text-lg font-display font-bold text-cinema-neutral-800 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-cinema-blue-800" />
                                Países de Producción
                              </h4>
                              <div className="space-y-3">
                                {movieDetails.production_countries.map((country) => (
                                  <div key={country.iso_3166_1} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-cinema-blue-800 rounded-full"></div>
                                    <span className="text-cinema-neutral-700 font-medium">{country.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "cast" && (
                    <div>
                      {credits?.cast && credits.cast.length > 0 ? (
                        <div>
                          <h3 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-8 flex items-center gap-3">
                            <Users className="w-6 h-6 text-cinema-red-500" />
                            Reparto Principal
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {credits.cast.slice(0, 18).map((actor) => (
                              <div key={actor.id} className="group text-center">
                                <div className="aspect-[2/3] relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 mb-4">
                                  <img
                                    src={
                                      actor.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                        : "/placeholder.svg?height=200&width=150"
                                    }
                                    alt={actor.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <h4 className="font-bold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors duration-200 mb-1">
                                  {actor.name}
                                </h4>
                                <p className="text-sm text-cinema-neutral-500 font-medium">{actor.character}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-cinema-neutral-400" />
                          </div>
                          <p className="text-cinema-neutral-600 font-medium">
                            No hay información de reparto disponible
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div>
                      {movieDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="bg-white border border-cinema-neutral-200 rounded-2xl p-6">
                              <h4 className="text-lg font-display font-bold text-cinema-neutral-800 mb-4">
                                Información Técnica
                              </h4>
                              <div className="space-y-4">
                                {movieDetails.budget > 0 && (
                                  <div className="flex justify-between items-center py-2 border-b border-cinema-neutral-100">
                                    <span className="text-cinema-neutral-600 font-medium">Presupuesto</span>
                                    <span className="font-bold text-cinema-neutral-800">
                                      ${movieDetails.budget.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                {movieDetails.revenue > 0 && (
                                  <div className="flex justify-between items-center py-2 border-b border-cinema-neutral-100">
                                    <span className="text-cinema-neutral-600 font-medium">Recaudación</span>
                                    <span className="font-bold text-cinema-neutral-800">
                                      ${movieDetails.revenue.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center py-2 border-b border-cinema-neutral-100">
                                  <span className="text-cinema-neutral-600 font-medium">Idioma Original</span>
                                  <span className="font-bold text-cinema-neutral-800 uppercase">
                                    {movieDetails.original_language}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-cinema-neutral-600 font-medium">Estado</span>
                                  <span className="font-bold text-green-600">{movieDetails.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {movieDetails.spoken_languages && movieDetails.spoken_languages.length > 0 && (
                              <div className="bg-white border border-cinema-neutral-200 rounded-2xl p-6">
                                <h4 className="text-lg font-display font-bold text-cinema-neutral-800 mb-4">
                                  Idiomas Hablados
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {movieDetails.spoken_languages.map((language) => (
                                    <span
                                      key={language.iso_639_1}
                                      className="px-3 py-1 bg-cinema-blue-100 text-cinema-blue-800 rounded-lg text-sm font-medium"
                                    >
                                      {language.english_name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} movieTitle={movie?.title} />

      <CopySuccessModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        title="¡Enlace de Película Copiado! 🎬"
        message="El enlace de la película se ha copiado al portapapeles. Ahora podés compartirlo con tus amigos."
        type="share"
      />
    </>
  )
}
