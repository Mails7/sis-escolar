// Utility to check if we're in offline mode
let offlineMode = false

export function isOfflineMode() {
  return offlineMode
}

export function setOfflineMode(value: boolean) {
  offlineMode = value
  if (typeof window !== "undefined") {
    localStorage.setItem("educar_offline_mode", value ? "true" : "false")
  }
}

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  const savedMode = localStorage.getItem("educar_offline_mode")
  if (savedMode === "true") {
    offlineMode = true
  }
}
