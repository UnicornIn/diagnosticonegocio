import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DiagnosticForm from "./pages/Diagnostics/DiagnosticForm"
import DiagnosticResult from "./pages/Diagnostics/DiagnosticResult"
import "./index.css"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal: formulario de diagnóstico */}
        <Route path="/" element={<DiagnosticForm />} />

        {/* Página de resultados */}
        <Route path="/diagnostics/result/:id" element={<DiagnosticResult />} />
      </Routes>
    </Router>
  )
}
