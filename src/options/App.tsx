import "../utils/style-utils/globals.css";
import "./options.css";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { appSettingsStorage } from "app/background/controllers/storageController";

export const App = () => {
  const [customMessage, setCustomMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");

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

  const handleSave = async () => {
    setIsSaving(true);
    setSavedStatus("");
    try {
      await appSettingsStorage.set("customBlockMessage", customMessage);
      setSavedStatus("Saved successfully!");
      setTimeout(() => setSavedStatus(""), 3000);
    } catch (error) {
      console.error("Failed to save custom message:", error);
      setSavedStatus("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Options</h1>
        <p className="text-muted-foreground mb-8">
          Customize your blocking experience
        </p>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customMessage" className="text-lg mb-2 block">
                Custom Block Message
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                This message will be displayed when a website is blocked. Use it
                to remind yourself of your goals or motivate yourself to stay
                focused.
              </p>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom block message..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Message"}
              </Button>
              {savedStatus && (
                <span
                  className={`text-sm ${
                    savedStatus.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {savedStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
