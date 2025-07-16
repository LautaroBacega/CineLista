"use client"
import { useUser } from "../hooks/useUser"
import { TrendingUp, Film } from "lucide-react"

import { useEffect, useState } from "react"
import SearchWithAutocomplete from "../components/SearchWithAutocomplete.jsx"
import Spinner from "../components/Spinner.jsx"
import MovieCard from "../components/MovieCard.jsx"
import { useDebounce } from "react-use"
import { getTrendingMovies, updateSearchCount } from "../appwrite.js"
import MovieModal from "../components/MovieModal.jsx"
import { apiInterceptor } from "../utils/apiInterceptor.js"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

export default function Home() {
  const { currentUser } = useUser()

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [movieList, setMovieList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [trendingMovies, setTrendingMovies] = useState([])
  const [userLists, setUserLists] = useState([])

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  // Debounce the search term to prevent making too many API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = "") => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies")
        setMovieList([])
        return
      }

      setMovieList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage("Error fetching movies. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`)
    }
  }

  const fetchUserLists = async () => {
    if (!currentUser) {
      setUserLists([])
      return
    }

    try {
      const response = await apiInterceptor.fetchWithAuth("/api/lists")
      const lists = await response.json()
      setUserLists(lists)
    } catch (error) {
      console.error("Error fetching user lists:", error)
      setUserLists([])
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  useEffect(() => {
    fetchUserLists()
  }, [currentUser])

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Descubrí. Creá. Compartí.{" "}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Creá y comparti tus listas y películas favoritas!
            </p>
          </div>

          <SearchWithAutocomplete
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onMovieSelect={handleMovieClick}
          />
        </header>

        {/* User Authentication Section */}
        {/* {!currentUser ? (
          <section className="max-w-4xl mx-auto px-4 mb-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Sistema de{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Autenticación
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Una solución completa de autenticación con registro, inicio de sesión, OAuth con Google, gestión de
                  perfiles y restablecimiento de contraseñas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  to="/sign-in"
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="max-w-md mx-auto px-4 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={currentUser.profilePicture || "/placeholder.svg?height=48&width=48"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 dark:text-white">¡Hola, {currentUser.username}!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-block text-center"
              >
                Ver Perfil
              </Link>
            </div>
          </section>
        )} */}

        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Películas Trending</h2>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {trendingMovies.map((movie, index) => (
                  <div key={movie.$id} className="group cursor-pointer">
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-lg">
                        {index + 1}
                      </div>
                      <img
                        src={movie.poster_url || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2 text-center truncate">
                      {movie.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Movies Section */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <Film className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {searchTerm ? `Resultados para "${searchTerm}"` : "Todas las Películas"}
            </h2>
          </div>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
              </div>
            </div>
          ) : movieList.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
                <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No se encontraron películas</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onMovieClick={handleMovieClick} userLists={userLists} />
              ))}
            </div>
          )}
        </section>
      </div>
      <MovieModal movie={selectedMovie} isOpen={showMovieModal} onClose={() => setShowMovieModal(false)} />
    </main>
  )
}
