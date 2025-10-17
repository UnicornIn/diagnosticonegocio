import { useState, useEffect } from "react"
import { X, FileText, Search, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../types/config"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface Diagnostic {
  id: string
  nombre: string
  whatsapp: string
  correo: string
  plasticidad: string
  permeabilidad: string
  densidad: string
  porosidad: string
  oleosidad: string
  grosor: string
  textura: string
  notas?: string
  created_at: string
  resultado_agente?: string
}

export default function Sidebar({ 
  isOpen, 
  onClose 
}: SidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])

  // Función para manejar token expirado
  const handleTokenExpired = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  // Función para verificar si la respuesta indica token expirado
  const checkTokenExpired = (response: Response) => {
    if (response.status === 401) {
      handleTokenExpired();
      return true;
    }
    return false;
  };

  // Función para obtener el token con verificación
  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      handleTokenExpired();
    }
    return token;
  };

  // Cargar diagnósticos al montar el componente
  useEffect(() => {
    loadDiagnostics()
  }, [])

  const loadDiagnostics = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/diagnostics/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const diagnosticsData = await response.json()
        setDiagnostics(diagnosticsData)
      } else {
        // Verificar si el token expiró
        if (checkTokenExpired(response)) {
          return;
        }
        console.error("Error loading diagnostics:", response.status)
      }
    } catch (error) {
      console.error("Error loading diagnostics:", error)
      // En caso de error de red, también verificamos si es por token expirado
      if (error instanceof Error && error.message.includes("401")) {
        handleTokenExpired();
      }
    }
  }

  const filteredDiagnostics = diagnostics.filter((diagnostic) =>
    diagnostic.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diagnostic.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diagnostic.whatsapp.includes(searchQuery)
  )

  const handleSelectDiagnostic = (diagnostic: Diagnostic) => {
    // Redirigir a la página de resultados del diagnóstico
    navigate(`/diagnostics/result/${diagnostic.id}`)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  // Formatear fecha de manera amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", { 
        day: "numeric", 
        month: "short",
        year: "numeric"
      })
    }
  }

  // Obtener resumen corto del diagnóstico para mostrar
  const getDiagnosticSummary = (diagnostic: Diagnostic) => {
    const characteristics = [
      diagnostic.textura,
      diagnostic.porosidad,
      diagnostic.oleosidad
    ].filter(Boolean)
    
    return characteristics.length > 0 ? characteristics.join(" • ") : "Sin características"
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity sm:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 left-0 z-40 h-full w-72 
          bg-zinc-900 border-r border-zinc-700 flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:static sm:translate-x-0 sm:z-auto
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-white">RIZOTIPO</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="sm:hidden text-white hover:bg-zinc-800 p-1.5 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar diagnósticos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 rounded-lg 
               focus:outline-none focus:ring-1 focus:ring-[#F198C0] focus:border-[#F198C0] transition-all duration-200"
            />
          </div>
        </div>

        {/* Diagnósticos */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Diagnósticos ({filteredDiagnostics.length})
            </h2>
          </div>

          {filteredDiagnostics.length > 0 ? (
            <div className="space-y-2">
              {filteredDiagnostics.map((diagnostic) => (
                <div
                  key={diagnostic.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-zinc-800 text-zinc-300`}
                  onClick={() => handleSelectDiagnostic(diagnostic)}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {diagnostic.nombre}
                    </p>
                    <p className="text-xs text-zinc-400 truncate mt-1">
                      {getDiagnosticSummary(diagnostic)}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {formatDate(diagnostic.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">
                {searchQuery ? "No se encontraron diagnósticos" : "No hay diagnósticos todavía"}
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                {!searchQuery && "Crea tu primer diagnóstico en la sección principal"}
              </p>
            </div>
          )}
        </div>

        {/* User */}
        <div className="p-4 border-t border-zinc-700">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full text-white flex items-center justify-center font-medium"
                style={{ backgroundColor: "#F198C0" }}
              >
                {user?.name?.substring(0, 2).toUpperCase() || "PR"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "Profesional"}</p>
                <p className="text-xs text-zinc-400 truncate">{user?.email || ""}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-zinc-300 hover:text-white hover:bg-zinc-700 p-2 rounded transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}