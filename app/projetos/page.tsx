"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/pwa/auth"
import { getAllProjects, createProject, updateProject, deleteProject, type Project } from "@/lib/supabase-projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Loader2, Pencil, Trash2, Upload, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function ProjetosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projetos, setProjetos] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    category: "",
    status: "em_andamento",
    featured: false,
    project_url: "",
    github_url: "",
    client: "",
    show_project_button: true,
    images: [] as string[],
    technologies: [] as string[],
    features: [] as string[],
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
      return
    }

    loadProjects()
  }, [router])

  async function loadProjects() {
    const projects = await getAllProjects()
    setProjetos(projects)
    setLoading(false)
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Falha ao fazer upload da imagem")

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))

      toast({ title: "Imagens enviadas com sucesso!" })
    } catch (error) {
      toast({
        title: "Erro ao enviar imagens",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  function handleOpenDialog(project?: Project) {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        long_description: project.long_description || "",
        category: project.category,
        status: project.status,
        featured: project.featured,
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        client: project.client || "",
        show_project_button: project.show_project_button ?? true,
        images: project.images || [],
        technologies: project.technologies || [],
        features: project.features || [],
      })
    } else {
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        long_description: "",
        category: "",
        status: "em_andamento",
        featured: false,
        project_url: "",
        github_url: "",
        client: "",
        show_project_button: true,
        images: [],
        technologies: [],
        features: [],
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSaveProject() {
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      if (editingProject) {
        const result = await updateProject(editingProject.id.toString(), formData)
        if (result.data) {
          toast({ title: "Projeto atualizado com sucesso!" })
        } else {
          throw result.error
        }
      } else {
        const result = await createProject(formData)
        if (result.data) {
          toast({ title: "Projeto criado com sucesso!" })
        } else {
          throw result.error
        }
      }
      await loadProjects()
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar projeto",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProject(id: number, e: React.MouseEvent) {
    e.stopPropagation()

    if (!confirm("Tem certeza que deseja excluir este projeto?")) return

    const result = await deleteProject(id.toString())
    if (!result.error) {
      toast({ title: "Projeto excluído com sucesso!" })
      await loadProjects()
    } else {
      toast({
        title: "Erro ao excluir projeto",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="border-purple-500/20 text-purple-400 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Projetos</h1>
              <p className="text-slate-400">Gerenciar projetos do portfólio</p>
            </div>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Projeto
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : projetos.length === 0 ? (
          <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 mb-4">Nenhum projeto cadastrado ainda</p>
              <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => {
              console.log("[v0] Projeto:", projeto.title)
              console.log("[v0] Imagens:", projeto.images)
              console.log("[v0] Primeira imagem:", projeto.images?.[0])

              return (
                <Card
                  key={projeto.id}
                  className="border-purple-500/20 bg-slate-900/50 backdrop-blur group relative cursor-pointer hover:border-purple-500/40 transition-all overflow-hidden"
                  onClick={() => handleOpenDialog(projeto)}
                >
                  {projeto.images && projeto.images.length > 0 ? (
                    <div className="relative w-full h-48 overflow-hidden bg-slate-800">
                      <Image
                        src={projeto.images[0] || "/placeholder.svg"}
                        alt={projeto.title}
                        fill
                        className="object-cover"
                        onError={() => console.log("[v0] Erro ao carregar imagem:", projeto.images[0])}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-purple-950/20 to-pink-950/20 flex items-center justify-center">
                      <p className="text-slate-500 text-sm">Sem imagem</p>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-purple-500/20 bg-slate-900/80"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDialog(projeto)
                      }}
                    >
                      <Pencil className="w-4 h-4 text-purple-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-red-500/20 bg-slate-900/80"
                      onClick={(e) => handleDeleteProject(projeto.id, e)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white pr-20">{projeto.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm mb-4">{projeto.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="border-purple-500/20 text-purple-400">
                        {projeto.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`border-purple-500/20 ${
                          projeto.status === "concluido" ? "text-green-400" : "text-yellow-400"
                        }`}
                      >
                        {projeto.status === "concluido" ? "Concluído" : "Em andamento"}
                      </Badge>
                      {projeto.featured && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Destaque</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800 border-purple-500/20"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Descrição Longa</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="bg-slate-800 border-purple-500/20"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ex: sistema, website, app"
                    className="bg-slate-800 border-purple-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/20">
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagens do Projeto</Label>
                <div className="space-y-2">
                  {/* Display uploaded images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Imagem ${index + 1}`}
                            width={120}
                            height={90}
                            className="rounded border border-purple-500/20 object-cover w-full h-24"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-purple-500/20 bg-transparent"
                      disabled={uploadingImages}
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      {uploadingImages ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Enviar Imagens
                    </Button>
                    <span className="text-sm text-slate-400">{formData.images.length} imagem(ns) adicionada(s)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_url">URL do Projeto</Label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-800 border-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">URL do GitHub</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="bg-slate-800 border-purple-500/20"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Projeto em Destaque</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-purple-500/20">
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProject}
                disabled={saving}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProject ? "Atualizar" : "Criar"} Projeto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
