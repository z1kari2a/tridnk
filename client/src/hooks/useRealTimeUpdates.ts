import { useState } from "react";

// Simplified version that doesn't use WebSocket
export function useRealTimeUpdates<T>(messageType: string) {
  const [data, setData] = useState<T | null>(null);

  // This is a temporary solution until we fix WebSocket issues
  // It will simply return null, and we'll use regular API polling instead
  console.log(`Real-time updates for ${messageType} temporarily disabled`);
  
  return data;
}
