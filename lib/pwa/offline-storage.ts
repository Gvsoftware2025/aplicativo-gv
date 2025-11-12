const OFFLINE_QUEUE_KEY = "gv_offline_queue"

export interface OfflineAction {
  id: string
  type: string
  data: any
  timestamp: number
}

export function saveOffline(type: string, data: any): void {
  const actions = getPendingActions()
  const newAction: OfflineAction = {
    id: Date.now().toString(),
    type,
    data,
    timestamp: Date.now(),
  }
  actions.push(newAction)
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(actions))
}

export function getPendingActions(): OfflineAction[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(OFFLINE_QUEUE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearPendingActions(): void {
  localStorage.removeItem(OFFLINE_QUEUE_KEY)
}

export function isOnline(): boolean {
  return typeof window !== "undefined" && navigator.onLine
}

export function getOfflineStatus(): { isOnline: boolean; pendingCount: number } {
  return {
    isOnline: isOnline(),
    pendingCount: getPendingActions().length,
  }
}
