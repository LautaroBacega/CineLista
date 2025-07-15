"use client"

import { Link } from "react-router-dom"
import { X, Lock, UserPlus, LogIn } from "lucide-react"

export default function AuthRequiredModal({ isOpen, onClose, movieTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Inicia Sesión Requerida</h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Para agregar <span className="font-semibold">"{movieTitle}"</span> a tus listas, necesitas tener una cuenta.
          </p>

          <div className="space-y-3">
            <Link
              to="/sign-in"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              <LogIn size={18} />
              Iniciar Sesión
            </Link>

            <Link
              to="/sign-up"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserPlus size={18} />
              Crear Cuenta
            </Link>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">¡Es gratis y solo toma unos segundos!</p>
        </div>
      </div>
    </div>
  )
}
