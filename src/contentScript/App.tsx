import "./App.css";
import { useState, useEffect } from "react";
import { appSettingsStorage } from "app/background/controllers/storageController";

export const App = () => {
  const [customMessage, setCustomMessage] = useState("Think about your dreams.");

  useEffect(() => {
    // Load the custom message when component mounts
    const loadMessage = async () => {
      try {
        const message = await appSettingsStorage.get("customBlockMessage");
        setCustomMessage(message || "Think about your dreams.");
      } catch (error) {
        console.error("Failed to load custom message:", error);
        setCustomMessage("Think about your dreams.");
      }
    };
    loadMessage();
  }, []);

  return (
    <div className="contentscript-container">
      <div className="content-container">
        <div className="block-icon">🚫</div>
        <h1>Site Blocked</h1>
        <div className="custom-message">
          <p>{customMessage}</p>
        </div>
        <div className="motivational-text">
          Stay focused on what matters most.
        </div>
      </div>
    </div>
  );
};
