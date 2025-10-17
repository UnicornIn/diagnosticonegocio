"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { API_BASE_URL } from "../../types/config"

interface Diagnostico {
  id: string
  nombre: string
  correo: string
  whatsapp: string
  notas?: string
  resultado_agente?: string 
  // Campos empresariales
  vision_p1?: string
  vision_p2?: string
  vision_p3?: string
  vision_p4?: string
  vision_p5?: string
  vision_p6?: string
  vision_p7?: string
  vision_p8?: string
  vision_p9?: string
  vision_p10?: string
  finanzas_p1?: string
  finanzas_p2?: string
  finanzas_p3?: string
  finanzas_p4?: string
  finanzas_p5?: string
  finanzas_p6?: string
  finanzas_p7?: string
  finanzas_p8?: string
  finanzas_p9?: string
  finanzas_p10?: string
  finanzas_p11?: string
  finanzas_p12?: string
  operaciones_p1?: string
  operaciones_p2?: string
  operaciones_p3?: string
  operaciones_p4?: string
  operaciones_p5?: string
  operaciones_p6?: string
  operaciones_p7?: string
  operaciones_p8?: string
  operaciones_p9?: string
  operaciones_p10?: string
  operaciones_p11?: string
  operaciones_p12?: string
  marketing_p1?: string
  marketing_p2?: string
  marketing_p3?: string
  marketing_p4?: string
  marketing_p5?: string
  marketing_p6?: string
  marketing_p7?: string
  marketing_p8?: string
  marketing_p9?: string
  marketing_p10?: string
  marketing_p11?: string
  marketing_p12?: string
  talento_p1?: string
  talento_p2?: string
  talento_p3?: string
  talento_p4?: string
  talento_p5?: string
  talento_p6?: string
  talento_p7?: string
  talenrto_p8?: string
  talento_p9?: string
  talento_p10?: string
  talento_p11?: string
  indicadores_p1?: string
  indicadores_p2?: string
  indicadores_p3?: string
  indicadores_p4?: string
  indicadores_p5?: string
  indicadores_p6?: string
  indicadores_p7?: string
  indicadores_p8?: string
  indicadores_p9?: string
  mentalidad_p1?: string
  mentalidad_p2?: string
  mentalidad_p3?: string
  mentalidad_p4?: string
  mentalidad_p5?: string
  mentalidad_p6?: string
  mentalidad_p7?: string
  mentalidad_p8?: string
  mentalidad_p9?: string
  mentalidad_p10?: string
}

// Nuevas interfaces para el formato empresarial
interface PuntuacionArea {
  puntuacion: number
  estado: "Crítico" | "En observación" | "Saludable" | "Excelente"
  analisis: string
}

interface PlanAccion {
  area: string
  diagnostico_especifico: string
  acciones_inmediatas: string[]
  plazo_revision: string
  resultado_esperado: string
}

interface ResultadoAgenteEmpresarial {
  resumen_ejecutivo: string
  mapa_salud_empresarial: {
    vision: PuntuacionArea
    finanzas: PuntuacionArea
    operaciones: PuntuacionArea
    marketing: PuntuacionArea
    talento: PuntuacionArea
    indicadores: PuntuacionArea
    mentalidad: PuntuacionArea
  }
  analisis_detallado: {
    patrones_detectados: string[]
    riesgos_principales: string[]
    oportunidades_inmediatas: string[]
  }
  plan_accion_prioritario: PlanAccion[]
  seguimiento_recomendado?: {
    proxima_revision: string
    metricas_seguimiento: string[]
    alertas_tempranas: string[]
  }
}

