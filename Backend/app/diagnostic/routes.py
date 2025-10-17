from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.diagnostic.models import DiagnosticRequest, DiagnosticResponse
from app.diagnostic.controllers import create_diagnostic_controller
from app.core.database import collection_diagnostics

router = APIRouter()


# ===== Crear diagnóstico empresarial =====
@router.post("/", response_model=DiagnosticResponse)
async def create_diagnostic(diagnostic: DiagnosticRequest):
    print("📥 Solicitud de diagnóstico empresarial recibida:", diagnostic.nombre)

    # Lógica de creación (sin usuario)
    result = await create_diagnostic_controller(diagnostic)
    print("✅ Diagnóstico empresarial creado:", result.id)

    return result

@router.post("/", response_model=DiagnosticResponse)
async def create_diagnostic(diagnostic: DiagnosticRequest):
    print("📥 Solicitud de diagnóstico empresarial recibida:", diagnostic.nombre)

    # Lógica de creación (sin usuario)
    result = await create_diagnostic_controller(diagnostic)
    print("✅ Diagnóstico empresarial creado:", result.id)

    return result



# ===== Obtener diagnóstico empresarial por ID =====
@router.get("/{diagnostic_id}", response_model=DiagnosticResponse)
async def get_diagnostic(diagnostic_id: str):
    diagnostic = await collection_diagnostics.find_one({
        "_id": ObjectId(diagnostic_id)
    })

    if not diagnostic:
        raise HTTPException(status_code=404, detail="Diagnóstico empresarial no encontrado")

    # Construir respuesta con TODOS los campos empresariales
    response_data = {
        "id": str(diagnostic["_id"]),
        "professional_id": str(diagnostic.get("professional_id", "")),
        "nombre": diagnostic["nombre"],
        "whatsapp": diagnostic["whatsapp"],
        "correo": diagnostic["correo"],
        "notas": diagnostic.get("notas"),
        "created_at": diagnostic["created_at"],
        "resultado_agente": diagnostic.get("resultado_agente")
    }

    # Agregar TODAS las preguntas empresariales
    campos_empresariales = [
        # 🧭 VISIÓN Y PROPÓSITO (10 preguntas)
        "vision_p1", "vision_p2", "vision_p3", "vision_p4", "vision_p5", 
        "vision_p6", "vision_p7", "vision_p8", "vision_p9", "vision_p10",
        
        # 💰 ESTRUCTURA FINANCIERA (12 preguntas)
        "finanzas_p1", "finanzas_p2", "finanzas_p3", "finanzas_p4", "finanzas_p5",
        "finanzas_p6", "finanzas_p7", "finanzas_p8", "finanzas_p9", "finanzas_p10",
        "finanzas_p11", "finanzas_p12",
        
        # ⚙ OPERACIONES Y SERVICIO (12 preguntas)
        "operaciones_p1", "operaciones_p2", "operaciones_p3", "operaciones_p4", "operaciones_p5",
        "operaciones_p6", "operaciones_p7", "operaciones_p8", "operaciones_p9", "operaciones_p10",
        "operaciones_p11", "operaciones_p12",
        
        # 🌐 MARKETING Y PRESENCIA DIGITAL (12 preguntas)
        "marketing_p1", "marketing_p2", "marketing_p3", "marketing_p4", "marketing_p5",
        "marketing_p6", "marketing_p7", "marketing_p8", "marketing_p9", "marketing_p10",
        "marketing_p11", "marketing_p12",
        
        # 👥 TALENTO HUMANO Y CULTURA (11 preguntas)
        "talento_p1", "talento_p2", "talento_p3", "talento_p4", "talento_p5",
        "talento_p6", "talento_p7", "talento_p8", "talento_p9", "talento_p10",
        "talento_p11",
        
        # 📈 INDICADORES Y RESULTADOS (9 preguntas)
        "indicadores_p1", "indicadores_p2", "indicadores_p3", "indicadores_p4", "indicadores_p5",
        "indicadores_p6", "indicadores_p7", "indicadores_p8", "indicadores_p9",
        
        # 🧠 MENTALIDAD EMPRESARIAL (10 preguntas)
        "mentalidad_p1", "mentalidad_p2", "mentalidad_p3", "mentalidad_p4", "mentalidad_p5",
        "mentalidad_p6", "mentalidad_p7", "mentalidad_p8", "mentalidad_p9", "mentalidad_p10"
    ]

    # Agregar cada campo empresarial si existe en la base de datos
    for campo in campos_empresariales:
        if campo in diagnostic:
            response_data[campo] = diagnostic[campo]

    return DiagnosticResponse(**response_data)


