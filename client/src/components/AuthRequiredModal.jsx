"use client"

import { Link } from "react-router-dom"
import { X, Lock, UserPlus, LogIn, Film, Star } from "lucide-react"

export default function AuthRequiredModal({ isOpen, onClose, movieTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-cinema-neutral-200 max-w-sm w-full p-6 relative animate-scale-in">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10 rounded-3xl"></div>

        {/* Close Button - Rehecho desde cero */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-cinema-red-500 hover:bg-cinema-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-20 group"
          aria-label="Cerrar modal"
        >
          <X size={18} className="group-hover:scale-110 transition-transform duration-200" />
        </button>

        <div className="relative z-10 text-center">
          {/* Icon Section */}
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto shadow-cinema-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-display font-bold text-cinema-neutral-800 mb-3">¡Iniciá Sesión! 🎬</h2>

          {/* Message */}
          <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Film className="w-4 h-4 text-cinema-red-500" />
              <span className="font-semibold text-cinema-neutral-700 text-sm">Película Seleccionada</span>
            </div>
            <p className="text-cinema-neutral-600 text-sm leading-relaxed">
              Para agregar <span className="font-bold text-cinema-red-600">"{movieTitle}"</span> a tus listas, necesitás
              una cuenta.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-4">
            <Link
              to="/sign-in"
              onClick={onClose}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              <LogIn size={16} />
              Iniciar Sesión
            </Link>

            <Link
              to="/sign-up"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-cinema-neutral-100 hover:bg-cinema-neutral-200 text-cinema-neutral-700 hover:text-cinema-neutral-800 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 border-2 border-cinema-neutral-200 hover:border-cinema-neutral-300 text-sm"
            >
              <UserPlus size={16} />
              Crear Cuenta Gratis
            </Link>
          </div>

          {/* Footer Message */}
          <div className="bg-cinema-gold-50 border border-cinema-gold-200 rounded-xl p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-3 h-3 text-cinema-gold-600" />
              <span className="text-cinema-gold-800 font-semibold text-xs">¡Completamente gratis!</span>
            </div>
            <p className="text-xs text-cinema-gold-700">Únete a miles de cinéfilos en CineLista</p>
          </div>
        </div>

        {/* Decorative Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-cinema-gradient opacity-5 pointer-events-none"></div>
      </div>
    </div>
  )
}
