"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Film, Star, Calendar, Loader2 } from "lucide-react"
import { useDebounce } from "react-use"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

const SearchWithAutocomplete = ({ searchTerm, setSearchTerm, onMovieSelect }) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Debounce search term
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm])

  // Fetch suggestions when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      fetchSuggestions(debouncedSearchTerm)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedSearchTerm])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=1`,
        API_OPTIONS,
      )

      if (!response.ok) {
        throw new Error("Error al buscar películas")
      }

      const data = await response.json()

      // Limit to 5 results and filter out movies without posters
      const filteredResults = data.results.filter((movie) => movie.poster_path && movie.title).slice(0, 5)

      setSuggestions(filteredResults)
      setShowSuggestions(true)
    } catch (err) {
      setError(err.message)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length >= 3) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (movie) => {
    setSearchTerm(movie.title)
    setShowSuggestions(false)
    if (onMovieSelect) {
      onMovieSelect(movie)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSuggestions([])
    setShowSuggestions(false)
    searchRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0 && searchTerm.length >= 3) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 relative">
      {/* Search Container */}
      <div className="relative group">
        {/* Background Glow Effect */}
        <div className="absolute -inset-1 bg-cinema-gradient rounded-2xl opacity-0 group-focus-within:opacity-20 blur-xl transition-all duration-500"></div>

        {/* Search Input */}
        <div className="relative bg-white rounded-2xl shadow-xl border-2 border-cinema-neutral-200 group-focus-within:border-cinema-red-500 transition-all duration-300">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-cinema-neutral-400 group-focus-within:text-cinema-red-500 transition-colors duration-300" />
          </div>

          <input
            ref={searchRef}
            type="text"
            placeholder="Descubrí tu próxima película favorita..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="w-full pl-16 pr-16 py-5 text-lg font-medium bg-transparent border-none rounded-2xl focus:outline-none focus:ring-0 text-cinema-neutral-800 placeholder-cinema-neutral-400"
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-6 flex items-center text-cinema-neutral-400 hover:text-cinema-red-500 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Search Hint */}
        <p className="text-center text-sm text-cinema-neutral-500 mt-3 font-medium">
          Escribí al menos 3 caracteres para ver sugerencias
        </p>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-4 bg-white border border-cinema-neutral-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-down"
        >
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-cinema-red-500 animate-spin mr-3" />
              <span className="text-cinema-neutral-600 font-medium">Buscando películas...</span>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center text-cinema-red-500 mb-3">
                <Film className="w-6 h-6 mr-2" />
                <span className="font-semibold">Error al buscar películas</span>
              </div>
              <p className="text-sm text-cinema-neutral-500">{error}</p>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && searchTerm.length >= 3 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-cinema-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-cinema-neutral-400" />
              </div>
              <h3 className="font-semibold text-cinema-neutral-700 mb-2">No se encontraron películas</h3>
              <p className="text-sm text-cinema-neutral-500">Intentá con otro término de búsqueda</p>
            </div>
          )}

          {!loading &&
            !error &&
            suggestions.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className={`flex items-center p-4 hover:bg-cinema-neutral-50 cursor-pointer transition-all duration-200 group ${
                  index !== suggestions.length - 1 ? "border-b border-cinema-neutral-100" : ""
                }`}
              >
                {/* Movie Poster */}
                <div className="flex-shrink-0 w-16 h-20 mr-4 relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "/no-movie.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/no-movie.png"
                    }}
                  />
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors duration-200 line-clamp-2 mb-2">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-2">
                    {movie.release_date && (
                      <div className="flex items-center gap-1 text-cinema-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    )}

                    {movie.vote_average > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-cinema-gold-500 fill-current" />
                        <span className="text-sm font-semibold text-cinema-neutral-600">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {movie.overview && (
                    <p className="text-sm text-cinema-neutral-500 line-clamp-2 leading-relaxed">
                      {movie.overview.length > 120 ? `${movie.overview.substring(0, 120)}...` : movie.overview}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 ml-4">
                  <div className="w-8 h-8 flex items-center justify-center text-cinema-neutral-300 group-hover:text-cinema-red-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default SearchWithAutocomplete
