export const defaultPortfolioData = {
  personal: {
    brandMain: "Shanmukh",
    brandAccent: "Portfolio",
    name: "Shanmukha Anjaneya Reddy Nallamilli",
    role: "B.Sc. Artificial Intelligence Student & Aspiring Developer",
    tagline:
      "Building scalable full-stack web applications, AI-powered tools, and cloud-backed portals using React, Python, and modern serverless infrastructure.",
    location: "Andhra Pradesh, India",
    email: "shanmukhaanjaneyareddy@gmail.com",
    defaultResumeUrl: "https://drive.google.com/",
    socials: {
      github: "https://github.com/shanmukhaanjaneyareddy",
      linkedin:
        "https://www.linkedin.com/in/shanmukha-anjaneya-reddy-nallamilli-044015380/",
    },
  },

  projects: [
    {
      id: 1,
      title: "ADCRJY-365 (College Portal)",
      category: "Full-Stack",
      featured: true,
      description:
        "Led a 5-member development team to architect a hybrid storage pipeline (Supabase + Cloudflare R2) handling institutional media, role-based admin controls, and dynamic folder access for students and faculty.",
      tech: ["React", "Vite", "Supabase", "Cloudflare R2", "Vercel"],
      liveUrl: "https://adcrjy-365.vercel.app/",
      githubUrl: "https://github.com/shanmukhaanjaneyareddy",
    },
    {
      id: 2,
      title: "Interview AI",
      category: "AI & Web App",
      featured: false,
      description:
        "AI-powered interview preparation platform powered by local LLM inference to deliver real-time scoring on technical accuracy and communication skills.",
      tech: ["React", "Ollama", "Python", "Web App", "Vercel"],
      liveUrl: "https://interviewai-practice.vercel.app/",
      githubUrl: "https://github.com/shanmukhaanjaneyareddy",
    },
    {
      id: 3,
      title: "Personal Developer Portfolio",
      category: "Frontend",
      featured: false,
      description:
        "Modern, scalable portfolio built with modular React components, Tailwind CSS glassmorphism, hidden admin CMS controls, and Framer Motion animations.",
      tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      liveUrl: "https://shanmukh-nallamilli-portfolio.vercel.app/",
      githubUrl: "https://github.com/shanmukhaanjaneyareddy",
    },
  ],

  skills: [
    {
      id: 1,
      category: "Languages",
      items: ["Python", "C", "Java"],
    },
    {
      id: 2,
      category: "Frontend & Motion",
      items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Responsive UI"],
    },
    {
      id: 3,
      category: "Backend, Cloud & AI",
      items: ["Supabase", "Cloudflare R2", "Ollama", "Git & GitHub", "Vercel"],
    },
  ],

  contact: {
    eyebrow: "Get In Touch",
    heading: "Let's build something together.",
    subtext:
      "Whether you have an internship opportunity, project collaboration, or just want to connect, my inbox is always open.",
    ctaLabel: "Say Hello",
  },
};

export function getDirectDriveDownloadUrl(url) {
  if (!url) return "#";
  const trimmed = url.trim();
  const fileIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return trimmed;
}

export function mergeWithDefaults(raw) {
  return {
    ...defaultPortfolioData,
    ...raw,
    personal: { ...defaultPortfolioData.personal, ...(raw?.personal || {}) },
    contact: { ...defaultPortfolioData.contact, ...(raw?.contact || {}) },
  };
}

export async function fetchLivePortfolioData() {
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        localStorage.setItem("portfolio_cms_data_v1", JSON.stringify(json.data));
        return mergeWithDefaults(json.data);
      }
    }
  } catch (e) {
    console.error("Live fetch error:", e);
  }

  try {
    const cached = localStorage.getItem("portfolio_cms_data_v1");
    if (cached) return mergeWithDefaults(JSON.parse(cached));
  } catch (e) {
    console.error(e);
  }
  return defaultPortfolioData;
}

export async function saveLivePortfolioData(updatedData) {
  localStorage.setItem("portfolio_cms_data_v1", JSON.stringify(updatedData));

  try {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedData }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, reason: json?.error || "Server sync failed" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message || "Network error" };
  }
}