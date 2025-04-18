import { useEffect, useRef, useState } from "react";

const useWebSocket = ( reconnectTrigger = 0 ) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [lastPing, setLastPing] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);


  console.log("reconnectTrigger is ==>", reconnectTrigger);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const connectWebSocket = () => {
      if (!navigator.onLine) {
        setError("offline");
        return;
      }

      socketRef.current = new WebSocket("ws://localhost:8080");

      socketRef.current.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
        setError(null);
        socketRef.current?.send("Hello from React Client!");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setError("Connection closed, retrying...");
        setTimeout(connectWebSocket, 3000);
      };

      socketRef.current.onerror = (error) => {
        console.log("WebSocket error:", error);
        setError("WebSocket error. Retrying...");
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000); // try to reconnect after 3 seconds
      };
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [reconnectTrigger]);

  return { isConnected, error };
};

export default useWebSocket;
