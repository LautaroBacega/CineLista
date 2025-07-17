"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Film, Send } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      console.log("🔄 Enviando solicitud de reset para:", email)

      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", response.headers)

      const data = await response.json()
      console.log("📦 Response data:", data)

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
      } else {
        setError(data.message || "Ocurrió un error. Por favor intentá de nuevo.")
      }
    } catch (error) {
      console.error("❌ Error completo:", error)
      setError("Error de conexión. Por favor intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 text-center animate-scale-in">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Success Content */}
            <h1 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">¡Email Enviado! 📧</h1>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <p className="text-green-800 font-medium">{message}</p>
            </div>

            <p className="text-cinema-neutral-600 mb-8 leading-relaxed">
              Revisá tu bandeja de entrada y seguí las instrucciones para restablecer tu contraseña.
            </p>

            {/* Back Button */}
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 bg-cinema-gradient text-white font-semibold px-6 py-3 rounded-xl hover:shadow-cinema-lg transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-cinema">
            <Film className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-display font-bold text-cinema-neutral-800 mb-3">¿Olvidaste tu contraseña?</h1>
          <p className="text-cinema-neutral-600 font-medium">No te preocupes, te ayudamos a recuperarla.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <Mail size={16} className="text-cinema-red-500" />
                Dirección de Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input-primary pl-12"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cinema-neutral-400" />
                </div>
              </div>
              <p className="text-xs text-cinema-neutral-500 flex items-center gap-1">
                <Send size={12} />
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send size={18} />
                  Enviar Enlace de Restablecimiento
                </div>
              )}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-8 text-center">
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 text-cinema-neutral-600 hover:text-cinema-red-500 font-medium transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-down">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold text-sm">Error al enviar</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-cinema-neutral-500 text-sm">
            ¿Recordaste tu contraseña?{" "}
            <Link to="/sign-in" className="text-cinema-red-500 hover:text-cinema-red-600 font-semibold">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
