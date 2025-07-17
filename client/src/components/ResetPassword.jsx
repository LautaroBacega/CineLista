"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Key } from "lucide-react"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Token de restablecimiento no encontrado")
        setCheckingToken(false)
        return
      }

      try {
        console.log("🔍 Verificando token:", token)

        const response = await fetch(`/api/auth/verify-reset-token/${token}`, {
          credentials: "include",
        })

        console.log("📡 Verification response status:", response.status)

        const data = await response.json()
        console.log("📦 Verification data:", data)

        if (response.ok) {
          setTokenValid(true)
        } else {
          setError(data.message || "Token inválido o expirado")
        }
      } catch (error) {
        console.error("❌ Error verificando token:", error)
        setError("Error verificando el token")
      } finally {
        setCheckingToken(false)
      }
    }

    verifyToken()
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      console.log("🔄 Restableciendo contraseña...")

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      console.log("📡 Reset response status:", response.status)

      const data = await response.json()
      console.log("📦 Reset data:", data)

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/sign-in")
        }, 3000)
      } else {
        setError(data.message || "Ocurrió un error. Por favor intentá de nuevo.")
      }
    } catch (error) {
      console.error("❌ Error resetting password:", error)
      setError("Error de conexión. Por favor intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="w-8 h-8 border-4 border-cinema-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cinema-neutral-600 font-medium">Verificando token de seguridad...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">Token Inválido</h1>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button onClick={() => navigate("/forgot-password")} className="btn-primary w-full">
              Solicitar Nuevo Enlace
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-4">
              ¡Contraseña Restablecida! 🎉
            </h1>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-cinema-neutral-600">
              <div className="w-2 h-2 bg-cinema-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">Redirigiendo al inicio de sesión...</p>
            </div>
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-cinema">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-cinema-neutral-800 mb-3">Nueva Contraseña</h1>
          <p className="text-cinema-neutral-600 font-medium">
            Ingresá tu nueva contraseña para completar el restablecimiento.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-cinema-neutral-200 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <Lock size={16} className="text-cinema-red-500" />
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="input-primary pr-12"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinema-neutral-400 hover:text-cinema-red-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                <Shield size={16} className="text-cinema-blue-800" />
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repetí tu nueva contraseña"
                  className="input-primary pr-12"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinema-neutral-400 hover:text-cinema-blue-800 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-cinema-neutral-700 mb-2">Requisitos de contraseña:</p>
              <ul className="text-xs text-cinema-neutral-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? "bg-green-500" : "bg-cinema-neutral-300"}`}
                  ></div>
                  Al menos 6 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${formData.password === formData.confirmPassword && formData.password ? "bg-green-500" : "bg-cinema-neutral-300"}`}
                  ></div>
                  Las contraseñas deben coincidir
                </li>
              </ul>
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
                  Restableciendo...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Key size={18} />
                  Restablecer Contraseña
                </div>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-down">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold text-sm">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
