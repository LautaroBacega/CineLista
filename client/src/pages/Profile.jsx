"use client"

import { useUser } from "../hooks/useUser"
import { useRef, useState, useEffect } from "react"
import {
  Camera,
  User,
  Mail,
  Lock,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle,
  Film,
  Settings,
  Shield,
} from "lucide-react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import ConfirmationModal from "../components/ConfirmationModal"

export default function Profile() {
  const { currentUser, updateUser, deleteUser, signOut, loading } = useUser()
  const fileRef = useRef(null)
  const [image, setImage] = useState(undefined)
  const [imagePercent, setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImagePercent(Math.round(progress))
      },
      (error) => {
        setImageError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL }),
        )
      },
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowUpdateModal(true)
  }

  const confirmUpdate = async () => {
    try {
      setError(null)
      setUpdateSuccess(false)
      await updateUser(currentUser._id, formData)
      setUpdateSuccess(true)
      setShowUpdateModal(false)
    } catch (error) {
      setError(error.message)
      setShowUpdateModal(false)
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setError(null)
      await deleteUser(currentUser._id)
      setShowDeleteModal(false)
    } catch (error) {
      setError(error.message)
      setShowDeleteModal(false)
    }
  }

  const handleSignOut = () => {
    setShowSignOutModal(true)
  }

  const confirmSignOut = async () => {
    await signOut()
    setShowSignOutModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinema-neutral-50 via-white to-cinema-neutral-100 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-cinema-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-cinema">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-cinema-neutral-800 mb-3">Mi Perfil</h1>
          <p className="text-cinema-neutral-600 font-medium text-lg">
            Gestioná la información de tu cuenta y tus preferencias cinematográficas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-8 text-center">
              <h2 className="text-xl font-display font-bold text-cinema-neutral-800 mb-6 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5 text-cinema-red-500" />
                Foto de Perfil
              </h2>

              {/* Profile Picture */}
              <div className="relative group mb-6">
                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={formData.profilePicture || currentUser.profilePicture}
                    alt="profile"
                    className="w-full h-full rounded-2xl object-cover ring-4 ring-cinema-neutral-200 group-hover:ring-cinema-red-500 transition-all duration-300 cursor-pointer shadow-lg"
                    onClick={() => fileRef.current.click()}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => fileRef.current.click()}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cinema-gold-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Film className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Upload Status */}
              <div className="mb-6">
                {imageError ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-red-800 font-semibold text-sm">Error al cargar imagen</p>
                      <p className="text-red-600 text-xs">Máximo 2MB permitido</p>
                    </div>
                  </div>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <div className="bg-cinema-blue-50 border border-cinema-blue-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-5 h-5 border-2 border-cinema-blue-800 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-cinema-blue-800 font-semibold text-sm">Cargando imagen...</span>
                    </div>
                    <div className="w-full bg-cinema-blue-200 rounded-full h-2">
                      <div
                        className="bg-cinema-blue-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${imagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-cinema-blue-700 text-xs mt-1">{imagePercent}% completado</p>
                  </div>
                ) : imagePercent === 100 ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                      <p className="text-green-800 font-semibold text-sm">¡Imagen subida!</p>
                      <p className="text-green-600 text-xs">Lista para guardar cambios</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-cinema-neutral-500 text-sm">
                    Hacé click en la imagen para cambiar tu foto de perfil
                  </p>
                )}
              </div>

              {/* User Info */}
              <div className="bg-cinema-neutral-50 rounded-2xl p-4">
                <h3 className="font-display font-bold text-cinema-neutral-800 mb-2">{currentUser.username}</h3>
                <p className="text-cinema-neutral-600 text-sm mb-3">{currentUser.email}</p>
                <div className="flex items-center justify-center gap-2 text-cinema-gold-600">
                  <Film className="w-4 h-4" />
                  <span className="text-xs font-semibold">Cinéfilo Activo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-cinema-neutral-200 p-8">
              <h2 className="text-2xl font-display font-bold text-cinema-neutral-800 mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-cinema-red-500" />
                Información Personal
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                    <User size={16} className="text-cinema-red-500" />
                    Nombre de Usuario
                  </label>
                  <input
                    defaultValue={currentUser.username}
                    type="text"
                    id="username"
                    placeholder="Tu nombre de usuario"
                    className="input-primary"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                    <Mail size={16} className="text-cinema-blue-800" />
                    Dirección de Email
                  </label>
                  <input
                    defaultValue={currentUser.email}
                    type="email"
                    id="email"
                    placeholder="tu@email.com"
                    className="input-primary"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-cinema-neutral-700 flex items-center gap-2">
                    <Lock size={16} className="text-cinema-gold-600" />
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Dejá en blanco para mantener la actual"
                    className="input-primary"
                    onChange={handleChange}
                  />
                  <p className="text-xs text-cinema-neutral-500 flex items-center gap-1">
                    <Shield size={12} />
                    Solo completá si querés cambiar tu contraseña
                  </p>
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Actualizando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={18} />
                      Actualizar Perfil
                    </div>
                  )}
                </button>
              </form>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-cinema-neutral-200">
                <h3 className="text-lg font-display font-bold text-cinema-neutral-800 mb-6">Acciones de Cuenta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-cinema-neutral-100 hover:bg-cinema-neutral-200 text-cinema-neutral-700 hover:text-cinema-neutral-800 rounded-xl font-semibold transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl font-semibold transition-all duration-200 border border-red-200"
                  >
                    <Trash2 size={18} />
                    Eliminar Cuenta
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-down">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold text-sm">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {updateSuccess && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-slide-down">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="text-green-800 font-semibold text-sm">¡Perfil actualizado!</p>
                    <p className="text-green-700 text-sm">Tus cambios se guardaron correctamente</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={confirmUpdate}
        title="Actualizar Perfil"
        message="¿Estás seguro de que querés actualizar tu información de perfil?"
        confirmText="Actualizar"
        cancelText="Cancelar"
        type="save"
        loading={loading}
      />

      <ConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={confirmSignOut}
        title="Cerrar Sesión"
        message="¿Estás seguro de que querés cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="logout"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Eliminar Cuenta"
        message="¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
        confirmText="Eliminar Cuenta"
        cancelText="Cancelar"
        type="delete"
        loading={loading}
      />
    </div>
  )
}
