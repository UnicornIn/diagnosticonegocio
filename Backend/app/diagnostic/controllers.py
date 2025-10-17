import os
import json
from datetime import datetime
from fastapi import HTTPException
from dotenv import load_dotenv
from openai import AsyncOpenAI
from bson import ObjectId

from app.core.database import collection_diagnostics
from app.diagnostic.models import DiagnosticRequest, DiagnosticResponse
from app.diagnostic.prompts.diagnostic_prompt import BUSINESS_DIAGNOSTIC_PROMPT

# Configurar OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=OPENAI_API_KEY)


async def create_diagnostic_controller(diagnostic: DiagnosticRequest) -> DiagnosticResponse:
    """
    Crea un diagnóstico empresarial: guarda en MongoDB y genera el resultado con OpenAI
    """
    # Guardar datos iniciales - CORREGIDO para campos empresariales
    new_diag = {
        "nombre": diagnostic.nombre,
        "whatsapp": diagnostic.whatsapp,
        "correo": diagnostic.correo,
        # Campos de visión y propósito
        "vision_p1": diagnostic.vision_p1,
        "vision_p2": diagnostic.vision_p2,
        "vision_p3": diagnostic.vision_p3,
        "vision_p4": diagnostic.vision_p4,
        "vision_p5": diagnostic.vision_p5,
        "vision_p6": diagnostic.vision_p6,
        "vision_p7": diagnostic.vision_p7,
        "vision_p8": diagnostic.vision_p8,
        "vision_p9": diagnostic.vision_p9,
        "vision_p10": diagnostic.vision_p10,
        # Campos de finanzas
        "finanzas_p1": diagnostic.finanzas_p1,
        "finanzas_p2": diagnostic.finanzas_p2,
        "finanzas_p3": diagnostic.finanzas_p3,
        "finanzas_p4": diagnostic.finanzas_p4,
        "finanzas_p5": diagnostic.finanzas_p5,
        "finanzas_p6": diagnostic.finanzas_p6,
        "finanzas_p7": diagnostic.finanzas_p7,
        "finanzas_p8": diagnostic.finanzas_p8,
        "finanzas_p9": diagnostic.finanzas_p9,
        "finanzas_p10": diagnostic.finanzas_p10,
        "finanzas_p11": diagnostic.finanzas_p11,
        "finanzas_p12": diagnostic.finanzas_p12,
        # Campos de operaciones
        "operaciones_p1": diagnostic.operaciones_p1,
        "operaciones_p2": diagnostic.operaciones_p2,
        "operaciones_p3": diagnostic.operaciones_p3,
        "operaciones_p4": diagnostic.operaciones_p4,
        "operaciones_p5": diagnostic.operaciones_p5,
        "operaciones_p6": diagnostic.operaciones_p6,
        "operaciones_p7": diagnostic.operaciones_p7,
        "operaciones_p8": diagnostic.operaciones_p8,
        "operaciones_p9": diagnostic.operaciones_p9,
        "operaciones_p10": diagnostic.operaciones_p10,
        "operaciones_p11": diagnostic.operaciones_p11,
        "operaciones_p12": diagnostic.operaciones_p12,
        # Campos de marketing
        "marketing_p1": diagnostic.marketing_p1,
        "marketing_p2": diagnostic.marketing_p2,
        "marketing_p3": diagnostic.marketing_p3,
        "marketing_p4": diagnostic.marketing_p4,
        "marketing_p5": diagnostic.marketing_p5,
        "marketing_p6": diagnostic.marketing_p6,
        "marketing_p7": diagnostic.marketing_p7,
        "marketing_p8": diagnostic.marketing_p8,
        "marketing_p9": diagnostic.marketing_p9,
        "marketing_p10": diagnostic.marketing_p10,
        "marketing_p11": diagnostic.marketing_p11,
        "marketing_p12": diagnostic.marketing_p12,
        # Campos de talento humano
        "talento_p1": diagnostic.talento_p1,
        "talento_p2": diagnostic.talento_p2,
        "talento_p3": diagnostic.talento_p3,
        "talento_p4": diagnostic.talento_p4,
        "talento_p5": diagnostic.talento_p5,
        "talento_p6": diagnostic.talento_p6,
        "talento_p7": diagnostic.talento_p7,
        "talento_p8": diagnostic.talento_p8,
        "talento_p9": diagnostic.talento_p9,
        "talento_p10": diagnostic.talento_p10,
        "talento_p11": diagnostic.talento_p11,
        # Campos de indicadores
        "indicadores_p1": diagnostic.indicadores_p1,
        "indicadores_p2": diagnostic.indicadores_p2,
        "indicadores_p3": diagnostic.indicadores_p3,
        "indicadores_p4": diagnostic.indicadores_p4,
        "indicadores_p5": diagnostic.indicadores_p5,
        "indicadores_p6": diagnostic.indicadores_p6,
        "indicadores_p7": diagnostic.indicadores_p7,
        "indicadores_p8": diagnostic.indicadores_p8,
        "indicadores_p9": diagnostic.indicadores_p9,
        # Campos de mentalidad
        "mentalidad_p1": diagnostic.mentalidad_p1,
        "mentalidad_p2": diagnostic.mentalidad_p2,
        "mentalidad_p3": diagnostic.mentalidad_p3,
        "mentalidad_p4": diagnostic.mentalidad_p4,
        "mentalidad_p5": diagnostic.mentalidad_p5,
        "mentalidad_p6": diagnostic.mentalidad_p6,
        "mentalidad_p7": diagnostic.mentalidad_p7,
        "mentalidad_p8": diagnostic.mentalidad_p8,
        "mentalidad_p9": diagnostic.mentalidad_p9,
        "mentalidad_p10": diagnostic.mentalidad_p10,
        "notas": diagnostic.notas,
        "created_at": datetime.utcnow(),
    }

    result = await collection_diagnostics.insert_one(new_diag)

    # Construir mensaje para OpenAI - CORREGIDO para datos empresariales
    user_message = f"""
    DIAGNÓSTICO EMPRESARIAL - CLIENTE: {diagnostic.nombre}
    Contacto: {diagnostic.whatsapp} | {diagnostic.correo}

    🧭 VISIÓN Y PROPÓSITO:
    P1 (Visión escrita 3 años): {diagnostic.vision_p1}
    P2 (Propósito claro): {diagnostic.vision_p2}
    P3 (Visión en comunicación): {diagnostic.vision_p3}
    P4 (Equipo conoce visión): {diagnostic.vision_p4}
    P5 (Metas anuales): {diagnostic.vision_p5}
    P6 (Lema unificador): {diagnostic.vision_p6}
    P7 (Revisión anual): {diagnostic.vision_p7}
    P8 (Plan crecimiento): {diagnostic.vision_p8}
    P9 (Indicadores visión): {diagnostic.vision_p9}
    P10 (Propósito mercado): {diagnostic.vision_p10}

    💰 ESTRUCTURA FINANCIERA:
    P1 (Ventas promedio): {diagnostic.finanzas_p1}
    P2 (Costos fijos/variables): {diagnostic.finanzas_p2}
    P3 (Registro ingresos/egresos): {diagnostic.finanzas_p3}
    P4 (Ganancia mensual): {diagnostic.finanzas_p4}
    P5 (Punto equilibrio): {diagnostic.finanzas_p5}
    P6 (Separación personal/negocio): {diagnostic.finanzas_p6}
    P7 (Metas ventas): {diagnostic.finanzas_p7}
    P8 (Flujo caja proyectado): {diagnostic.finanzas_p8}
    P9 (Estrategias rentabilidad): {diagnostic.finanzas_p9}
    P10 (Análisis márgenes): {diagnostic.finanzas_p10}
    P11 (Control impuestos): {diagnostic.finanzas_p11}
    P12 (Reservas emergencia): {diagnostic.finanzas_p12}

    ⚙ OPERACIONES Y SERVICIO:
    P1 (Horarios fijos): {diagnostic.operaciones_p1}
    P2 (Registro servicios): {diagnostic.operaciones_p2}
    P3 (Control inventario): {diagnostic.operaciones_p3}
    P4 (Rutina apertura/cierre): {diagnostic.operaciones_p4}
    P5 (Protocolos servicio): {diagnostic.operaciones_p5}
    P6 (Capacitación personal): {diagnostic.operaciones_p6}
    P7 (Reuniones equipo): {diagnostic.operaciones_p7}
    P8 (Control tiempos): {diagnostic.operaciones_p8}
    P9 (Indicadores operativos): {diagnostic.operaciones_p9}
    P10 (Seguimiento satisfacción): {diagnostic.operaciones_p10}
    P11 (Prevención pérdidas): {diagnostic.operaciones_p11}
    P12 (Procesos documentados): {diagnostic.operaciones_p12}

    🌐 MARKETING Y PRESENCIA DIGITAL:
    P1 (Redes activas): {diagnostic.marketing_p1}
    P2 (Contenido semanal): {diagnostic.marketing_p2}
    P3 (Identidad visual): {diagnostic.marketing_p3}
    P4 (WhatsApp Business): {diagnostic.marketing_p4}
    P5 (Análisis métricas): {diagnostic.marketing_p5}
    P6 (Metas redes): {diagnostic.marketing_p6}
    P7 (Campañas pagadas): {diagnostic.marketing_p7}
    P8 (Testimonios): {diagnostic.marketing_p8}
    P9 (Embudos venta): {diagnostic.marketing_p9}
    P10 (Base datos): {diagnostic.marketing_p10}
    P11 (Web/reservas): {diagnostic.marketing_p11}
    P12 (Remarketing): {diagnostic.marketing_p12}

    👥 TALENTO HUMANO Y CULTURA:
    P1 (Roles definidos): {diagnostic.talento_p1}
    P2 (Salarios claros): {diagnostic.talento_p2}
    P3 (Reuniones equipo): {diagnostic.talento_p3}
    P4 (Procesos selección): {diagnostic.talento_p4}
    P5 (Contratos firmados): {diagnostic.talento_p5}
    P6 (Metas crecimiento): {diagnostic.talento_p6}
    P7 (Retroalimentación): {diagnostic.talento_p7}
    P8 (Indicadores desempeño): {diagnostic.talento_p8}
    P9 (Políticas conflictos): {diagnostic.talento_p9}
    P10 (Bienestar emocional): {diagnostic.talento_p10}
    P11 (Incentivos resultados): {diagnostic.talento_p11}

    📈 INDICADORES Y RESULTADOS:
    P1 (Registro ventas/gastos): {diagnostic.indicadores_p1}
    P2 (Clientes nuevos/repetidos): {diagnostic.indicadores_p2}
    P3 (Ticket promedio): {diagnostic.indicadores_p3}
    P4 (Tasa retención): {diagnostic.indicadores_p4}
    P5 (Satisfacción cliente): {diagnostic.indicadores_p5}
    P6 (Metas numéricas): {diagnostic.indicadores_p6}
    P7 (Análisis tendencias): {diagnostic.indicadores_p7}
    P8 (Dashboard visual): {diagnostic.indicadores_p8}
    P9 (Decisiones basadas datos): {diagnostic.indicadores_p9}

    🧠 MENTALIDAD EMPRESARIAL:
    P1 (Liderazgo): {diagnostic.mentalidad_p1}
    P2 (Formación): {diagnostic.mentalidad_p2}
    P3 (Control negocio): {diagnostic.mentalidad_p3}
    P4 (Mentores): {diagnostic.mentalidad_p4}
    P5 (Autoevaluación): {diagnostic.mentalidad_p5}
    P6 (Manejo estrés): {diagnostic.mentalidad_p6}
    P7 (Bienestar personal): {diagnostic.mentalidad_p7}
    P8 (Fortalezas/debilidades): {diagnostic.mentalidad_p8}
    P9 (Plan crecimiento): {diagnostic.mentalidad_p9}
    P10 (Toma decisiones): {diagnostic.mentalidad_p10}

    📝 NOTAS ADICIONALES: {diagnostic.notas or "Ninguna"}

    **IMPORTANTE:** Analiza estas respuestas y genera un diagnóstico empresarial completo en formato JSON según la estructura especificada.
    """

    try:
        # Enviar a OpenAI - CORREGIDO para usar prompt empresarial
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": BUSINESS_DIAGNOSTIC_PROMPT},
                {"role": "user", "content": user_message}
            ],
            max_tokens=2000,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        resultado_agente = response.choices[0].message.content
        
        # Validar que sea JSON válido
        try:
            json.loads(resultado_agente)
        except json.JSONDecodeError:
            # Si no es JSON válido, crear uno manualmente con los datos
            resultado_agente = generar_business_json_fallback(diagnostic)

        # Guardar respuesta en la DB
        await collection_diagnostics.update_one(
            {"_id": result.inserted_id},
            {"$set": {"resultado_agente": resultado_agente}}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar diagnóstico: {str(e)}")

    # Retornar respuesta
    return DiagnosticResponse(
        id=str(result.inserted_id),
        **diagnostic.dict(),
        created_at=new_diag["created_at"],
        resultado_agente=resultado_agente
    )


def generar_business_json_fallback(diagnostic: DiagnosticRequest) -> str:
    """
    Genera un JSON de fallback para diagnóstico empresarial
    """
    # Análisis básico basado en respuestas
    areas_fuertes = []
    areas_mejora = []
    
    # Evaluar visión
    vision_responses = [diagnostic.vision_p1, diagnostic.vision_p2, diagnostic.vision_p3, 
                       diagnostic.vision_p4, diagnostic.vision_p5, diagnostic.vision_p6,
                       diagnostic.vision_p7, diagnostic.vision_p8, diagnostic.vision_p9, diagnostic.vision_p10]
    
    siempre_count = sum(1 for resp in vision_responses if resp.lower() == "siempre")
    if siempre_count >= 6:
        areas_fuertes.append("Visión y propósito")
    elif siempre_count <= 3:
        areas_mejora.append("Visión y propósito")
    
    # Evaluar finanzas
    finanzas_responses = [diagnostic.finanzas_p1, diagnostic.finanzas_p2, diagnostic.finanzas_p3,
                         diagnostic.finanzas_p4, diagnostic.finanzas_p5, diagnostic.finanzas_p6,
                         diagnostic.finanzas_p7, diagnostic.finanzas_p8, diagnostic.finanzas_p9,
                         diagnostic.finanzas_p10, diagnostic.finanzas_p11, diagnostic.finanzas_p12]
    
    nunca_count = sum(1 for resp in finanzas_responses if resp.lower() == "nunca")
    if nunca_count >= 6:
        areas_mejora.append("Estructura financiera (necesita atención urgente)")
    elif nunca_count <= 2:
        areas_fuertes.append("Estructura financiera")

    json_resultado = {
        "resumen_ejecutivo": f"Diagnóstico empresarial para {diagnostic.nombre}. El negocio muestra áreas de fortaleza y oportunidades de mejora.",
        "puntuacion_areas": {
            "vision": {"puntuacion": siempre_count, "estado": "Saludable" if siempre_count >= 6 else "En observación"},
            "finanzas": {"puntuacion": 12 - nunca_count, "estado": "Crítico" if nunca_count >= 6 else "En desarrollo"},
            "operaciones": {"puntuacion": 8, "estado": "Por evaluar"},
            "marketing": {"puntuacion": 7, "estado": "Por evaluar"},
            "talento": {"puntuacion": 6, "estado": "Por evaluar"}
        },
        "areas_fuertes": areas_fuertes if areas_fuertes else ["Mentalidad empresarial (por evaluar)"],
        "areas_mejora": areas_mejora if areas_mejora else ["Se requiere análisis más detallado"],
        "recomendaciones_prioritarias": [
            "Implementar sistema de control financiero básico",
            "Definir y comunicar visión clara del negocio",
            "Establecer métricas clave de desempeño",
            "Desarrollar protocolos operativos estandarizados"
        ],
        "plan_accion_inmediato": [
            {
                "area": "Finanzas",
                "acciones": [
                    "Separar cuentas personales y empresariales",
                    "Implementar registro semanal de ingresos y gastos",
                    "Calcular punto de equilibrio mensual"
                ],
                "plazo": "30 días"
            },
            {
                "area": "Visión",
                "acciones": [
                    "Redactar visión a 3 años",
                    "Definir metas trimestrales medibles",
                    "Comunicar propósito al equipo"
                ],
                "plazo": "15 días"
            }
        ],
        "notas_adicionales": diagnostic.notas or "Sin notas adicionales"
    }
    
    return json.dumps(json_resultado, ensure_ascii=False)