"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserPlus, Mail, Lock, User, Film, Eye, EyeOff, CheckCircle } from "lucide-react"
import OAuth from "../components/OAuth"

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(false)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(true)
        return
      }
      navigate("/sign-in")
    } catch (error) {
      setLoading(false)
      setError(true)
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
          <h1 className="text-4xl font-display font-bold text-cinema-neutral-800 mb-3">¡Únete a CineLista! 🍿</h1>
          <p className="text-cinema-neutral-600 font-medium text-lg">
            Creá tu cuenta y comenzá tu aventura cinematográfica
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <User size={16} className="text-cinema-gold-600" />
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  id="username"
                  className="input-primary pl-12"
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cinema-neutral-400" />
                </div>
              </div>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  id="password"
                  className="input-primary pl-12 pr-12"
                  onChange={handleChange}
                  required
                  minLength="6"
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
              <p className="text-xs text-cinema-neutral-500">Tu contraseña debe tener al menos 6 caracteres</p>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-2xl p-4">
              <p className="text-xs text-cinema-neutral-600 leading-relaxed">
                Al crear una cuenta, aceptás nuestros{" "}
                <span className="text-cinema-red-500 font-semibold">Términos de Servicio</span> y{" "}
                <span className="text-cinema-red-500 font-semibold">Política de Privacidad</span>.
              </p>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando cuenta...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Crear Mi Cuenta
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cinema-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-cinema-neutral-500 font-medium">O regístrate con</span>
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
                <p className="text-red-800 font-semibold text-sm">Error al crear cuenta</p>
                <p className="text-red-700 text-sm">Algo salió mal. Por favor intentá de nuevo.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-cinema-neutral-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/sign-in"
              className="text-cinema-red-500 hover:text-cinema-red-600 font-bold transition-colors duration-200"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-cinema-gradient rounded-2xl p-6 text-white">
          <h3 className="font-display font-bold text-lg mb-4 text-center">¿Qué obtenés con tu cuenta?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium">Creá listas personalizadas de películas</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium">Compartí tus listas con amigos</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium">Recomendaciones personalizadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
