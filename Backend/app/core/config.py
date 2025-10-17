from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Importa el middleware CORS
from dotenv import load_dotenv

# Importar routers de cada módulo
# from app.auth.routes import router as auth_router
# from app.agent.routes import router as agent_router
from app.diagnostic.routes import router as diagnostic_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",         # Desarrollo local
        "http://127.0.0.1:3000", 
        "http://diagnosticonegocio.rizosfelices.co", # Alternativa local
        "https://jacksonville-league-panels-disabilities.trycloudflare.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los headers
)
# Health Check Endpoint
@app.get("/")
async def read_root():
    return {"message": "Bienvenido a la API diagnotico empresarial"}

# Incluir todos los routers
# app.include_router(auth_router, prefix="/auth", tags=["Auth"])
# app.include_router(agent_router, prefix="/agent", tags=["Agent"])
app.include_router(diagnostic_router, prefix="/diagnostics", tags=["Diagnostics"])


