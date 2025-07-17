import { Film } from "lucide-react"

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-cinema-neutral-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-cinema-red-500 border-r-cinema-gold-500 rounded-full animate-spin"></div>
        </div>

        {/* Inner film icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-cinema-gradient rounded-full flex items-center justify-center shadow-cinema animate-pulse">
            <Film className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-cinema-neutral-600 font-semibold text-lg">Cargando películas...</p>
        <p className="text-cinema-neutral-500 text-sm mt-1">Preparando tu experiencia cinematográfica</p>
      </div>
    </div>
  )
}

export default Spinner