export default function DiagnosticResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<Diagnostico | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resultadoEmpresarial, setResultadoEmpresarial] = useState<ResultadoAgenteEmpresarial | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiagnostic = async () => {
      if (!id) {
        setError("No se proporcionó ID de diagnóstico")
        setIsLoading(false)
        return
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/diagnostics/${id}`)
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)

        if (result.resultado_agente) {
          const resultadoParseado = parsearResultadoAgente(result.resultado_agente)
          setResultadoEmpresarial(resultadoParseado)
        }
      } catch (err) {
        console.error("Error cargando diagnóstico:", err)
        setError(err instanceof Error ? err.message : "Error al cargar el diagnóstico")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiagnostic()
  }, [id])

  const parsearResultadoAgente = (texto: string): ResultadoAgenteEmpresarial | null => {
    try {
      const textoLimpio = texto.trim()
      const resultadoJSON: ResultadoAgenteEmpresarial = JSON.parse(textoLimpio)
      return resultadoJSON
    } catch (error) {
      console.log("No se pudo parsear el resultado como JSON empresarial:", error)
      return null
    }
  }

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case "Excelente": return "text-green-400"
      case "Saludable": return "text-blue-400"
      case "En observación": return "text-yellow-400"
      case "Crítico": return "text-red-400"
      default: return "text-zinc-400"
    }
  }

  const getEstadoBgColor = (estado: string): string => {
    switch (estado) {
      case "Excelente": return "bg-green-900/30 border-green-500"
      case "Saludable": return "bg-blue-900/30 border-blue-500"
      case "En observación": return "bg-yellow-900/30 border-yellow-500"
      case "Crítico": return "bg-red-900/30 border-red-500"
      default: return "bg-zinc-800 border-zinc-600"
    }
  }

  const handleVolverInicio = () => {
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#F198C0" }}
          ></div>
          <p className="text-white text-lg">Cargando diagnóstico...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <p className="text-white text-lg mb-4">
            {error || "No se pudo cargar el diagnóstico"}
          </p>
          <Button
            onClick={handleVolverInicio}
            className="text-white px-6 py-2"
            style={{ backgroundColor: "#F198C0" }}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Diagnóstico Empresarial
          </h1>
          <p className="text-zinc-400 text-lg">
            Resultados personalizados para {data.nombre}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Datos del cliente */}
          <Card className="bg-zinc-900 border border-zinc-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-xl">
                Información del Emprendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-600">
                  <p className="text-zinc-300 font-medium mb-1">Nombre</p>
                  <p className="text-white font-semibold">{data.nombre}</p>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-600">
                  <p className="text-zinc-300 font-medium mb-1">Email</p>
                  <p className="text-white font-semibold">{data.correo}</p>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-600">
                  <p className="text-zinc-300 font-medium mb-1">WhatsApp</p>
                  <p className="text-white font-semibold">{data.whatsapp}</p>
                </div>
              </div>
              {data.notas && (
                <div className="mt-4 bg-zinc-800 p-3 rounded-lg border border-zinc-600">
                  <p className="text-zinc-300 font-medium mb-1">Notas adicionales</p>
                  <p className="text-white">{data.notas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultado del Agente IA - NUEVO FORMATO EMPRESARIAL */}
          {resultadoEmpresarial ? (
            <>
              {/* Resumen Ejecutivo */}
              <Card className="bg-zinc-900 border border-zinc-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-xl" style={{ color: "#F198C0" }}>
                    Resumen Ejecutivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {resultadoEmpresarial.resumen_ejecutivo}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mapa de Salud Empresarial */}
              <Card className="bg-zinc-900 border border-zinc-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-xl" style={{ color: "#F198C0" }}>
                    Mapa de Salud Empresarial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(resultadoEmpresarial.mapa_salud_empresarial).map(([area, datos]) => (
                      <div 
                        key={area}
                        className={`p-4 rounded-lg border ${getEstadoBgColor(datos.estado)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold capitalize">
                            {area === "talento" ? "Talento Humano" : area}
                          </h3>
                          <span className={`text-sm font-bold ${getEstadoColor(datos.estado)}`}>
                            {datos.estado}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="text-2xl font-bold text-white mr-2">
                            {datos.puntuacion.toFixed(1)}
                          </div>
                          <div className="text-zinc-400 text-sm">/10</div>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {datos.analisis}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Análisis Detallado */}
              <Card className="bg-zinc-900 border border-zinc-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-xl" style={{ color: "#F198C0" }}>
                    Análisis Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Patrones Detectados</h4>
                      <ul className="space-y-2">
                        {resultadoEmpresarial.analisis_detallado.patrones_detectados.map((patron, index) => (
                          <li key={index} className="text-zinc-300 text-sm flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            {patron}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Riesgos Principales</h4>
                      <ul className="space-y-2">
                        {resultadoEmpresarial.analisis_detallado.riesgos_principales.map((riesgo, index) => (
                          <li key={index} className="text-zinc-300 text-sm flex items-start">
                            <span className="text-red-400 mr-2">⚠</span>
                            {riesgo}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Oportunidades</h4>
                      <ul className="space-y-2">
                        {resultadoEmpresarial.analisis_detallado.oportunidades_inmediatas.map((oportunidad, index) => (
                          <li key={index} className="text-zinc-300 text-sm flex items-start">
                            <span className="text-green-400 mr-2">💡</span>
                            {oportunidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan de Acción Prioritario */}
              <Card className="bg-zinc-900 border border-zinc-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-xl" style={{ color: "#F198C0" }}>
                    Plan de Acción Prioritario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {resultadoEmpresarial.plan_accion_prioritario.map((plan, index) => (
                      <div key={index} className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-white font-semibold text-lg">{plan.area}</h3>
                          <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
                            Revisión: {plan.plazo_revision}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-zinc-300 font-medium mb-2">Diagnóstico:</h4>
                          <p className="text-white text-sm leading-relaxed">{plan.diagnostico_especifico}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-zinc-300 font-medium mb-2">Acciones Inmediatas:</h4>
                          <ul className="space-y-2">
                            {plan.acciones_inmediatas.map((accion, accionIndex) => (
                              <li key={accionIndex} className="text-white text-sm flex items-start">
                                <span className="text-pink-400 mr-2">▶</span>
                                {accion}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-zinc-300 font-medium mb-2">Resultado Esperado:</h4>
                          <p className="text-white text-sm leading-relaxed">{plan.resultado_esperado}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : data.resultado_agente ? (
            // Fallback para formato antiguo
            <Card className="bg-zinc-900 border border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-xl">
                  Recomendaciones del Consultor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4 text-white whitespace-pre-wrap text-sm">
                  {data.resultado_agente}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900 border border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-xl">
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4 text-white text-sm text-center">
                  No hay recomendaciones disponibles para este diagnóstico.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-zinc-700 space-y-4">
          <Button
            onClick={handleVolverInicio}
            className="text-white px-8 py-3 transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: "#F198C0" }}
          >
            ← Volver al inicio
          </Button>
          <p className="text-zinc-400 text-sm">
            Gracias por utilizar el Diagnóstico Empresarial
          </p>
        </div>
      </div>
    </div>
  )
}