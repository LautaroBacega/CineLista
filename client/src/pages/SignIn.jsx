"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn, Mail, Lock, Film, Eye, EyeOff } from "lucide-react"
import { useUser } from "../hooks/useUser"
import OAuth from "../components/OAuth"

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, loading } = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await signIn(formData)
      navigate("/")
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-cinema-gradient rounded-3xl flex items-center justify-center mx-auto shadow-cinema-lg">
              <Film className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-4xl font-display font-bold text-cinema-neutral-800 mb-3">¡Bienvenido de vuelta! 🎬</h1>
          <p className="text-cinema-neutral-600 font-medium text-lg">
            Iniciá sesión para continuar tu experiencia cinematográfica
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <Mail size={16} className="text-cinema-red-500" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  id="email"
                  className="input-primary pl-12"
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cinema-neutral-400" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <Lock size={16} className="text-cinema-blue-800" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  id="password"
                  className="input-primary pl-12 pr-12"
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cinema-neutral-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinema-neutral-400 hover:text-cinema-blue-800 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-cinema-red-500 hover:text-cinema-red-600 font-semibold transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Iniciar Sesión
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cinema-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-cinema-neutral-500 font-medium">O continúa con</span>
              </div>
            </div>

            {/* OAuth */}
            <OAuth />
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-down">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-red-800 font-semibold text-sm">Error al iniciar sesión</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-cinema-neutral-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/sign-up"
              className="text-cinema-red-500 hover:text-cinema-red-600 font-bold transition-colors duration-200"
            >
              Registrarme
            </Link>
          </p>
        </div>

        

      </div>
    </div>
  )
}
