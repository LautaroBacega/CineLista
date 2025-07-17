"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  List,
  Share2,
  Trash2,
  Film,
  Lock,
  Globe,
  Edit3,
  Star,
  Calendar,
  Users,
  Eye,
  Settings,
  Heart,
  Clock,
} from "lucide-react"
import { useUser } from "../hooks/useUser"
import { apiInterceptor } from "../utils/apiInterceptor"
import MovieModal from "./MovieModal"

export default function UserLists() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [newListData, setNewListData] = useState({ name: "", description: "", isPublic: false })
  const [creatingList, setCreatingList] = useState(false)
  const { currentUser } = useUser()

  useEffect(() => {
    if (currentUser) {
      fetchLists()

      // Refrescar listas cada 30 segundos para mantener sincronización
      const interval = setInterval(fetchLists, 30000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const fetchLists = async () => {
    try {
      setLoading(true)
      const response = await apiInterceptor.fetchWithAuth("/api/lists")
      const data = await response.json()
      setLists(data)
    } catch (error) {
      console.error("Error fetching lists:", error)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (e) => {
    e.preventDefault()
    try {
      setCreatingList(true)
      const response = await apiInterceptor.fetchWithAuth("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListData),
      })

      if (response.ok) {
        await fetchLists()
        setShowCreateModal(false)
        setNewListData({ name: "", description: "", isPublic: false })
      }
    } catch (error) {
      console.error("Error creating list:", error)
    } finally {
      setCreatingList(false)
    }
  }

  const deleteList = async (listId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta lista?")) return

    try {
      const response = await apiInterceptor.fetchWithAuth(`/api/lists/${listId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchLists()
        if (selectedList?._id === listId) {
          setSelectedList(null)
        }
      }
    } catch (error) {
      console.error("Error deleting list:", error)
    }
  }

  const removeMovieFromList = async (listId, movieId) => {
    try {
      const response = await apiInterceptor.fetchWithAuth(`/api/lists/${listId}/movies/${movieId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Actualizar inmediatamente el estado local
        setLists((prevLists) =>
          prevLists.map((list) =>
            list._id === listId
              ? { ...list, movies: list.movies.filter((m) => m.movieId !== Number.parseInt(movieId)) }
              : list,
          ),
        )

        // Actualizar selectedList si es la que se está mostrando
        if (selectedList?._id === listId) {
          setSelectedList((prev) => ({
            ...prev,
            movies: prev.movies.filter((m) => m.movieId !== Number.parseInt(movieId)),
          }))
        }
      }
    } catch (error) {
      console.error("Error removing movie from list:", error)
    }
  }

  const generateShareLink = async (listId) => {
    try {
      const response = await apiInterceptor.fetchWithAuth(`/api/lists/${listId}/share`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        navigator.clipboard.writeText(data.shareUrl)

        // Show success feedback
        const button = document.getElementById(`share-btn-${listId}`)
        if (button) {
          const originalText = button.innerHTML
          button.innerHTML =
            '<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>¡Copiado!'
          setTimeout(() => {
            button.innerHTML = originalText
          }, 2000)
        }

        await fetchLists()
      }
    } catch (error) {
      console.error("Error generating share link:", error)
    }
  }

  const handleMovieClick = (movie) => {
    // Convert list movie format to TMDB format
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

  const getListIcon = (listName) => {
    switch (listName) {
      case "Favoritas":
        return <Heart className="w-5 h-5 text-cinema-red-500" />
      case "Aún no he visto":
        return <Eye className="w-5 h-5 text-cinema-blue-800" />
      case "Ya vistas":
        return <Clock className="w-5 h-5 text-green-600" />
      default:
        return <List className="w-5 h-5 text-cinema-neutral-600" />
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Film className="w-10 h-10 text-cinema-neutral-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">
            Inicia sesión para ver tus listas
          </h2>
          <p className="text-cinema-neutral-600 font-medium">
            Crea listas personalizadas y guarda tus películas favoritas.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <List className="h-8 w-8 text-white" />
          </div>
          <div className="w-8 h-8 border-4 border-cinema-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cinema-neutral-600 font-medium">Cargando tus listas cinematográficas...</p>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center shadow-cinema">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-cinema-neutral-800">Mis Listas</h1>
                <p className="text-cinema-neutral-600 font-medium text-lg">
                  Organizá tus películas en listas personalizadas
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Plus size={20} />
            Nueva Lista
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Lists Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cinema-blue-100 rounded-xl flex items-center justify-center">
                  <List className="w-5 h-5 text-cinema-blue-800" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-cinema-neutral-800">Tus Listas</h2>
                  <p className="text-sm text-cinema-neutral-500">{lists.length} listas creadas</p>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {lists.map((list) => (
                  <div
                    key={list._id}
                    className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedList?._id === list._id
                        ? "bg-cinema-red-50 border-2 border-cinema-red-500 shadow-cinema"
                        : "hover:bg-cinema-neutral-50 border-2 border-transparent"
                    }`}
                    onClick={() => setSelectedList(list)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getListIcon(list.name)}
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate ${
                              selectedList?._id === list._id
                                ? "text-cinema-red-700"
                                : "text-cinema-neutral-800 group-hover:text-cinema-red-500"
                            }`}
                          >
                            {list.name}
                          </h3>
                          <p className="text-xs text-cinema-neutral-500">
                            {list.movies.length} película{list.movies.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {list.isPublic ? (
                          <Globe size={14} className="text-green-500" title="Lista pública" />
                        ) : (
                          <Lock size={14} className="text-cinema-neutral-400" title="Lista privada" />
                        )}
                        {!list.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteList(list._id)
                            }}
                            className="p-1 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {list.description && (
                      <p className="text-xs text-cinema-neutral-500 line-clamp-2 mt-1">{list.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="xl:col-span-3">
            {selectedList ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-8">
                {/* List Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cinema-gradient rounded-2xl flex items-center justify-center shadow-cinema flex-shrink-0">
                      {getListIcon(selectedList.name)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-display font-bold text-cinema-neutral-800 mb-2">
                        {selectedList.name}
                      </h2>
                      {selectedList.description && (
                        <p className="text-cinema-neutral-600 font-medium mb-3">{selectedList.description}</p>
                      )}

                      {/* List Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-cinema-neutral-50 px-3 py-1 rounded-lg">
                          <Film className="w-4 h-4 text-cinema-red-500" />
                          <span className="font-semibold text-cinema-neutral-700">
                            {selectedList.movies.length} película{selectedList.movies.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-cinema-neutral-50 px-3 py-1 rounded-lg">
                          <Calendar className="w-4 h-4 text-cinema-blue-800" />
                          <span className="font-semibold text-cinema-neutral-700">
                            Creada {new Date(selectedList.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-cinema-neutral-50 px-3 py-1 rounded-lg">
                          {selectedList.isPublic ? (
                            <>
                              <Globe className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-green-700">Pública</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-cinema-neutral-500" />
                              <span className="font-semibold text-cinema-neutral-700">Privada</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      id={`share-btn-${selectedList._id}`}
                      onClick={() => generateShareLink(selectedList._id)}
                      className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <Share2 size={16} />
                      Compartir
                    </button>
                  </div>
                </div>

                {/* Movies Grid */}
                {selectedList.movies.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Film className="w-10 h-10 text-cinema-neutral-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-cinema-neutral-700 mb-3">
                      Esta lista está vacía
                    </h3>
                    <p className="text-cinema-neutral-500 font-medium mb-6">
                      Agrega películas desde la página principal para comenzar tu colección
                    </p>
                    <a href="/" className="btn-primary inline-flex items-center gap-2">
                      <Plus size={18} />
                      Explorar Películas
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {selectedList.movies.map((movie) => (
                      <div key={movie.movieId} className="group relative">
                        <div className="cursor-pointer" onClick={() => handleMovieClick(movie)}>
                          <div className="aspect-[2/3] relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
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

                          <h3 className="mt-3 text-sm font-bold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors duration-200 line-clamp-2">
                            {movie.title}
                          </h3>

                          {movie.releaseDate && (
                            <p className="text-xs text-cinema-neutral-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(movie.releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeMovieFromList(selectedList._id, movie.movieId)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-cinema-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-12 text-center">
                <div className="w-20 h-20 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <List className="w-10 h-10 text-cinema-neutral-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">
                  Selecciona una lista para ver su contenido
                </h2>
                <p className="text-cinema-neutral-600 font-medium mb-8">
                  Haz clic en cualquier lista de la izquierda para ver las películas que contiene.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-cinema-neutral-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{lists.length} listas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>{lists.reduce((total, list) => total + list.movies.length, 0)} películas</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-cinema">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cinema-neutral-800">Crear Nueva Lista</h2>
              <p className="text-cinema-neutral-600 font-medium">Organiza tus películas como quieras</p>
            </div>

            <form onSubmit={createList} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                  <Edit3 size={16} className="text-cinema-red-500" />
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={newListData.name}
                  onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                  placeholder="Mi lista de películas favoritas"
                  className="input-primary"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                  <List size={16} className="text-cinema-blue-800" />
                  Descripción (opcional)
                </label>
                <textarea
                  value={newListData.description}
                  onChange={(e) => setNewListData({ ...newListData, description: e.target.value })}
                  placeholder="Describe tu lista..."
                  className="input-primary resize-none"
                  rows="3"
                />
              </div>

              <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-cinema-neutral-800 text-sm">Lista Pública</p>
                      <p className="text-xs text-cinema-neutral-500">Otros usuarios podrán ver esta lista</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newListData.isPublic}
                    onChange={(e) => setNewListData({ ...newListData, isPublic: e.target.checked })}
                    className="w-5 h-5 text-cinema-red-500 bg-cinema-neutral-100 border-cinema-neutral-300 rounded focus:ring-cinema-red-500 focus:ring-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-cinema-neutral-300 text-cinema-neutral-700 font-semibold rounded-xl hover:bg-cinema-neutral-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingList}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {creatingList ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plus size={18} />
                      Crear Lista
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movie Modal */}
      <MovieModal movie={selectedMovie} isOpen={showMovieModal} onClose={() => setShowMovieModal(false)} />
    </div>
  )
}
