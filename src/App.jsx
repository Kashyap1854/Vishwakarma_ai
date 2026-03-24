import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ANALYSIS = {
  id: "ana_001",
  name: "Brihadeeswara Temple",
  location: "Thanjavur, Tamil Nadu",
  style: "Dravidian",
  period: "11th Century CE",
  confidence: 0.94,
  description:
    "The Brihadeeswara Temple, also known as the Big Temple, is a Hindu temple dedicated to Shiva located in Thanjavur, Tamil Nadu, India. It is one of the largest South Indian temples and an exemplary example of a fully realised Dravidian architecture.",
  features: [
    "Gopuram",
    "Mandapa",
    "Vimana Tower",
    "Nandi Pavilion",
    "Circumambulatory Path",
  ],
  probabilities: {
    Dravidian: 94,
    Chola: 88,
    Hoysala: 32,
    Vijayanagara: 20,
    Nayaka: 15,
  },
  sources: [
    {
      title: "UNESCO World Heritage – Great Living Chola Temples",
      description:
        "Official UNESCO documentation on the architectural significance of Chola temple architecture.",
      url: "https://whc.unesco.org/en/list/250",
      domain: "whc.unesco.org",
    },
    {
      title: "Archaeological Survey of India",
      description:
        "Comprehensive survey of Dravidian architectural features and historical context.",
      url: "https://asi.nic.in",
      domain: "asi.nic.in",
    },
    {
      title: "Tamil Nadu Tourism – Brihadeeswara",
      description:
        "Regional tourism authority documentation on temple history, iconography and visiting info.",
      url: "https://www.tamilnadutourism.tn.gov.in",
      domain: "tamilnadutourism.tn.gov.in",
    },
  ],
  galleryImages: [
    { caption: "Main Vimana Tower – Eastern Facade" },
    { caption: "Gopuram Gate – South Entrance" },
    { caption: "Nandi Mandapa – Sacred Bull Pavilion" },
    { caption: "Inner Sanctum Corridor" },
    { caption: "Stone Carvings Detail – West Wall" },
  ],
};

const MOCK_HISTORY = [
  {
    id: 1,
    name: "Brihadeeswara Temple",
    style: "Dravidian",
    date: "2024-03-10",
    confidence: 94,
  },
  {
    id: 2,
    name: "Meenakshi Amman Temple",
    style: "Nayaka",
    date: "2024-03-08",
    confidence: 89,
  },
  {
    id: 3,
    name: "Hampi Virupaksha Temple",
    style: "Vijayanagara",
    date: "2024-03-05",
    confidence: 91,
  },
  {
    id: 4,
    name: "Hoysaleswara Temple",
    style: "Hoysala",
    date: "2024-03-01",
    confidence: 87,
  },
];

// ─── ROUTER ──────────────────────────────────────────────────────────────────
function useRouter() {
  const [page, setPage] = useState("landing");
  const navigate = (p) => setPage(p);
  return { page, navigate };
}

