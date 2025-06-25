export class PubSub<T extends any[]> {
  private listeners = new Set<(...args: T) => void>()

  subscribe = (listener: (...args: T) => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit = (...args: T) => {
    this.listeners.forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error('Error in PubSub listener:', error)
      }
    })
  }
} 