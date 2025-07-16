"use client"

import { useState, useEffect, useRef } from "react"
import { SearchIcon, X, Film } from "lucide-react"
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
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>

        <input
          ref={searchRef}
          type="text"
          placeholder="Buscar películas..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full pl-12 pr-12 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl"></div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Buscando...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center text-red-500 mb-2">
                <Film className="w-5 h-5 mr-2" />
                <span className="text-sm">Error al buscar películas</span>
              </div>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && searchTerm.length >= 3 && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center text-gray-500 mb-2">
                <Film className="w-5 h-5 mr-2" />
                <span className="text-sm">No se encontraron películas</span>
              </div>
              <p className="text-xs text-gray-400">Intentá con otro término de búsqueda</p>
            </div>
          )}

          {!loading &&
            !error &&
            suggestions.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {/* Movie Poster */}
                <div className="flex-shrink-0 w-12 h-16 mr-3">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "/no-movie.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-md shadow-sm"
                    onError={(e) => {
                      e.target.src = "/no-movie.png"
                    }}
                  />
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {movie.release_date && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {movie.vote_average > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {movie.overview && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {movie.overview.length > 100 ? `${movie.overview.substring(0, 100)}...` : movie.overview}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
