"use client"

import { X, AlertTriangle, CheckCircle, Trash2, LogOut, Save } from "lucide-react"

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "default", // "default", "danger", "success"
  loading = false,
}) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-8 w-8 text-red-600" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case "logout":
        return <LogOut className="h-8 w-8 text-orange-600" />
      case "delete":
        return <Trash2 className="h-8 w-8 text-red-600" />
      case "save":
        return <Save className="h-8 w-8 text-blue-600" />
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-600" />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "success":
      case "save":
        return "bg-blue-600 hover:bg-blue-700 text-white"
      case "logout":
        return "bg-orange-600 hover:bg-orange-700 text-white"
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white"
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "danger":
      case "delete":
        return "bg-red-100"
      case "success":
      case "save":
        return "bg-blue-100"
      case "logout":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${getBackgroundColor()} rounded-full mb-4`}
          >
            {getIcon()}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