# ===== Obtener todos los diagnósticos empresariales =====
@router.get("/", response_model=list[DiagnosticResponse])
async def get_all_diagnostics():
    diagnostics_cursor = collection_diagnostics.find({})
    diagnostics = await diagnostics_cursor.to_list(length=None)

    if not diagnostics:
        raise HTTPException(status_code=404, detail="No se encontraron diagnósticos empresariales")

    resultados = []
    
    for diagnostic in diagnostics:
        # Construir respuesta para cada diagnóstico
        response_data = {
            "id": str(diagnostic["_id"]),
            "professional_id": str(diagnostic.get("professional_id", "")),
            "nombre": diagnostic["nombre"],
            "whatsapp": diagnostic["whatsapp"],
            "correo": diagnostic["correo"],
            "notas": diagnostic.get("notas"),
            "created_at": diagnostic["created_at"],
            "resultado_agente": diagnostic.get("resultado_agente")
        }

        # Agregar TODAS las preguntas empresariales
        campos_empresariales = [
            # 🧭 VISIÓN Y PROPÓSITO
            "vision_p1", "vision_p2", "vision_p3", "vision_p4", "vision_p5", 
            "vision_p6", "vision_p7", "vision_p8", "vision_p9", "vision_p10",
            
            # 💰 ESTRUCTURA FINANCIERA
            "finanzas_p1", "finanzas_p2", "finanzas_p3", "finanzas_p4", "finanzas_p5",
            "finanzas_p6", "finanzas_p7", "finanzas_p8", "finanzas_p9", "finanzas_p10",
            "finanzas_p11", "finanzas_p12",
            
            # ⚙ OPERACIONES Y SERVICIO
            "operaciones_p1", "operaciones_p2", "operaciones_p3", "operaciones_p4", "operaciones_p5",
            "operaciones_p6", "operaciones_p7", "operaciones_p8", "operaciones_p9", "operaciones_p10",
            "operaciones_p11", "operaciones_p12",
            
            # 🌐 MARKETING Y PRESENCIA DIGITAL
            "marketing_p1", "marketing_p2", "marketing_p3", "marketing_p4", "marketing_p5",
            "marketing_p6", "marketing_p7", "marketing_p8", "marketing_p9", "marketing_p10",
            "marketing_p11", "marketing_p12",
            
            # 👥 TALENTO HUMANO Y CULTURA
            "talento_p1", "talento_p2", "talento_p3", "talento_p4", "talento_p5",
            "talento_p6", "talento_p7", "talento_p8", "talento_p9", "talento_p10",
            "talento_p11",
            
            # 📈 INDICADORES Y RESULTADOS
            "indicadores_p1", "indicadores_p2", "indicadores_p3", "indicadores_p4", "indicadores_p5",
            "indicadores_p6", "indicadores_p7", "indicadores_p8", "indicadores_p9",
            
            # 🧠 MENTALIDAD EMPRESARIAL
            "mentalidad_p1", "mentalidad_p2", "mentalidad_p3", "mentalidad_p4", "mentalidad_p5",
            "mentalidad_p6", "mentalidad_p7", "mentalidad_p8", "mentalidad_p9", "mentalidad_p10"
        ]

        # Agregar cada campo empresarial si existe
        for campo in campos_empresariales:
            if campo in diagnostic:
                response_data[campo] = diagnostic[campo]

        resultados.append(DiagnosticResponse(**response_data))

    return resultados