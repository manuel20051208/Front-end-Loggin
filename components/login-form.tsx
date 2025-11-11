"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Brain, Heart } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)

  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const payload = isRegistering
      ? { usuario: username, nombre: fullName, email, password }
      : { email, password }

    try {
      const url = isRegistering
        ? "https://api-usuario-tj78.onrender.com/api/usuario/registrar"
        : "https://api-usuario-tj78.onrender.com/api/usuario/login"

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data?.mensaje || "Operación exitosa")

        if (!isRegistering) {
          const token = data.token
          localStorage.setItem("token", token)

          try {
            const userRes = await fetch("https://api-usuario-tj78.onrender.com/api/usuario/me", {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!userRes.ok) throw new Error("No se pudieron cargar los datos del usuario")

            const userData = await userRes.json()

            localStorage.setItem("usuario", JSON.stringify(userData.usuario))

            const encodedToken = encodeURIComponent(token)
            window.location.href = `https://api-usuario-tj78.onrender.com/?token=${encodedToken}`
          } catch (err) {
            console.error("Error obteniendo usuario:", err)
            alert("Error al cargar datos del usuario.")
          }
        }
        else {
          setIsRegistering(false)
          setFullName("")
          setUsername("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
        }
      } else {
        alert(data?.mensaje || "Error desconocido")
      }
    } catch (error) {
      console.error("Error durante la autenticación:", error)
      alert("Ocurrió un error al conectar con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="fixed top-10 left-10 opacity-20 animate-float">
        <Brain className="h-24 w-24 text-purple-400" />
      </div>
      <div className="fixed bottom-10 right-10 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <Heart className="h-24 w-24 text-purple-300" />
      </div>

      <div className="w-full max-w-md px-4 z-10">
        {/* Logo/Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800 animate-pulse-glow shadow-lg">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            HealthyMind
          </h1>
          <p className="mt-2 text-slate-300">
            {isRegistering ? "Comienza tu viaje hacia el bienestar mental" : "Bienvenido de vuelta a tu espacio de tranquilidad"}
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700 backdrop-blur-sm bg-slate-800/95">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isRegistering ? "Completa tus datos para registrarte" : "Ingresa a tu cuenta para continuar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200 font-medium">
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isRegistering}
                    disabled={isLoading}
                    className="h-12 border-slate-600 bg-slate-900 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-200 font-medium">
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isRegistering}
                    disabled={isLoading}
                    className="h-12 border-slate-600 bg-slate-900 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200 font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu.email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 border-slate-600 bg-slate-900 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200 font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-slate-600 bg-slate-900 pr-12 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200 font-medium">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-slate-600 bg-slate-900 pr-12 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading
                ? isRegistering
                  ? "Creando cuenta..."
                  : "Iniciando sesión..."
                : isRegistering
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-400">
              {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                {isRegistering ? "Inicia sesión" : "Regístrate ahora"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}