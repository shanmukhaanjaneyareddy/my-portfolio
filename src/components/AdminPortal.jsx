import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Save,
  Check,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  FolderPlus,
  Cpu,
  User,
  Mail,
  Cloud,
  AlertCircle,
} from "lucide-react";
import {
  defaultPortfolioData,
  getDirectDriveDownloadUrl,
  saveLivePortfolioData,
} from "../data/portfolioData";

const ADMIN_PASSKEY = "Shanmukh@2026";

export default function AdminPortal({ data, setData }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("general");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncErrorMsg, setSyncErrorMsg] = useState("");

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Full-Stack",
    featured: false,
    description: "",
    techText: "",
    liveUrl: "",
    githubUrl: "https://github.com/shanmukhaanjaneyareddy",
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillInputs, setNewSkillInputs] = useState({});

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const persistData = async (updated) => {
    setData(updated);
    setSyncStatus("saving");
    const result = await saveLivePortfolioData(updated);
    if (result.ok) {
      setSyncStatus("saved");
      setSyncErrorMsg("");
      setTimeout(() => setSyncStatus("idle"), 2500);
    } else {
      setSyncStatus("error");
      setSyncErrorMsg(result.reason || "Cloud sync failed");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkeyInput === ADMIN_PASSKEY) {
      setAuthenticated(true);
      sessionStorage.setItem("portfolio_admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect passkey.");
    }
  };

  const handleResetAll = async () => {
    if (window.confirm("Reset all sections back to default portfolio data?")) {
      await persistData(defaultPortfolioData);
    }
  };

  // Local state updates while typing (no network spam)
  const updatePersonalField = (field, value) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSocialField = (platform, value) => {
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        socials: { ...prev.personal.socials, [platform]: value },
      },
    }));
  };

  const updateContactField = (field, value) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const techArray = projectForm.techText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProjectId) {
      const updatedProjects = data.projects.map((p) =>
        p.id === editingProjectId
          ? {
              ...p,
              title: projectForm.title,
              category: projectForm.category,
              featured: projectForm.featured,
              description: projectForm.description,
              tech: techArray,
              liveUrl: projectForm.liveUrl || "#",
              githubUrl: projectForm.githubUrl || "#",
            }
          : p
      );
      await persistData({ ...data, projects: updatedProjects });
      setEditingProjectId(null);
    } else {
      const newProj = {
        id: Date.now(),
        title: projectForm.title,
        category: projectForm.category,
        featured: projectForm.featured,
        description: projectForm.description,
        tech: techArray,
        liveUrl: projectForm.liveUrl || "#",
        githubUrl: projectForm.githubUrl || "#",
      };
      await persistData({ ...data, projects: [...data.projects, newProj] });
    }

    setProjectForm({
      title: "",
      category: "Full-Stack",
      featured: false,
      description: "",
      techText: "",
      liveUrl: "",
      githubUrl: "https://github.com/shanmukhaanjaneyareddy",
    });
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      category: proj.category,
      featured: Boolean(proj.featured),
      description: proj.description,
      techText: proj.tech.join(", "),
      liveUrl: proj.liveUrl,
      githubUrl: proj.githubUrl,
    });
  };

  const handleDeleteProject = (id) => {
    persistData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    persistData({
      ...data,
      skills: [
        ...data.skills,
        { id: Date.now(), category: newCategoryName.trim(), items: [] },
      ],
    });
    setNewCategoryName("");
  };

  const handleDeleteCategory = (catId) => {
    persistData({
      ...data,
      skills: data.skills.filter((s) => s.id !== catId),
    });
  };

  const handleAddSkillItem = (catId) => {
    const skillText = (newSkillInputs[catId] || "").trim();
    if (!skillText) return;
    const updatedSkills = data.skills.map((cat) =>
      cat.id === catId && !cat.items.includes(skillText)
        ? { ...cat, items: [...cat.items, skillText] }
        : cat
    );
    persistData({ ...data, skills: updatedSkills });
    setNewSkillInputs({ ...newSkillInputs, [catId]: "" });
  };

  const handleDeleteSkillItem = (catId, skillName) => {
    const updatedSkills = data.skills.map((cat) =>
      cat.id === catId
        ? { ...cat, items: cat.items.filter((item) => item !== skillName) }
        : cat
    );
    persistData({ ...data, skills: updatedSkills });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent-primary/10 text-accent-primary">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Portfolio Live CMS</h1>
              <p className="text-xs text-slate-400">Instant Cloud Sync (/admin)</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                ADMIN PASSKEY
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey"
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent-primary text-dark-950 font-semibold text-sm hover:bg-sky-300 transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Site
          </a>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Hero & Resume", icon: User },
    { id: "projects", label: "Projects", icon: FolderPlus },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "contact", label: "Contact & Footer", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-1">
              Live Cloud CMS (/admin)
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Portfolio Content Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {syncStatus === "saving" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 text-sky-400 text-xs font-medium">
                <Cloud className="w-3.5 h-3.5 animate-pulse" />
                Syncing to Cloud...
              </span>
            )}
            {syncStatus === "saved" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                Live on Public Site
              </span>
            )}
            {syncStatus === "error" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {syncErrorMsg}
              </span>
            )}

            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card text-xs text-slate-300 hover:text-rose-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>

            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-dark-950 text-xs font-semibold hover:bg-sky-300"
            >
              <ArrowLeft className="w-4 h-4" />
              View Public Site
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? "bg-accent-primary text-dark-950"
                    : "glass-card text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "general" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              persistData(data);
            }}
            className="rounded-2xl glass-card p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold">
                Navbar, Hero Bio &amp; Google Drive Resume
              </h2>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs hover:bg-sky-300"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  NAVBAR BRAND (LEFT)
                </label>
                <input
                  type="text"
                  value={data.personal.brandMain}
                  onChange={(e) => updatePersonalField("brandMain", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  NAVBAR BRAND (ACCENT)
                </label>
                <input
                  type="text"
                  value={data.personal.brandAccent}
                  onChange={(e) => updatePersonalField("brandAccent", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={data.personal.name}
                  onChange={(e) => updatePersonalField("name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  ROLE / SUBTITLE
                </label>
                <input
                  type="text"
                  value={data.personal.role}
                  onChange={(e) => updatePersonalField("role", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  HERO BIO TAGLINE
                </label>
                <textarea
                  rows={3}
                  value={data.personal.tagline}
                  onChange={(e) => updatePersonalField("tagline", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-dark-900/80 border border-accent-primary/20 space-y-2">
                <label className="block text-xs font-mono text-accent-primary">
                  GOOGLE DRIVE RESUME LINK (AUTO-DOWNLOADS FOR ALL VISITORS)
                </label>
                <input
                  type="url"
                  value={data.personal.defaultResumeUrl}
                  onChange={(e) =>
                    updatePersonalField("defaultResumeUrl", e.target.value)
                  }
                  placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-sm"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                  <span className="truncate max-w-lg">
                    Direct Download URL:{" "}
                    <code className="text-slate-200">
                      {getDirectDriveDownloadUrl(data.personal.defaultResumeUrl)}
                    </code>
                  </span>
                  <a
                    href={getDirectDriveDownloadUrl(
                      data.personal.defaultResumeUrl
                    )}
                    className="inline-flex items-center gap-1 text-accent-primary hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Test Auto-Download
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  GITHUB URL
                </label>
                <input
                  type="url"
                  value={data.personal.socials.github}
                  onChange={(e) => updateSocialField("github", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  LINKEDIN URL
                </label>
                <input
                  type="url"
                  value={data.personal.socials.linkedin}
                  onChange={(e) => updateSocialField("linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>
            </div>
          </form>
        )}

        {activeTab === "projects" && (
          <div className="space-y-8">
            <form
              onSubmit={handleSaveProject}
              className="rounded-2xl glass-card p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-lg font-bold">
                {editingProjectId ? "Edit Project" : "Add New Project"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    PROJECT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    CATEGORY (FILTER TAB)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    TECHNOLOGIES USED (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.techText}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        techText: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    LIVE PROJECT URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        liveUrl: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    GITHUB REPO URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubUrl: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    id="featuredCheckbox"
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-sky-400"
                  />
                  <label
                    htmlFor="featuredCheckbox"
                    className="text-xs text-slate-300"
                  >
                    Feature as Wide Bento Card (spans 2 columns on desktop)
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-sm hover:bg-sky-300"
                >
                  <Save className="w-4 h-4" />
                  {editingProjectId ? "Update Project" : "Add Project"}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        title: "",
                        category: "Full-Stack",
                        featured: false,
                        description: "",
                        techText: "",
                        liveUrl: "",
                        githubUrl: "https://github.com/shanmukhaanjaneyareddy",
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl glass-card text-xs text-slate-300"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-accent-primary">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-accent-primary/20 text-accent-primary">
                          Wide Card
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-100">{proj.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditProjectClick(proj)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-xs text-slate-200 hover:border-accent-primary/40"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-xs text-rose-400 hover:border-rose-400/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-6">
            <form
              onSubmit={handleAddCategory}
              className="rounded-2xl glass-card p-6 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Skill Category (e.g., AI & Machine Learning)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-sm hover:bg-sky-300"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.skills.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl glass-card p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100">
                      {group.category}
                    </h3>
                    <button
                      onClick={() => handleDeleteCategory(group.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs"
                      >
                        {skill}
                        <button
                          onClick={() =>
                            handleDeleteSkillItem(group.id, skill)
                          }
                          className="text-slate-400 hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newSkillInputs[group.id] || ""}
                      onChange={(e) =>
                        setNewSkillInputs({
                          ...newSkillInputs,
                          [group.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkillItem(group.id);
                        }
                      }}
                      placeholder="Add skill..."
                      className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkillItem(group.id)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              persistData(data);
            }}
            className="rounded-2xl glass-card p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold">Contact Section &amp; Footer</h2>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs hover:bg-sky-300"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  GMAIL / EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updatePersonalField("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  LOCATION (FOOTER)
                </label>
                <input
                  type="text"
                  value={data.personal.location}
                  onChange={(e) => updatePersonalField("location", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  CONTACT HEADLINE
                </label>
                <input
                  type="text"
                  value={data.contact.heading}
                  onChange={(e) => updateContactField("heading", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  CONTACT DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={data.contact.subtext}
                  onChange={(e) => updateContactField("subtext", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}