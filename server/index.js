import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) =>
  res.json({ token: "mock_token", success: true }),
);
app.post("/register", (req, res) => res.json({ success: true }));
app.post("/upload-image", (req, res) => res.json({ analysisId: "ana_001" }));
app.get("/analysis-result", (req, res) =>
  res.json({
    name: "Brihadeeswara Temple",
    location: "Thanjavur, Tamil Nadu",
    style: "Dravidian",
    confidence: 0.94,
    features: ["Gopuram", "Mandapa", "Temple Tower"],
    probabilities: {
      Dravidian: 94,
      Chola: 88,
      Hoysala: 32,
      Vijayanagara: 20,
      Nayaka: 15,
    },
  }),
);
app.get("/history", (req, res) => res.json([]));

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
