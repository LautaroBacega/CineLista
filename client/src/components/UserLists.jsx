"use client"

import { useState, useEffect } from "react"
import { Plus, List, Share2, Trash2, Film, Lock, Globe } from "lucide-react"
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
  const { currentUser } = useUser()

  useEffect(() => {
    if (currentUser) {
      fetchLists()
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
        await fetchLists()
        // Update selected list if it's currently shown
        if (selectedList?._id === listId) {
          const updatedList = lists.find((l) => l._id === listId)
          setSelectedList(updatedList)
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
        alert("¡Enlace copiado al portapapeles!")
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

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inicia sesión para ver tus listas</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Crea listas personalizadas y guarda tus películas favoritas.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Listas</h1>
          <p className="text-gray-600 dark:text-gray-400">Organiza tus películas en listas personalizadas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nueva Lista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lists Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <List size={24} />
              Tus Listas ({lists.length})
            </h2>
            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedList?._id === list._id
                      ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{list.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {list.movies.length} película{list.movies.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {list.isPublic ? (
                        <Globe size={16} className="text-green-500" title="Lista pública" />
                      ) : (
                        <Lock size={16} className="text-gray-400" title="Lista privada" />
                      )}
                      {!list.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteList(list._id)
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="lg:col-span-2">
          {selectedList ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedList.name}</h2>
                  {selectedList.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedList.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {selectedList.movies.length} película{selectedList.movies.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateShareLink(selectedList._id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Share2 size={16} />
                    Compartir
                  </button>
                </div>
              </div>

              {selectedList.movies.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Esta lista está vacía</p>
                  <p className="text-sm text-gray-500">Agrega películas desde la página principal</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedList.movies.map((movie) => (
                    <div key={movie.movieId} className="group relative">
                      <div className="cursor-pointer" onClick={() => handleMovieClick(movie)}>
                        <img
                          src={
                            movie.posterPath
                              ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
                              : "/placeholder.svg?height=300&width=200"
                          }
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeMovieFromList(selectedList._id, movie.movieId)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Selecciona una lista para ver su contenido
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Haz clic en cualquier lista de la izquierda para ver las películas que contiene.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Crear Nueva Lista</h2>
            <form onSubmit={createList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={newListData.name}
                  onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newListData.description}
                  onChange={(e) => setNewListData({ ...newListData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newListData.isPublic}
                  onChange={(e) => setNewListData({ ...newListData, isPublic: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                  Hacer lista pública
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Crear Lista
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
