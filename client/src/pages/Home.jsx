"use client"

import { useUser } from "../hooks/useUser"
import { TrendingUp, Film, Sparkles, Users, Star, Eye } from "lucide-react"

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

  const handleTrendingMovieClick = async (trendingMovie) => {
    try {
      // Fetch full movie details from TMDB using the movie_id
      const response = await fetch(`${API_BASE_URL}/movie/${trendingMovie.movie_id}`, API_OPTIONS)

      if (response.ok) {
        const movieDetails = await response.json()
        handleMovieClick(movieDetails)
      }
    } catch (error) {
      console.error("Error fetching trending movie details:", error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-cinema-gradient opacity-5"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-8">
            <div className="text-center mb-16">
              {/* Hero Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-cinema-neutral-200 rounded-full px-6 py-3 mb-8 shadow-lg">
                <Sparkles className="w-5 h-5 text-cinema-gold-500" />
                <span className="text-cinema-neutral-700 font-semibold">Tu mundo cinematográfico personal</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl lg:text-7xl font-display font-black mb-6">
                <span className="text-gradient">Descubrí.</span> <span className="text-cinema-blue-800">Creá.</span>{" "}
                <span className="text-gold-gradient">Compartí.</span>
              </h1>

              <p className="text-xl lg:text-2xl text-cinema-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Organizá tus películas favoritas, creá listas personalizadas y compartí tus descubrimientos
                cinematográficos con el mundo.
              </p>

              {/* Stats */}
              {/* <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-cinema-red-500">10K+</div>
                  <div className="text-cinema-neutral-600 font-medium">Películas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-cinema-blue-800">5K+</div>
                  <div className="text-cinema-neutral-600 font-medium">Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-cinema-gold-500">50K+</div>
                  <div className="text-cinema-neutral-600 font-medium">Listas Creadas</div>
                </div>
              </div> */}
            </div>

            {/* Search Component */}
            <SearchWithAutocomplete
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onMovieSelect={handleMovieClick}
            />
          </div>
        </section>

        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-display font-bold text-cinema-neutral-800">
                      Películas en Tendencia
                    </h2>
                    <p className="text-cinema-neutral-600 font-medium">Las más buscadas esta semana</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {trendingMovies.map((movie, index) => (
                    <div
                      key={movie.$id}
                      className="group cursor-pointer"
                      onClick={() => handleTrendingMovieClick(movie)}
                    >
                      <div className="relative">
                        {/* Ranking Badge */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gold-gradient text-cinema-blue-800 text-sm font-black rounded-full flex items-center justify-center z-10 shadow-glow">
                          {index + 1}
                        </div>

                        <div className="aspect-[2/3] relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                          <img
                            src={movie.poster_url || "/placeholder.svg"}
                            alt={movie.searchTerm}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Play Icon Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Eye className="w-6 h-6 text-cinema-red-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors mt-3 text-center line-clamp-2">
                        {movie.searchTerm}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Movies Grid Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cinema-gradient rounded-2xl flex items-center justify-center shadow-cinema">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-cinema-neutral-800">
                    {searchTerm ? `Resultados para "${searchTerm}"` : "Catálogo de Películas"}
                  </h2>
                  <p className="text-cinema-neutral-600 font-medium">
                    {searchTerm ? "Encontrá tu próxima película favorita" : "Explorá nuestro extenso catálogo"}
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Spinner />
                <p className="text-cinema-neutral-600 font-medium mt-6">Cargando películas increíbles...</p>
              </div>
            ) : errorMessage ? (
              <div className="text-center py-24">
                <div className="bg-red-50 border border-red-200 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Film className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">Error al cargar películas</h3>
                  <p className="text-red-600 font-medium">{errorMessage}</p>
                </div>
              </div>
            ) : movieList.length === 0 ? (
              <div className="text-center py-24">
                <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Film className="w-8 h-8 text-cinema-neutral-400" />
                  </div>
                  <h3 className="text-xl font-bold text-cinema-neutral-700 mb-3">No se encontraron películas</h3>
                  <p className="text-cinema-neutral-500 font-medium">Intentá con otro término de búsqueda</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onMovieClick={handleMovieClick} userLists={userLists} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!currentUser && (
          <section className="py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-cinema-gradient rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Users className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                    Únete a la Comunidad Cinematográfica
                  </h2>

                  <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    Creá tu cuenta gratuita y comenzá a organizar tus películas favoritas, crear listas personalizadas y
                    descubrir nuevos títulos.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/sign-up" className="btn-gold inline-flex items-center justify-center gap-2">
                      <Star className="w-5 h-5" />
                      Comenzar Gratis
                    </a>
                    <a
                      href="/sign-in"
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30"
                    >
                      Iniciar Sesión
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <MovieModal movie={selectedMovie} isOpen={showMovieModal} onClose={() => setShowMovieModal(false)} />
    </main>
  )
}