// ─── ICONS (SVG inline) ───────────────────────────────────────────────────────
const Icon = {
  Menu: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Upload: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Search: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  History: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Image: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ExternalLink: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  MapPin: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Star: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Zap: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Brain: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  LogOut: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  ),
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg-deep: #050810;
    --bg-mid: #080d1a;
    --bg-card: #0c1222;
    --bg-hover: #111828;
    --border: #1a2540;
    --border-bright: #2a3a5c;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --gold-dim: #8a6e2f;
    --amber: #d97706;
    --teal: #0d9488;
    --teal-dim: #0a5c56;
    --text-primary: #e8e4d8;
    --text-secondary: #8a9bb5;
    --text-dim: #4a5568;
    --accent-blue: #3b82f6;
    --accent-red: #ef4444;
  }

  body { background: var(--bg-deep); color: var(--text-primary); font-family: 'Crimson Pro', Georgia, serif; min-height: 100vh; overflow-x: hidden; }

  .font-display { font-family: 'Cinzel', serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-dim); }

  /* Animations */
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.3); } 50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes bar-grow { from { width: 0; } to { width: var(--bar-width); } }
  @keyframes glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  .animate-fadeInUp { animation: fadeInUp 0.7s ease forwards; }
  .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }

  /* Noise texture overlay */
  .noise::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.04;
  }

  /* Gold gradient text */
  .text-gold-gradient {
    background: linear-gradient(135deg, #c9a84c 0%, #e8c97a 40%, #c9a84c 70%, #8a6e2f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% auto;
    animation: shimmer 4s linear infinite;
  }

  /* Grid background */
  .grid-bg {
    background-image: 
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
  }

  /* Cards */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { border-color: var(--border-bright); }
  .card-gold { border-color: var(--gold-dim); }
  .card-gold:hover { border-color: var(--gold); box-shadow: 0 0 20px rgba(201,168,76,0.08); }

  /* Buttons */
  .btn-gold {
    background: linear-gradient(135deg, #c9a84c, #8a6e2f);
    color: #050810;
    font-family: 'Cinzel', serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
  }
  .btn-gold:hover { background: linear-gradient(135deg, #e8c97a, #c9a84c); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.3); }

  .btn-outline {
    background: transparent;
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    border: 1px solid var(--gold-dim);
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
  }
  .btn-outline:hover { border-color: var(--gold); background: rgba(201,168,76,0.05); box-shadow: 0 0 20px rgba(201,168,76,0.1); }

  /* Input */
  .input-field {
    background: var(--bg-mid);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: 'Crimson Pro', serif;
    font-size: 16px;
    padding: 12px 16px;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .input-field:focus { border-color: var(--gold-dim); box-shadow: 0 0 0 2px rgba(201,168,76,0.1); }
  .input-field::placeholder { color: var(--text-dim); }

  /* Sidebar transition */
  .sidebar { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }

  /* Analysis bar */
  .analysis-bar {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--gold-dim), var(--gold));
    animation: bar-grow 1s ease forwards;
  }

  /* Glow dot */
  .glow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 8px var(--gold);
    animation: glow-pulse 2s ease-in-out infinite;
    display: inline-block;
  }
`;

// ─── LAYOUT COMPONENTS ────────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div style={{ width: 32, height: 32, position: "relative" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "1.5px solid #c9a84c",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              background: "linear-gradient(135deg, #c9a84c, #8a6e2f)",
              borderRadius: "50%",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) rotate(45deg)",
            width: 22,
            height: 22,
            border: "1px solid rgba(201,168,76,0.4)",
            borderRadius: 2,
          }}
        />
      </div>
      <span
        className="font-display"
        style={{ fontSize: 15, letterSpacing: "0.1em", color: "#c9a84c" }}
      >
        VISHWAKARMA AI
      </span>
    </button>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ navigate }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)" }}>
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:
            scrollY > 40 ? "1px solid var(--border)" : "1px solid transparent",
          background: scrollY > 40 ? "rgba(5,8,16,0.95)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(12px)" : "none",
          transition: "all 0.3s",
        }}
      >
        <Logo onClick={() => {}} />
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn-outline"
            style={{ padding: "8px 20px", fontSize: 13 }}
            onClick={() => navigate("about")}
          >
            About
          </button>
          <button
            className="btn-gold"
            style={{ padding: "8px 20px", fontSize: 13 }}
            onClick={() => navigate("login")}
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "120px 40px 80px",
        }}
      >
        {/* Grid bg */}
        <div
          className="grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.3 }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Decorative rings */}
        <div
          className="animate-spin-slow"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 500,
            border: "1px solid rgba(201,168,76,0.06)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            border: "1px solid rgba(201,168,76,0.03)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            maxWidth: 800,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 32,
            }}
          >
            <span className="glow-dot" />
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--gold)",
                letterSpacing: "0.15em",
              }}
            >
              ARCHITECTURAL INTELLIGENCE SYSTEM v2.4
            </span>
          </div>

          <h1
            className="font-display animate-fadeInUp"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="text-gold-gradient">Decode the Sacred</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>
              Architecture of
            </span>
            <br />
            <span style={{ color: "var(--text-secondary)" }}>South India</span>
          </h1>

          <p
            className="animate-fadeInUp"
            style={{
              fontSize: 20,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: 560,
              margin: "0 auto 48px",
              animationDelay: "0.15s",
            }}
          >
            AI-powered analysis of Dravidian, Chola, Hoysala, Vijayanagara, and
            Nayaka architectural styles — from a single photograph.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-gold animate-fadeInUp"
              style={{
                padding: "14px 36px",
                fontSize: 14,
                animationDelay: "0.3s",
              }}
              onClick={() => navigate("register")}
            >
              Get Started
            </button>
            <button
              className="btn-outline animate-fadeInUp"
              style={{
                padding: "14px 36px",
                fontSize: 14,
                animationDelay: "0.4s",
              }}
              onClick={() => navigate("about")}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.5,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--text-secondary)",
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, var(--gold-dim), transparent)",
            }}
          />
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--gold)",
              letterSpacing: "0.2em",
              marginBottom: 16,
            }}
          >
            PROCESS
          </div>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: 16 }}
          >
            How It Works
          </h2>
          <div
            style={{
              width: 60,
              height: 1,
              background: "var(--gold-dim)",
              margin: "0 auto",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 0,
            alignItems: "center",
          }}
        >
          {[
            {
              num: "01",
              icon: <Icon.Zap />,
              title: "Login",
              desc: "Create your account or sign in to access the analysis platform.",
            },
            {
              num: "02",
              icon: <Icon.Upload />,
              title: "Upload Image",
              desc: "Drag and drop a photograph of any South Indian temple or building.",
            },
            {
              num: "03",
              icon: <Icon.Brain />,
              title: "View Analysis",
              desc: "Receive detailed AI-powered analysis with style probabilities and architectural features.",
            },
          ].map((step, i) => (
            <>
              <div
                key={i}
                className="card card-gold"
                style={{
                  padding: "32px 28px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid var(--gold-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "var(--gold)",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: "var(--gold-dim)",
                    letterSpacing: "0.2em",
                    marginBottom: 12,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-display"
                  style={{ fontSize: 18, marginBottom: 12 }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
              {i < 2 && (
                <div
                  key={`sep-${i}`}
                  style={{
                    padding: "0 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background:
                        "linear-gradient(to right, var(--gold-dim), transparent)",
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--gold-dim)",
                    }}
                  />
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background:
                        "linear-gradient(to left, var(--gold-dim), transparent)",
                    }}
                  />
                </div>
              )}
            </>
          ))}
        </div>
      </section>

      {/* Styles Showcase */}
      <section
        style={{
          padding: "80px 40px",
          background: "var(--bg-mid)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--gold)",
                letterSpacing: "0.2em",
                marginBottom: 16,
              }}
            >
              DETECTABLE STYLES
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              Five Great Traditions
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 16,
            }}
          >
            {["Dravidian", "Chola", "Hoysala", "Vijayanagara", "Nayaka"].map(
              (s, i) => (
                <div
                  key={s}
                  style={{
                    textAlign: "center",
                    padding: "24px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-card)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `hsl(${40 + i * 15}, ${60 - i * 5}%, ${25 + i * 3}%)`,
                      border: "1px solid var(--gold-dim)",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="font-display"
                      style={{ fontSize: 14, color: "var(--gold)" }}
                    >
                      {s[0]}
                    </span>
                  </div>
                  <div
                    className="font-display"
                    style={{
                      fontSize: 13,
                      letterSpacing: "0.05em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {s}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "48px 40px 32px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <Logo onClick={() => {}} />
          <div style={{ display: "flex", gap: 32 }}>
            <button
              onClick={() => navigate("about")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "'Crimson Pro', serif",
              }}
            >
              About Us
            </button>
            <button
              onClick={() => navigate("contact")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "'Crimson Pro', serif",
              }}
            >
              Contact Us
            </button>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            © 2024 VISHWAKARMA AI
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function AuthPage({ mode, navigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("dashboard");
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 24,
      }}
    >
      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.2 }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 400,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "absolute", top: 24, left: 40 }}>
        <Logo onClick={() => navigate("landing")} />
      </div>

      <div
        className="card card-gold animate-fadeInUp"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "48px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--gold)",
              letterSpacing: "0.2em",
              marginBottom: 12,
            }}
          >
            {isLogin ? "WELCOME BACK" : "JOIN THE PLATFORM"}
          </div>
          <h2 className="font-display" style={{ fontSize: 28 }}>
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginBottom: 8,
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.1em",
                }}
              >
                FULL NAME
              </label>
              <input
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 8,
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.1em",
              }}
            >
              EMAIL
            </label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 8,
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.1em",
              }}
            >
              PASSWORD
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            className="btn-gold"
            style={{
              padding: "14px",
              fontSize: 14,
              marginTop: 8,
              width: "100%",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 15,
            color: "var(--text-secondary)",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => navigate(isLogin ? "register" : "login")}
            style={{
              background: "none",
              border: "none",
              color: "var(--gold)",
              cursor: "pointer",
              fontSize: 15,
              fontFamily: "'Crimson Pro', serif",
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({
  expanded,
  setExpanded,
  navigate,
  history,
  onSelectHistory,
}) {
  const items = [
    { icon: <Icon.Plus />, label: "New Search", action: "upload" },
    { icon: <Icon.Image />, label: "Upload Image", action: "upload" },
    { icon: <Icon.History />, label: "Search History", action: "history" },
  ];

  return (
    <div
      className="sidebar"
      style={{
        width: expanded ? 240 : 60,
        background: "var(--bg-mid)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Toggle */}
      <div
        style={{
          padding: "16px 12px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
        }}
      >
        {expanded && (
          <span
            className="font-display"
            style={{
              fontSize: 12,
              color: "var(--gold)",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            MENU
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            display: "flex",
          }}
        >
          {expanded ? <Icon.X /> : <Icon.Menu />}
        </button>
      </div>

      {/* Items */}
      <div style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              navigate(item.action);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 8px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              borderRadius: 6,
              textAlign: "left",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {expanded && <span style={{ fontSize: 14 }}>{item.label}</span>}
          </button>
        ))}

        {expanded && history.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                color: "var(--text-dim)",
                letterSpacing: "0.15em",
                padding: "0 8px",
                marginBottom: 8,
              }}
            >
              RECENT
            </div>
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => onSelectHistory(h)}
                style={{
                  width: "100%",
                  padding: "8px 8px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 6,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {h.name}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    marginTop: 2,
                  }}
                >
                  {h.style} · {h.confidence}%
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div
        style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => navigate("landing")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 8px",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            borderRadius: 6,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span style={{ flexShrink: 0 }}>
            <Icon.LogOut />
          </span>
          {expanded && <span style={{ fontSize: 14 }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD UPLOAD ─────────────────────────────────────────────────────────
function DashboardUpload({ navigate }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("analysis");
    }, 2000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        navigate={navigate}
        history={MOCK_HISTORY}
        onSelectHistory={() => navigate("analysis")}
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div
          style={{
            padding: "16px 32px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-mid)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{ fontSize: 20, letterSpacing: "0.05em" }}
            >
              Analysis Dashboard
            </h1>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                marginTop: 2,
              }}
            >
              Upload architectural imagery for AI analysis
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="glow-dot" />
            <span
              className="font-mono"
              style={{ fontSize: 11, color: "var(--gold)" }}
            >
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 32px" }}>
          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => !preview && fileRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? "var(--gold)" : preview ? "var(--gold-dim)" : "var(--border-bright)"}`,
              borderRadius: 12,
              padding: preview ? 0 : "80px 40px",
              textAlign: "center",
              cursor: preview ? "default" : "pointer",
              background: dragOver ? "rgba(201,168,76,0.04)" : "var(--bg-card)",
              transition: "all 0.2s",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {preview ? (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--bg-mid)",
                  }}
                >
                  <span
                    style={{ fontSize: 14, color: "var(--text-secondary)" }}
                  >
                    Image loaded — ready for analysis
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                    }}
                    style={{
                      background: "none",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid var(--gold-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "var(--gold)",
                  }}
                >
                  <Icon.Upload />
                </div>
                <h3
                  className="font-display"
                  style={{ fontSize: 20, marginBottom: 12 }}
                >
                  Drop Your Image Here
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 16,
                    marginBottom: 24,
                  }}
                >
                  Drag and drop a temple or building photograph, or click to
                  browse
                </p>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: "var(--text-dim)",
                    letterSpacing: "0.1em",
                  }}
                >
                  SUPPORTS: JPG · PNG · WEBP · HEIC
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          {preview && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button
                className="btn-gold"
                style={{
                  padding: "16px 64px",
                  fontSize: 14,
                  opacity: loading ? 0.8 : 1,
                }}
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(0,0,0,0.2)",
                        borderTopColor: "#050810",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin-slow 0.8s linear infinite",
                      }}
                    />
                    Analyzing Architecture...
                  </span>
                ) : (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon.Search /> Analyze Building
                  </span>
                )}
              </button>
            </div>
          )}

          {/* History cards */}
          <div style={{ marginTop: 64 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 18, letterSpacing: "0.05em" }}
              >
                Recent Analyses
              </h2>
              <span
                className="font-mono"
                style={{ fontSize: 11, color: "var(--text-dim)" }}
              >
                {MOCK_HISTORY.length} RESULTS
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {MOCK_HISTORY.map((h) => (
                <button
                  key={h.id}
                  className="card"
                  style={{
                    padding: "20px",
                    textAlign: "left",
                    cursor: "pointer",
                    border: "1px solid var(--border)",
                    background: "none",
                    width: "100%",
                    transition: "all 0.15s",
                  }}
                  onClick={() => navigate("analysis")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold-dim)";
                    e.currentTarget.style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          fontFamily: "'Cinzel', serif",
                        }}
                      >
                        {h.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          marginTop: 4,
                        }}
                      >
                        {h.style} Architecture
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid var(--gold-dim)",
                        borderRadius: 4,
                        padding: "3px 8px",
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{ fontSize: 12, color: "var(--gold)" }}
                      >
                        {h.confidence}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: 11, color: "var(--text-dim)" }}
                  >
                    {h.date}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYSIS PAGE ────────────────────────────────────────────────────────────
