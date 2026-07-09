import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.post("/api/optimize-crowd", async (req, res) => {
  try {
    const { gates, eventName, totalAttendance } = req.body;

    const prompt = `Analyze the current stadium crowd telemetry for ${eventName || "Main Event"} (Total Attendance: ${totalAttendance || 75000}):
${JSON.stringify(gates, null, 2)}

Provide a comprehensive load-balancing operations analysis, tactical redistribution actions for gate operators, and official multilingual PA system announcements (English, Spanish, French) directing crowd flow safely and efficiently.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are OpsStream AI, an elite stadium crowd management and tactical load-balancing engine. You analyze gate throughput, capacity saturation, and wait times to issue immediate operational directives and public address announcements.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              structuralAnalysis: {
                type: Type.STRING,
                description: "High-level operations summary and bottleneck identification across the stadium gates.",
              },
              actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    gateId: { type: Type.STRING, description: "Gate ID e.g. Gate A" },
                    action: { type: Type.STRING, description: "Specific tactical command e.g. Redirect 30% inflow to Concourse B" },
                    priority: { type: Type.STRING, description: "CRITICAL, WARNING, or ROUTINE" },
                    reason: { type: Type.STRING, description: "Operational justification based on throughput and wait time" },
                  },
                  required: ["gateId", "action", "priority", "reason"],
                },
                description: "Actionable load balancing directives.",
              },
              multilingualAlerts: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING, description: "Public address announcement script in English." },
                  spanish: { type: Type.STRING, description: "Public address announcement script in Spanish." },
                  french: { type: Type.STRING, description: "Public address announcement script in French." },
                },
                required: ["english", "spanish", "french"],
                description: "Public address system announcements in 3 languages.",
              },
            },
            required: ["structuralAnalysis", "actions", "multilingualAlerts"],
          },
        },
      });
    } catch (apiErr: any) {
      console.warn("Primary gemini-2.5-flash attempt failed, trying fallback...", apiErr);
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are OpsStream AI, an elite stadium crowd management and tactical load-balancing engine.",
          responseMimeType: "application/json",
        },
      });
    }

    const rawText = response.text || "{}";
    const parsedData = JSON.parse(rawText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini optimization error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate crowd optimization analysis.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OpsStream AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
