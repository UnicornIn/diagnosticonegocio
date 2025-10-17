from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class DiagnosticRequest(BaseModel):
    # Información personal
    nombre: str
    whatsapp: str
    correo: EmailStr
    
    # 🧭 VISIÓN Y PROPÓSITO (10 preguntas)
    vision_p1: str  # ¿Tienes una visión escrita de lo que quieres lograr en los próximos 3 años?
    vision_p2: str  # ¿Sabes cuál es el propósito o razón de existir de tu negocio?
    vision_p3: str  # ¿Tu visión se refleja en tu logo, nombre y comunicación?
    vision_p4: str  # ¿Tu equipo conoce y repite esa visión?
    vision_p5: str  # ¿Has definido metas anuales con fechas y responsables?
    vision_p6: str  # ¿Tu negocio tiene un lema o frase guía que unifique al equipo?
    vision_p7: str  # ¿Revisas tus metas o visión al menos una vez al año?
    vision_p8: str  # ¿Tienes un mapa estratégico o plan de crecimiento por etapas?
    vision_p9: str  # ¿Tienes indicadores (KPI) que te muestran si te estás acercando a tu visión?
    vision_p10: str # ¿Tu propósito está conectado con una necesidad real del mercado o comunidad?
    
    # 💰 ESTRUCTURA FINANCIERA (12 preguntas)
    finanzas_p1: str  # ¿Conoces tus ventas promedio mensuales?
    finanzas_p2: str  # ¿Sabes cuáles son tus costos fijos y variables?
    finanzas_p3: str  # ¿Tienes un registro (digital o físico) de tus ingresos y egresos?
    finanzas_p4: str  # ¿Sabes cuánto te queda de ganancia cada mes?
    finanzas_p5: str  # ¿Conoces tu punto de equilibrio?
    finanzas_p6: str  # ¿Tienes separado tu dinero personal del dinero del negocio?
    finanzas_p7: str  # ¿Tienes metas de ventas mensuales o semanales?
    finanzas_p8: str  # ¿Tienes flujo de caja proyectado a 3 meses?
    finanzas_p9: str  # ¿Tienes estrategias de rentabilidad?
    finanzas_p10: str # ¿Analizas tus márgenes por producto o servicio?
    finanzas_p11: str # ¿Llevas control de impuestos, nómina y obligaciones legales al día?
    finanzas_p12: str # ¿Tienes ahorros o reservas de emergencia para el negocio?
    
    # ⚙ OPERACIONES Y SERVICIO (12 preguntas)
    operaciones_p1: str  # ¿Tienes horarios de atención fijos y cumplidos?
    operaciones_p2: str  # ¿Llevas registro de las citas o servicios realizados?
    operaciones_p3: str  # ¿Controlas el uso de productos e inventario?
    operaciones_p4: str  # ¿Tienes una rutina diaria de apertura y cierre del negocio?
    operaciones_p5: str  # ¿Tienes manuales o protocolos escritos de servicio al cliente?
    operaciones_p6: str  # ¿Tienes procedimientos para capacitar al personal nuevo?
    operaciones_p7: str  # ¿Haces reuniones de seguimiento o retroalimentación con tu equipo?
    operaciones_p8: str  # ¿Controlas los tiempos de atención por servicio?
    operaciones_p9: str  # ¿Tienes indicadores operativos?
    operaciones_p10: str # ¿Haces seguimiento de satisfacción del cliente?
    operaciones_p11: str # ¿Tienes mecanismos para prevenir pérdidas, robos o desperdicios?
    operaciones_p12: str # ¿Has documentado tus procesos críticos?
    
    # 🌐 MARKETING Y PRESENCIA DIGITAL (12 preguntas)
    marketing_p1: str  # ¿Tu negocio tiene redes sociales activas?
    marketing_p2: str  # ¿Publicas contenido al menos una vez por semana?
    marketing_p3: str  # ¿Tienes una identidad visual coherente?
    marketing_p4: str  # ¿Usas WhatsApp Business, link directo o respuestas automáticas?
    marketing_p5: str  # ¿Analizas las métricas de tus publicaciones?
    marketing_p6: str  # ¿Tienes metas mensuales de seguidores o ventas por redes?
    marketing_p7: str  # ¿Promocionas productos o servicios con campañas pagadas?
    marketing_p8: str  # ¿Tienes testimonios o reseñas de clientes publicados?
    marketing_p9: str  # ¿Tienes embudos de venta o estrategias de conversión digital?
    marketing_p10: str # ¿Tienes una base de datos de clientes?
    marketing_p11: str # ¿Tienes página web o sistema de reservas en línea?
    marketing_p12: str # ¿Usas remarketing o estrategias de email / WhatsApp marketing?
    
    # 👥 TALENTO HUMANO Y CULTURA (11 preguntas)
    talento_p1: str  # ¿Tienes claro quiénes trabajan contigo y sus roles?
    talento_p2: str  # ¿Pagas salarios o comisiones fijas y claras?
    talento_p3: str  # ¿Haces reuniones o espacios para escuchar al equipo?
    talento_p4: str  # ¿Tienes procesos definidos de selección y entrenamiento?
    talento_p5: str  # ¿Tienes acuerdos de confidencialidad o contratos firmados?
    talento_p6: str  # ¿Tienes metas de crecimiento o carrera para tus colaboradores?
    talento_p7: str  # ¿Ofreces retroalimentación y formación continua?
    talento_p8: str  # ¿Tienes indicadores de desempeño o productividad del equipo?
    talento_p9: str  # ¿Tienes políticas para resolver conflictos o ausencias?
    talento_p10: str # ¿Haces seguimiento al bienestar emocional del equipo?
    talento_p11: str # ¿Tienes planes de incentivos o bonos por resultados?
    
    # 📈 INDICADORES Y RESULTADOS (9 preguntas)
    indicadores_p1: str  # ¿Llevas registro de tus ventas y gastos mensuales?
    indicadores_p2: str  # ¿Sabes cuántos clientes nuevos y repetidos tienes al mes?
    indicadores_p3: str  # ¿Conoces tu ticket promedio?
    indicadores_p4: str  # ¿Sabes tu tasa de retención?
    indicadores_p5: str  # ¿Mides la satisfacción del cliente?
    indicadores_p6: str  # ¿Tienes metas numéricas trimestrales o anuales?
    indicadores_p7: str  # ¿Analizas tendencias en ventas y gastos?
    indicadores_p8: str  # ¿Usas algún dashboard o reporte visual para ver tus datos?
    indicadores_p9: str  # ¿Tomas decisiones basadas en datos reales?
    
    # 🧠 MENTALIDAD EMPRESARIAL (10 preguntas)
    mentalidad_p1: str  # ¿Te consideras líder o administrador del negocio?
    mentalidad_p2: str  # ¿Has hecho algún curso de liderazgo o gestión?
    mentalidad_p3: str  # ¿Te sientes en control de tu negocio o a veces el negocio te controla a ti?
    mentalidad_p4: str  # ¿Tienes mentores o personas con quienes contrastas tus decisiones?
    mentalidad_p5: str  # ¿Haces pausas o revisiones personales para evaluar tu avance?
    mentalidad_p6: str  # ¿Cómo manejas el estrés financiero o emocional?
    mentalidad_p7: str  # ¿Tienes rutinas personales de bienestar?
    mentalidad_p8: str  # ¿Tienes claridad sobre tus fortalezas y debilidades como líder?
    mentalidad_p9: str  # ¿Tienes un plan personal de crecimiento?
    mentalidad_p10: str # ¿Tomas decisiones difíciles a tiempo o las postergas?
    
    notas: Optional[str] = None

class DiagnosticResponse(DiagnosticRequest):
    id: str
    created_at: datetime
    resultado_agente: Optional[str] = None