function AnalysisPage({ navigate }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const data = MOCK_ANALYSIS;

  const tabs = ["details", "images", "analysis", "sources"];

  // Temple color palettes for gallery cards
  const palettes = ["#1a1008", "#081818", "#100a18", "#0a1208", "#180808"];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        navigate={navigate}
        history={MOCK_HISTORY}
        onSelectHistory={() => {}}
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top Nav */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(5,8,16,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => navigate("dashboard")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 14,
                padding: "4px 8px",
              }}
            >
              <Icon.ChevronLeft /> Back
            </button>
            <span style={{ color: "var(--border-bright)" }}>·</span>
            <span
              className="font-mono"
              style={{ fontSize: 12, color: "var(--text-secondary)" }}
            >
              {data.name}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  background:
                    activeTab === tab ? "rgba(201,168,76,0.1)" : "none",
                  border:
                    activeTab === tab
                      ? "1px solid var(--gold-dim)"
                      : "1px solid transparent",
                  borderRadius: 4,
                  color:
                    activeTab === tab ? "var(--gold)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.08em",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px" }}>
          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <div className="animate-fadeIn">
              {/* Header card */}
              <div
                className="card card-gold"
                style={{
                  padding: "36px 40px",
                  marginBottom: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 200,
                    height: 200,
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 24,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--gold)",
                        letterSpacing: "0.2em",
                        marginBottom: 12,
                      }}
                    >
                      ARCHITECTURAL ANALYSIS RESULT
                    </div>
                    <h1
                      className="font-display"
                      style={{
                        fontSize: "clamp(24px, 4vw, 40px)",
                        marginBottom: 16,
                        lineHeight: 1.2,
                      }}
                    >
                      {data.name}
                    </h1>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      <Icon.MapPin />
                      <span
                        style={{ fontSize: 15, color: "var(--text-secondary)" }}
                      >
                        {data.location}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(201,168,76,0.1)",
                          border: "1px solid var(--gold-dim)",
                          borderRadius: 4,
                          padding: "4px 12px",
                          fontSize: 13,
                          color: "var(--gold)",
                          fontFamily: "'Cinzel', serif",
                        }}
                      >
                        {data.style}
                      </span>
                      <span
                        style={{
                          background: "rgba(13,148,136,0.1)",
                          border: "1px solid var(--teal-dim)",
                          borderRadius: 4,
                          padding: "4px 12px",
                          fontSize: 13,
                          color: "var(--teal)",
                          fontFamily: "'Cinzel', serif",
                        }}
                      >
                        {data.period}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 28px",
                      background: "rgba(201,168,76,0.05)",
                      border: "1px solid var(--gold-dim)",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      className="font-display text-gold-gradient"
                      style={{ fontSize: 48, lineHeight: 1 }}
                    >
                      {Math.round(data.confidence * 100)}
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        letterSpacing: "0.15em",
                        marginTop: 4,
                      }}
                    >
                      CONFIDENCE %
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 17,
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
                    {data.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="card" style={{ padding: "28px 32px" }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 16,
                    letterSpacing: "0.08em",
                    marginBottom: 20,
                    color: "var(--text-secondary)",
                  }}
                >
                  DETECTED FEATURES
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {data.features.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--bg-mid)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 16px",
                      }}
                    >
                      <span
                        className="glow-dot"
                        style={{ width: 4, height: 4 }}
                      />
                      <span
                        style={{ fontSize: 14, color: "var(--text-primary)" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IMAGES TAB */}
          {activeTab === "images" && (
            <div className="animate-fadeIn">
              <h2
                className="font-display"
                style={{ fontSize: 22, marginBottom: 32 }}
              >
                Image Gallery
              </h2>
              {/* Main carousel */}
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    height: 320,
                    background: palettes[carouselIdx],
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div style={{ textAlign: "center", padding: 32 }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid var(--gold-dim)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        color: "var(--gold-dim)",
                      }}
                    >
                      <Icon.Image />
                    </div>
                    <div
                      className="font-display"
                      style={{ fontSize: 16, color: "var(--text-secondary)" }}
                    >
                      {data.galleryImages[carouselIdx].caption}
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        marginTop: 8,
                      }}
                    >
                      Image {carouselIdx + 1} of {data.galleryImages.length}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(5,8,16,0.8)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon.ChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setCarouselIdx(
                      Math.min(data.galleryImages.length - 1, carouselIdx + 1),
                    )
                  }
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(5,8,16,0.8)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon.ChevronRight />
                </button>
              </div>
              {/* Thumbnails */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  overflowX: "auto",
                  paddingBottom: 4,
                }}
              >
                {data.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    style={{
                      flexShrink: 0,
                      width: 100,
                      height: 70,
                      background: palettes[i],
                      borderRadius: 8,
                      border: `2px solid ${i === carouselIdx ? "var(--gold)" : "var(--border)"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        i === carouselIdx ? "var(--gold)" : "var(--text-dim)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <Icon.Image />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ANALYSIS TAB */}
          {activeTab === "analysis" && (
            <div className="animate-fadeIn">
              <h2
                className="font-display"
                style={{ fontSize: 22, marginBottom: 32 }}
              >
                Style Probability Analysis
              </h2>

              {/* Bar chart */}
              <div className="card" style={{ padding: "32px" }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 15,
                    letterSpacing: "0.08em",
                    marginBottom: 28,
                    color: "var(--text-secondary)",
                  }}
                >
                  ARCHITECTURAL STYLE DISTRIBUTION
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {Object.entries(data.probabilities)
                    .sort((a, b) => b[1] - a[1])
                    .map(([style, pct], i) => (
                      <div key={style}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            className="font-display"
                            style={{ fontSize: 14 }}
                          >
                            {style}
                          </span>
                          <span
                            className="font-mono"
                            style={{ fontSize: 13, color: "var(--gold)" }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 8,
                            background: "var(--bg-mid)",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, hsl(${40 - i * 5}, 60%, 30%), hsl(${45 - i * 5}, 70%, 50%))`,
                              borderRadius: 4,
                              transition:
                                "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                {[
                  { label: "Primary Style", value: data.style },
                  {
                    label: "Confidence",
                    value: `${Math.round(data.confidence * 100)}%`,
                  },
                  { label: "Features Detected", value: data.features.length },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="card"
                    style={{ padding: "24px", textAlign: "center" }}
                  >
                    <div
                      className="font-display text-gold-gradient"
                      style={{ fontSize: 32, marginBottom: 8 }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {s.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOURCES TAB */}
          {activeTab === "sources" && (
            <div className="animate-fadeIn">
              <h2
                className="font-display"
                style={{ fontSize: 22, marginBottom: 32 }}
              >
                Research Sources
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {data.sources.map((s, i) => (
                  <div
                    key={i}
                    className="card card-gold"
                    style={{
                      padding: "24px 28px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: "var(--bg-mid)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "var(--gold-dim)",
                        fontSize: 18,
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <h3 className="font-display" style={{ fontSize: 16 }}>
                          {s.title}
                        </h3>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--teal)",
                            fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                            textDecoration: "none",
                          }}
                        >
                          {s.domain} <Icon.ExternalLink />
                        </a>
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                        }}
                      >
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ navigate }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "16px 40px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-mid)",
        }}
      >
        <Logo onClick={() => navigate("landing")} />
        <button
          className="btn-gold"
          style={{ padding: "8px 20px", fontSize: 13 }}
          onClick={() => navigate("login")}
        >
          Get Started
        </button>
      </header>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 40px" }}>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--gold)",
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          ABOUT
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            marginBottom: 32,
            lineHeight: 1.2,
          }}
        >
          Preserving Heritage
          <br />
          <span className="text-gold-gradient">Through Intelligence</span>
        </h1>
        <div
          style={{
            width: 60,
            height: 1,
            background: "var(--gold-dim)",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            fontSize: 18,
            color: "var(--text-secondary)",
            lineHeight: 1.8,
          }}
        >
          <p>
            Vishwakarma AI is a research-grade platform dedicated to the
            automated recognition and analysis of South Indian architectural
            traditions. Named after Vishwakarma — the divine architect of the
            gods — our system brings computational intelligence to bear on the
            rich visual vocabulary of temple architecture.
          </p>
          <p>
            The platform currently identifies five major South Indian
            architectural traditions: Dravidian, Chola, Hoysala, Vijayanagara,
            and Nayaka. Each tradition carries centuries of artistic, religious,
            and political history encoded in stone.
          </p>
          <p>
            Our mission is to democratize access to architectural knowledge —
            making expert-level identification available to researchers,
            heritage advocates, tourists, and curious minds alike.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 56,
          }}
        >
          {[
            { num: "5", label: "Architectural Traditions" },
            { num: "94%", label: "Analysis Accuracy" },
            { num: "1000+", label: "Training Images" },
            { num: "2024", label: "Platform Launch" },
          ].map((s) => (
            <div
              key={s.label}
              className="card card-gold"
              style={{ padding: "28px", textAlign: "center" }}
            >
              <div
                className="font-display text-gold-gradient"
                style={{ fontSize: 40, marginBottom: 8 }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage({ navigate }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "16px 40px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-mid)",
        }}
      >
        <Logo onClick={() => navigate("landing")} />
        <button
          className="btn-gold"
          style={{ padding: "8px 20px", fontSize: 13 }}
          onClick={() => navigate("login")}
        >
          Get Started
        </button>
      </header>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 40px" }}>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--gold)",
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          CONTACT
        </div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: 16 }}
        >
          Get In Touch
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            marginBottom: 48,
            lineHeight: 1.7,
          }}
        >
          Have questions, feedback, or collaboration proposals? We'd love to
          hear from you.
        </p>

        {sent ? (
          <div
            className="card card-gold animate-fadeIn"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid var(--gold-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: "var(--gold)",
              }}
            >
              <Icon.Mail />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: 22, marginBottom: 12 }}
            >
              Message Sent
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              We'll respond within 2 business days.
            </p>
          </div>
        ) : (
          <div className="card card-gold" style={{ padding: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginBottom: 8,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  NAME
                </label>
                <input
                  className="input-field"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginBottom: 8,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  EMAIL
                </label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginBottom: 8,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  MESSAGE
                </label>
                <textarea
                  className="input-field"
                  placeholder="Your message..."
                  rows={5}
                  style={{ resize: "vertical" }}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>
              <button
                className="btn-gold"
                style={{ padding: "14px", fontSize: 14 }}
                onClick={() => setSent(true)}
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { page, navigate } = useRouter();

  return (
    <>
      <style>{styles}</style>
      <div className="noise">
        {page === "landing" && <LandingPage navigate={navigate} />}
        {page === "login" && <AuthPage mode="login" navigate={navigate} />}
        {page === "register" && (
          <AuthPage mode="register" navigate={navigate} />
        )}
        {page === "dashboard" && <DashboardUpload navigate={navigate} />}
        {page === "upload" && <DashboardUpload navigate={navigate} />}
        {page === "analysis" && <AnalysisPage navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage navigate={navigate} />}
      </div>
    </>
  );
}
