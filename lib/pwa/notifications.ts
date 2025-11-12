export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export function showNotification(title: string, type: "success" | "error" | "info" = "success"): void {
  if (Notification.permission === "granted") {
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
    new Notification(`${icon} ${title}`, {
      icon: "/icon-192x192.jpg",
      badge: "/icon-192x192.jpg",
    })
  }
}
