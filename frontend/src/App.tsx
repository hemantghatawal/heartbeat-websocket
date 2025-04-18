import { useEffect, useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import heartLogo from "./assets/heart.png";
import brokenHeartLogo from "./assets/broken-heart.png";
import "./App.css";

function App() {
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const { isConnected, lastPing, error } = useWebSocket(
    reconnectTrigger
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [heartbeat, setHeartbeat] = useState(false);
  const [isInitialOffline, setIsInitialOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnectTrigger((prev) => prev + 1);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedOfflineStatus = localStorage.getItem("isOffline");
    if (savedOfflineStatus === "true") {
      setIsInitialOffline(true);
    }
  }, []);

  useEffect(() => {
    if (!navigator.onLine) {
      localStorage.setItem("isOffline", "true");
      setIsInitialOffline(true);
    } else {
      localStorage.removeItem("isOffline");
    }
  }, [isOnline]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastPing = Date.now() - lastPing;
      setHeartbeat(timeSinceLastPing < 3000 );
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPing]);

  const logoSrc = isOnline ? heartLogo : brokenHeartLogo;
  const heartClass = heartbeat ? "logo heart-beat" : "logo faded";

  if (isInitialOffline) {
    return (
      <div className="App">
        <img src={brokenHeartLogo} className="logo faded" alt="Heart logo" />
        <h2>Failed to connect to the server.</h2>
        <p>Please check your internet connection.</p>
      </div>
    );
  }
  return (
    <div className="App">
      <img src={logoSrc} className={heartClass} alt="Heart logo" />
      <div>
        {error && <div>Reconnecting...</div>}
        <p>
          Status:{" "}
          {isOnline
            ? isConnected
              ? "Online and Connected"
              : "Online but not connected to WebSocket"
            : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default App;
