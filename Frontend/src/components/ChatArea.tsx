import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../types/config";

interface ChatAreaProps {
  activeChat: string;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  avatar?: string;
}

export function ChatArea({ activeChat }: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Función para manejar token expirado
  const handleTokenExpired = () => {
    // Limpiar token y redirigir al login
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

  // Función para obtener el token
  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      handleTokenExpired();
    }
    return token;
  };

  // Generar ID único para mensajes
  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar historial de mensajes al montar el componente
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("No hay token de autenticación para cargar el historial");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/agent/session`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const sessionData = await response.json();
        
        if (sessionData.messages && sessionData.messages.length > 0) {
          const formattedMessages: Message[] = sessionData.messages.map((msg: any) => ({
            id: generateMessageId(),
            sender: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            avatar: msg.role === "user" ? "TU" : "RT",
          }));
          
          setMessages(formattedMessages);
        }
      } else if (response.status === 404) {
        // No hay sesión activa, es normal para primer uso
        console.log("No hay sesión activa, comenzando chat nuevo");
      } else {
        // Verificar si el token expiró
        if (checkTokenExpired(response)) {
          return;
        }
        console.error("Error cargando historial:", response.status);
      }
    } catch (error) {
      console.error("Error cargando historial del chat:", error);
      // En caso de error de red, también verificamos si es por token expirado
      if (error instanceof Error && error.message.includes("401")) {
        handleTokenExpired();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      sender: "user",
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "TU",
    };

    // Agregar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        const agentMessage: Message = {
          id: generateMessageId(),
          sender: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "RT",
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        // Verificar si el token expiró
        if (checkTokenExpired(response)) {
          return;
        }
        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Verificar si es error de token expirado
      if (error instanceof Error && error.message.includes("401")) {
        handleTokenExpired();
        return;
      }

      const errorMessage: Message = {
        id: generateMessageId(),
        sender: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "RT",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // El input solo se deshabilita durante la carga
  const isInputDisabled = isLoading;

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-900 to-black text-white min-h-0">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-zinc-700 bg-zinc-900/90">
        <h2 className="font-semibold text-white text-lg">
          {activeChat || "Chat con el Agente"}
        </h2>
        <p className="text-sm text-green-400 mt-1">
          {messages.length > 0 ? `${messages.length} mensajes` : "Chat nuevo"}
        </p>
      </div>

      {/* Messages Area - Contenedor con scroll */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-br from-zinc-900 to-black min-h-0"
      >
        {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 mt-8">
            <div>
            </div>
            <p className="text-lg text-white">
              ¡Hola! Soy tu asistente virtual
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Escribe tu primer mensaje abajo para comenzar la conversación
            </p>
            </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "assistant" && (
                <div 
                  className="flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: "#F198C0" }}
                >
                  {msg.avatar}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  msg.sender === "user"
                    ? "text-white"
                    : "bg-zinc-800 text-white"
                }`}
                style={msg.sender === "user" ? { 
                  backgroundColor: "#F198C0"
                } : {}}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "user" ? "text-white/70" : "text-zinc-400"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
              {msg.sender === "user" && (
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: "#F198C0" }}
                >
                  {msg.avatar}
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div 
              className="flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: "#F198C0" }}
            >
              RT
            </div>
            <div className="bg-zinc-800 text-white px-4 py-3 rounded-xl">
              <div className="flex gap-1">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "#F198C0" }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ backgroundColor: "#F198C0", animationDelay: "0.1s" }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ backgroundColor: "#F198C0", animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-700 bg-zinc-900/90">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isInputDisabled}
            className="flex-1 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 rounded-lg px-4 py-3 
              focus:outline-none focus:ring-1 focus:ring-[#F198C0] focus:border-[#F198C0] disabled:opacity-50
              transition-all duration-200"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isInputDisabled}
            className="text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#F198C0"
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 19 7-7 3 3-7 7-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}