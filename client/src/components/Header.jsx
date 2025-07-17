"use client"
import { Link, useLocation } from "react-router-dom"
import { useUser } from "../hooks/useUser"
import { User, Home, List, Film, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { currentUser } = useUser()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    ...(currentUser ? [{ path: "/lists", label: "Mis Listas", icon: List }] : []),
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-cinema-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-cinema-gradient rounded-xl flex items-center justify-center shadow-cinema group-hover:shadow-cinema-lg transition-all duration-300 group-hover:scale-110">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-gold-500 rounded-full animate-glow-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-display font-bold text-gradient">CineLista</h1>
              <p className="text-xs text-cinema-neutral-500 font-medium -mt-1">Tu mundo cinematográfico</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-cinema-red-500 text-white shadow-cinema"
                    : "text-cinema-neutral-600 hover:text-cinema-red-500 hover:bg-cinema-neutral-100"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cinema-neutral-600 hover:text-cinema-red-500 hover:bg-cinema-neutral-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* User Profile */}
            <Link to="/profile" className="group flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-cinema-neutral-800 group-hover:text-cinema-red-500 transition-colors">
                      {currentUser.username}
                    </p>
                    <p className="text-xs text-cinema-neutral-500">Mi Perfil</p>
                  </div>
                  <div className="relative">
                    <img
                      src={currentUser.profilePicture || "/placeholder.svg"}
                      alt="profile"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-cinema-neutral-200 group-hover:ring-cinema-red-500 transition-all duration-200 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cinema-gold-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cinema-gradient text-white font-semibold hover:shadow-cinema-lg transition-all duration-200 transform hover:scale-105">
                  <User size={18} />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cinema-neutral-200 animate-slide-down">
            <nav className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-cinema-red-500 text-white shadow-cinema"
                      : "text-cinema-neutral-600 hover:text-cinema-red-500 hover:bg-cinema-neutral-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
