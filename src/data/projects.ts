export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  screenshot: string;
  githubUrl?: string;
  liveUrl?: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "brain",
    name: "Brain",
    tagline: "AI-powered personal assistant",
    description:
      "A single-user AI assistant that orchestrates your calendar, tasks, email, and habits through natural conversation. Uses a three-tier model architecture with Claude as the reasoning engine.",
    techStack: ["Python", "FastAPI", "Claude API", "SQLite", "APScheduler"],
    features: [
      "Voice and chat interface",
      "Google Calendar/Gmail integration",
      "Todoist task management",
      "Daily briefings and habit nudges",
      "Push notifications via ntfy",
    ],
    screenshot: "/images/project-screenshots/brain.png",
    color: "#7B68EE",
  },
  {
    id: "mmolb-stats",
    name: "MMOLB Stats",
    tagline: "Analytics for massively multiplayer online baseball",
    description:
      "A comprehensive statistics and analytics platform for tracking player performance, team standings, and historical trends in MMOLB.",
    techStack: ["Python", "Streamlit", "Pandas", "Plotly"],
    features: [
      "Real-time stat tracking",
      "Historical data analysis",
      "Interactive visualizations",
      "Player comparison tools",
    ],
    screenshot: "/images/project-screenshots/mmolb.png",
    githubUrl: "https://github.com/drake/mmolb-stats",
    color: "#00CED1",
  },
  {
    id: "castle-td",
    name: "Castle TD",
    tagline: "A fantasy tower defense game",
    description:
      "A tower defense game built in Godot with hand-crafted levels, multiple tower types, and wave-based enemy progression.",
    techStack: ["Godot 4", "GDScript", "Aseprite"],
    features: [
      "Multiple tower types with upgrades",
      "Wave-based enemy AI",
      "Resource management",
      "Hand-designed maps",
    ],
    screenshot: "/images/project-screenshots/castle-td.png",
    color: "#FF6347",
  },
  {
    id: "legal-brief-drafter",
    name: "Legal Brief Drafter",
    tagline: "AI-assisted legal document generation",
    description:
      "A Streamlit application that assists in drafting legal briefs using AI, with citation validation, adversarial review, and template-based generation.",
    techStack: ["Python", "Streamlit", "Claude API", "SQLite"],
    features: [
      "Case law citation matching",
      "Adversarial review pipeline",
      "Template-based brief generation",
      "Deep validation checks",
    ],
    screenshot: "/images/project-screenshots/legal-brief.png",
    color: "#DAA520",
  },
  {
    id: "what-to-play",
    name: "What To Play Bot",
    tagline: "Discord bot for group game decisions",
    description:
      "A Discord bot that helps friend groups decide what game to play together using voting, preferences, and library matching.",
    techStack: ["Python", "Discord.py"],
    features: [
      "Game voting system",
      "Player preference tracking",
      "Library overlap detection",
      "Quick poll creation",
    ],
    screenshot: "/images/project-screenshots/what-to-play.png",
    githubUrl: "https://github.com/drake/what-to-play",
    color: "#9370DB",
  },
  {
    id: "soccer-planner",
    name: "Soccer Practice Planner",
    tagline: "Youth soccer practice planning tool",
    description:
      "A web app for planning and organizing youth soccer practice sessions with drill libraries, time management, and season planning.",
    techStack: ["Python", "Streamlit"],
    features: [
      "Drill library with diagrams",
      "Session time management",
      "Season-long progression",
      "Print-friendly plans",
    ],
    screenshot: "/images/project-screenshots/soccer.png",
    color: "#32CD32",
  },
  {
    id: "drakeforge",
    name: "DrakeForge",
    tagline: "This very website",
    description:
      "A mystical lake-themed portfolio site with interactive water physics, floating lily pad project cards, and ambient particle effects.",
    techStack: ["Next.js", "React Three Fiber", "Three.js", "Framer Motion", "GLSL"],
    features: [
      "Real-time water ripple physics",
      "Interactive 3D lily pads",
      "Firefly particle system",
      "Ambient soundscape",
    ],
    screenshot: "/images/project-screenshots/drakeforge.png",
    liveUrl: "https://drakeforge.quest",
    color: "#00BFFF",
  },
  {
    id: "tabs-betting",
    name: "Tabs Betting Bot",
    tagline: "Discord bot for friendly wager tracking",
    description:
      "A Discord bot for tracking friendly bets and wagers within a server, with leaderboards, bet resolution, and history.",
    techStack: ["Python", "Discord.py"],
    features: [
      "Bet creation and tracking",
      "Automated resolution",
      "Leaderboards",
      "Bet history and stats",
    ],
    screenshot: "/images/project-screenshots/tabs.png",
    githubUrl: "https://github.com/drake/tabs-betting",
    color: "#FF69B4",
  },
];
