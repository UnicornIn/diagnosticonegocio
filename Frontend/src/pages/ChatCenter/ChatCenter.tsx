import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { ChatArea } from "../../components/ChatArea"
import { Menu, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ChatCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChat, ] = useState("")
  const navigate = useNavigate()

  const handleGoToDiagnostic = () => {
    navigate("/diagnostico")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-900 to-black">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 50% width on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-1/2 sm:w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0 lg:w-72
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header para móvil y escritorio */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700 bg-zinc-900">
          <div className="flex items-center gap-3">
            {/* Botón menú solo en móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-bold text-white text-xl">RIZOTIPO Online</h1>
          </div>

          {/* Botón para ir al diagnóstico - Visible en móvil y escritorio */}
          <button
            onClick={handleGoToDiagnostic}
            className="text-white p-3 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
              backgroundColor: "#F198C0"
            }}
            title="Nuevo diagnóstico"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Chat area */}
        <ChatArea activeChat={activeChat} />
      </div>
    </div>
  )
}