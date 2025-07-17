"use client"

import { useEffect } from "react"
import { CheckCircle, Copy, Share2, X, Sparkles } from "lucide-react"

export default function CopySuccessModal({
  isOpen,
  onClose,
  title = "¡Enlace Copiado!",
  message = "El enlace se ha copiado al portapapeles exitosamente.",
  type = "copy", // "copy" | "share"
}) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "share":
        return <Share2 className="w-8 h-8 text-cinema-blue-800" />
      case "copy":
      default:
        return <Copy className="w-8 h-8 text-cinema-gold-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "share":
        return "bg-cinema-blue-100"
      case "copy":
      default:
        return "bg-cinema-gold-100"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-cinema-neutral-200 max-w-md w-full p-8 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-cinema-neutral-400 hover:text-cinema-red-500 hover:bg-cinema-red-50 rounded-xl transition-all duration-200"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div
              className={`w-20 h-20 ${getBackgroundColor()} rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse`}
            >
              {getIcon()}
            </div>

            {/* Success Check Overlay */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle className="w-5 h-5 text-white fill-current" />
            </div>

            {/* Sparkle Effects */}
            <div className="absolute top-0 left-0 w-4 h-4 text-cinema-gold-500 animate-ping">
              <Sparkles className="w-full h-full" />
            </div>
            <div
              className="absolute bottom-2 right-0 w-3 h-3 text-cinema-blue-500 animate-ping"
              style={{ animationDelay: "0.5s" }}
            >
              <Sparkles className="w-full h-full" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-3">{title}</h2>

          {/* Message */}
          <p className="text-cinema-neutral-600 font-medium mb-6 leading-relaxed">{message}</p>

          {/* Action Hint */}
          <div className="bg-cinema-neutral-50 border border-cinema-neutral-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-cinema-neutral-600">
              <div className="w-6 h-6 bg-cinema-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ctrl</span>
              </div>
              <span className="text-sm font-medium">+</span>
              <div className="w-6 h-6 bg-cinema-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <span className="text-sm font-medium ml-2">para pegar en cualquier lugar</span>
            </div>
          </div>

          {/* Auto-close indicator */}
          <div className="flex items-center justify-center gap-2 text-cinema-neutral-500">
            <div className="w-2 h-2 bg-cinema-red-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium">Se cerrará automáticamente</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 rounded-3xl bg-cinema-gradient opacity-5 pointer-events-none"></div>
      </div>
    </div>
  )
}
