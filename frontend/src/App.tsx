import { useEffect, useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import heartLogo from "./assets/heart.png";
import brokenHeartLogo from "./assets/broken-heart.png";
import "./App.css";

function App() {
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const { isConnected, error } = useWebSocket(reconnectTrigger);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("inside handleOnline and we're online ==>");
      setReconnectTrigger((prev) => prev + 1);
    };
    const handleOffline = () => {
      setIsOnline(false);
      console.log("inside handleOnline and we're offline ==>");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="App">
        <img src={brokenHeartLogo} className="logo faded" alt="Heart logo" />
        <p>Status: Offline 🔴</p>
        <p>Failed to connect to the server.</p>
      </div>
    );
  }
  return (
    <div className="App">
      <img
        src={heartLogo}
        className={`logo ${isOnline && isConnected ? "heart-beat" : ""}`}
        alt="Heart logo"
      />
      <div>
        {error && <div>Reconnecting...</div>}
        <p>Status: Online 🟢</p>
        <p>
          Connection Status:{" "}
          {isConnected
            ? "Online and Connected"
            : "Online but not connected to WebSocket"}
        </p>
      </div>
    </div>
  );
}

export default App;
