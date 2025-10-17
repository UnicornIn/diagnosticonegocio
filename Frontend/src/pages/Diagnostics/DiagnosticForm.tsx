"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../types/config"
import { empresarialQuestions } from "../../types/empresarial-questions"

// Función de validación de email más estricta
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  return emailRegex.test(email)
}

export default function DiagnosticForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<any>({
    nombre: "",
    whatsapp: "",
    correo: "",
    notas: "",
  })
  const [currentStep, setCurrentStep] = useState(-1)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[key]) {
      setErrors(prev => ({...prev, [key]: ""}))
    }
  }

  const validatePersonalData = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre completo es obligatorio"
    }
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "El WhatsApp es obligatorio"
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = "Ingresa un número de WhatsApp válido con al menos 10 dígitos"
    }
    
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio"
    } else if (!isValidEmail(formData.correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido (ejemplo: nombre@dominio.com)"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === -1) {
      // Validar datos personales antes de continuar
      if (!validatePersonalData()) {
        return
      }
    }
    
    if (currentStep < empresarialQuestions.length - 1) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > -1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    // Validar que todas las preguntas estén respondidas
    const unansweredQuestions = empresarialQuestions.filter(q => !formData[q.key])
    if (unansweredQuestions.length > 0) {
      alert("Por favor responde todas las preguntas antes de generar el diagnóstico")
      return
    }

    // Validar datos personales nuevamente antes de enviar
    if (!validatePersonalData()) {
      alert("Por favor corrige los errores en los datos personales antes de enviar")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/diagnostics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        navigate(`/diagnostic-result/${data.id}`)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Error creando diagnóstico")
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Hubo un error al guardar el diagnóstico")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVolverInicio = () => {
    setShowConfirmModal(true)
  }

  const confirmSalir = () => {
    navigate("/")
  }

  const cancelarSalir = () => {
    setShowConfirmModal(false)
  }

  const progress = ((currentStep + 1) / (empresarialQuestions.length)) * 100
  const currentQuestion = currentStep >= 0 ? empresarialQuestions[currentStep] : null

  // Función para verificar si se puede avanzar
  const canProceed = () => {
    if (currentStep === -1) {
      return formData.nombre.trim() && 
             formData.whatsapp.trim() && 
             formData.correo.trim() &&
             isValidEmail(formData.correo) &&
             !errors.nombre &&
             !errors.whatsapp &&
             !errors.correo
    }
    return formData[currentQuestion?.key || ""]
  }

  // Función para obtener el color del nivel
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico": return "text-green-400"
      case "Medio": return "text-yellow-400"
      case "Avanzado": return "text-red-400"
      default: return "text-zinc-400"
    }
  }

  // Función para obtener el color de fondo del nivel
  const getLevelBgColor = (level: string) => {
    switch (level) {
      case "Básico": return "bg-green-900/30 border-green-500"
      case "Medio": return "bg-yellow-900/30 border-yellow-500"
      case "Avanzado": return "bg-red-900/30 border-red-500"
      default: return "bg-zinc-800 border-zinc-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Diagnóstico Empresarial
          </h1>
          <p className="text-zinc-400">
            Evalúa la salud de tu negocio en 7 áreas clave
          </p>

          {/* Botón Volver al Inicio */}
          <Button
            onClick={handleVolverInicio}
            variant="outline"
            className="mt-4 border-zinc-600 text-white bg-zinc-900 hover:bg-[#F198C0] hover:text-white active:bg-[#F198C0] active:text-white transition-colors"
          >
            ← Volver al Inicio
          </Button>
        </div>

        <Card className="w-full bg-zinc-900 border border-zinc-700">
          <CardHeader className="border-b border-zinc-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                {currentStep === -1 ? "Datos Personales" : `Pregunta ${currentStep + 1} de ${empresarialQuestions.length}`}
              </CardTitle>
              <span className="text-sm text-zinc-400">
                {Math.round(progress)}% completado
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#F198C0"
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6 mt-6 p-6">
            {/* Datos personales */}
            {currentStep === -1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-zinc-300 text-sm font-medium mb-2 block">
                    Nombre completo *
                  </Label>
                  <input
                    type="text"
                    className={`w-full bg-zinc-800 border text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:border-[#F198C0] transition-colors ${
                      errors.nombre ? "border-red-500 focus:ring-red-500" : "border-zinc-600 focus:ring-[#F198C0]"
                    }`}
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                  {errors.nombre && (
                    <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label className="text-zinc-300 text-sm font-medium mb-2 block">
                    WhatsApp * <span className="text-zinc-400 text-xs">(incluye el prefijo)</span>
                  </Label>
                  <input
                    type="tel"
                    className={`w-full bg-zinc-800 border text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:border-[#F198C0] transition-colors ${
                      errors.whatsapp ? "border-red-500 focus:ring-red-500" : "border-zinc-600 focus:ring-[#F198C0]"
                    }`}
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    placeholder="Ej: +57 3001234567"
                    required
                  />
                  {errors.whatsapp && (
                    <p className="text-red-400 text-sm mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                <div>
                  <Label className="text-zinc-300 text-sm font-medium mb-2 block">
                    Correo electrónico *
                  </Label>
                  <input
                    type="email"
                    className={`w-full bg-zinc-800 border text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:border-[#F198C0] transition-colors ${
                      errors.correo ? "border-red-500 focus:ring-red-500" : "border-zinc-600 focus:ring-[#F198C0]"
                    }`}
                    value={formData.correo}
                    onChange={(e) => handleChange("correo", e.target.value)}
                    onBlur={() => {
                      if (formData.correo && !isValidEmail(formData.correo)) {
                        setErrors(prev => ({...prev, correo: "Ingresa un correo electrónico válido (ejemplo: nombre@dominio.com)"}))
                      }
                    }}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                  {errors.correo && (
                    <p className="text-red-400 text-sm mt-1">{errors.correo}</p>
                  )}
                  {!errors.correo && formData.correo && !isValidEmail(formData.correo) && (
                    <p className="text-yellow-400 text-sm mt-1">Verifica que el correo sea válido</p>
                  )}
                </div>

                <div>
                  <Label className="text-zinc-300 text-sm font-medium mb-2 block">
                    Notas adicionales (opcional)
                  </Label>
                  <textarea
                    className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F198C0] focus:border-[#F198C0] transition-colors resize-none"
                    value={formData.notas}
                    onChange={(e) => handleChange("notas", e.target.value)}
                    placeholder="Alguna observación adicional sobre tu negocio..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Preguntas Empresariales - MEJORADO con sección y nivel */}
            {currentStep >= 0 && currentQuestion && (
              <div className="space-y-6">
                {/* Encabezado de sección y nivel */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {currentQuestion.section}
                      </h2>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelBgColor(currentQuestion.level)} ${getLevelColor(currentQuestion.level)}`}>
                      Nivel {currentQuestion.level}
                    </div>
                  </div>
                  
                  {/* Separador visual */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
                </div>

                {/* Pregunta */}
                <div>
                  <Label className="text-white text-lg font-semibold mb-3 block leading-relaxed">
                    {currentQuestion.question}
                  </Label>
                </div>

                {/* Opciones de respuesta */}
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options?.map((option) => (
                    <Button
                      key={option}
                      variant={formData[currentQuestion.key] === option ? "default" : "outline"}
                      onClick={() => handleChange(currentQuestion.key, option)}
                      className={`h-14 text-base font-medium transition-all ${
                        formData[currentQuestion.key] === option
                          ? "text-white border-transparent"
                          : "bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      }`}
                      style={formData[currentQuestion.key] === option ? {
                        backgroundColor: "#F198C0"
                      } : {}}
                    >
                      {option}
                    </Button>
                  ))}
                </div>


                {/* Información del nivel */}

              </div>
            )}

            {/* Navegación */}
            <div className="flex justify-between pt-6 border-t border-zinc-700">
              <Button
                onClick={handlePrev}
                disabled={currentStep === -1}
                className={`
                border border-zinc-600 text-white bg-zinc-900
                hover:bg-[#F198C0] hover:text-white
                active:bg-[#F198C0] active:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-300
              `}
              >
                ← Anterior
              </Button>

              {currentStep < empresarialQuestions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#F198C0" }}
                >
                  {currentStep === -1 ? "Comenzar Diagnóstico" : "Siguiente →"}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData[currentQuestion?.key || ""] || isSubmitting}
                  className={`
                  px-8 flex items-center gap-2 border border-zinc-600 
                  text-white bg-zinc-900 
                  hover:bg-[#F198C0] hover:text-white
                  active:bg-[#F198C0] active:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-300
                `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar Diagnóstico"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                ¿Estás seguro de que quieres salir?
              </h3>
              <p className="text-zinc-300 mb-6">
                Estás en medio de un diagnóstico. Si sales ahora, perderás todo el progreso.
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={cancelarSalir}
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white px-6"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmSalir}
                  className="text-white px-6"
                  style={{ backgroundColor: "#F198C0" }}
                >
                  Sí, salir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}