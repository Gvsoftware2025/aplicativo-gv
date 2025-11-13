"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/pwa/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, BarChart3, LogOut, Download, X } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallModal, setShowInstallModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    router.push("/")
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    } else {
      setShowInstallModal(true)
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
              onClick={handleInstallClick}
              variant="outline"
              className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar App
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

      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-purple-500/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Instalar GV Admin</h2>
                  <p className="text-slate-400">Siga as instruções para seu navegador</p>
                </div>
                <Button
                  onClick={() => setShowInstallModal(false)}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Chrome / Edge */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Chrome / Edge (Desktop)</h3>
                  <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                    <li>Clique no ícone de instalação na barra de endereço (ao lado da URL)</li>
                    <li>Ou clique nos 3 pontos → "Instalar GV Admin"</li>
                    <li>Confirme a instalação</li>
                  </ol>
                </div>

                {/* Android */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-pink-500/10">
                  <h3 className="text-lg font-semibold text-pink-400 mb-3">Chrome / Edge (Android)</h3>
                  <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                    <li>Toque nos 3 pontos no canto superior direito</li>
                    <li>Selecione "Adicionar à tela inicial"</li>
                    <li>Toque em "Adicionar"</li>
                  </ol>
                </div>

                {/* Safari iOS */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/10">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Safari (iPhone/iPad)</h3>
                  <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                    <li>Toque no botão de compartilhar (quadrado com seta)</li>
                    <li>Role para baixo e selecione "Adicionar à Tela de Início"</li>
                    <li>Toque em "Adicionar"</li>
                  </ol>
                </div>

                {/* Firefox */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-orange-500/10">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">Firefox</h3>
                  <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                    <li>Clique no ícone de instalação na barra de endereço</li>
                    <li>Ou clique nos 3 traços → "Instalar"</li>
                    <li>Confirme a instalação</li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-400 text-center">
                  Após instalar, o app funcionará como aplicativo independente no seu dispositivo
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
