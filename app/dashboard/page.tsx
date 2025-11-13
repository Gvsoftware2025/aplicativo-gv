"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/pwa/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, BarChart3, LogOut, Download } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    router.push("/")
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-slate-400">GV Software - Gerenciamento Completo</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleInstall}
              variant="outline"
              className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 bg-transparent"
              disabled={!deferredPrompt}
            >
              <Download className="w-4 h-4 mr-2" />
              {deferredPrompt ? "Instalar App" : "App Instalável"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/projetos">
            <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur hover:bg-slate-900/70 transition-all cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <FolderKanban className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Gerenciar todos os projetos do portfólio</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/estatisticas">
            <Card className="border-pink-500/20 bg-slate-900/50 backdrop-blur hover:bg-slate-900/70 transition-all cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-white">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Ver estatísticas e métricas do site</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Em breve</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Mais funcionalidades em desenvolvimento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
