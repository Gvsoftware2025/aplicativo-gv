import { createClient } from "./supabase"

export interface Project {
  id: number
  title: string
  description: string
  long_description?: string
  category: string
  technologies: string[]
  images: string[]
  features: string[]
  project_url?: string
  github_url?: string
  status: string
  featured: boolean
  show_project_button: boolean
  client: string
  created_at?: string
  updated_at?: string
}

async function getProjectWithRelations(projectId: number): Promise<Project | null> {
  const client = createClient()

  const { data: project, error: projectError } = await client.from("projects").select("*").eq("id", projectId).single()

  if (projectError || !project) return null

  const [imagesResult, techResult, featuresResult] = await Promise.all([
    client.from("project_images").select("image_url").eq("project_id", projectId).order("display_order"),
    client.from("project_technologies").select("technology").eq("project_id", projectId),
    client.from("project_features").select("feature").eq("project_id", projectId).order("display_order"),
  ])

  return {
    ...project,
    images: imagesResult.data?.map((img) => img.image_url) || [],
    technologies: techResult.data?.map((tech) => tech.technology) || [],
    features: featuresResult.data?.map((feat) => feat.feature) || [],
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    console.log("[v0] getAllProjects: Starting fetch...")
    const client = createClient()

    console.log("[v0] getAllProjects: Supabase client created")

    const { data: projects, error } = await client
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("[v0] getAllProjects: Response error:", error)
    console.log("[v0] getAllProjects: Response data:", projects)

    if (error) {
      console.error("[v0] Erro ao buscar projetos:", error)
      return []
    }

    if (!projects) {
      console.log("[v0] getAllProjects: No projects found (null data)")
      return []
    }

    console.log("[v0] getAllProjects: Found", projects.length, "projects")

    const projectsWithRelations = await Promise.all(
      projects.map(async (project) => {
        const fullProject = await getProjectWithRelations(project.id)
        return fullProject || project
      }),
    )

    console.log("[v0] getAllProjects: Returning", projectsWithRelations.length, "projects with relations")
    return projectsWithRelations
  } catch (error) {
    console.error("[v0] Erro ao buscar projetos (catch):", error)
    return []
  }
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<{
  data: Project | null
  error: any
}> {
  try {
    const client = createClient()

    const { data: newProject, error: projectError } = await client
      .from("projects")
      .insert([
        {
          title: project.title,
          description: project.description,
          long_description: project.long_description,
          category: project.category,
          status: project.status,
          client: project.client,
          featured: project.featured,
          show_project_button: project.show_project_button,
          project_url: project.project_url,
          github_url: project.github_url,
        },
      ])
      .select()
      .single()

    if (projectError) throw projectError
    if (!newProject) throw new Error("Failed to create project")

    if (project.images && project.images.length > 0) {
      const imageInserts = project.images.map((url, index) => ({
        project_id: newProject.id,
        image_url: url,
        display_order: index + 1,
      }))

      await client.from("project_images").insert(imageInserts)
    }

    if (project.technologies && project.technologies.length > 0) {
      const techInserts = project.technologies.map((tech) => ({
        project_id: newProject.id,
        technology: tech,
      }))

      await client.from("project_technologies").insert(techInserts)
    }

    if (project.features && project.features.length > 0) {
      const featureInserts = project.features.map((feat, index) => ({
        project_id: newProject.id,
        feature: feat,
        display_order: index + 1,
      }))

      await client.from("project_features").insert(featureInserts)
    }

    const completeProject = await getProjectWithRelations(newProject.id)

    return { data: completeProject, error: null }
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return { data: null, error }
  }
}

export async function updateProject(
  id: string,
  project: Partial<Omit<Project, "id" | "created_at" | "updated_at">>,
): Promise<{
  data: Project | null
  error: any
}> {
  try {
    const client = createClient()
    const projectId = Number.parseInt(id)

    const { data: updatedProject, error: projectError } = await client
      .from("projects")
      .update({
        title: project.title,
        description: project.description,
        long_description: project.long_description,
        category: project.category,
        status: project.status,
        client: project.client,
        featured: project.featured,
        show_project_button: project.show_project_button,
        project_url: project.project_url,
        github_url: project.github_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single()

    if (projectError) throw projectError

    if (project.images) {
      await client.from("project_images").delete().eq("project_id", projectId)

      if (project.images.length > 0) {
        const imageInserts = project.images.map((url, index) => ({
          project_id: projectId,
          image_url: url,
          display_order: index + 1,
        }))

        await client.from("project_images").insert(imageInserts)
      }
    }

    if (project.technologies) {
      await client.from("project_technologies").delete().eq("project_id", projectId)

      if (project.technologies.length > 0) {
        const techInserts = project.technologies.map((tech) => ({
          project_id: projectId,
          technology: tech,
        }))

        await client.from("project_technologies").insert(techInserts)
      }
    }

    if (project.features) {
      await client.from("project_features").delete().eq("project_id", projectId)

      if (project.features.length > 0) {
        const featureInserts = project.features.map((feat, index) => ({
          project_id: projectId,
          feature: feat,
          display_order: index + 1,
        }))

        await client.from("project_features").insert(featureInserts)
      }
    }

    const completeProject = await getProjectWithRelations(projectId)

    return { data: completeProject, error: null }
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    return { data: null, error }
  }
}

export async function deleteProject(id: string): Promise<{ error: any }> {
  try {
    const client = createClient()
    const { error } = await client.from("projects").delete().eq("id", Number.parseInt(id))

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Erro ao deletar projeto:", error)
    return { error }
  }
}
