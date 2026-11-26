import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Save,
  Check,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
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
  GraduationCap,
} from "lucide-react";
import {
  defaultPortfolioData,
  getDirectDriveDownloadUrl,
  saveLivePortfolioData,
} from "../data/portfolioData";

const ADMIN_PASSKEY = "Shanmukh@2026";

const CREDENTIAL_ORDER_META = {
  education: "Education Qualifications",
  internships: "Internships & Simulations",
  certifications: "Certifications",
};

function normalizeLink(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function AdminPortal({ data, setData }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("general");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncErrorMsg, setSyncErrorMsg] = useState("");

  // Projects State
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

  // Skills State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillInputs, setNewSkillInputs] = useState({});

  // Education State
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    location: "",
    period: "",
    highlights: "",
  });

  // Internships State
  const [editingInternId, setEditingInternId] = useState(null);
  const [internForm, setInternForm] = useState({
    role: "",
    organization: "",
    period: "",
    description: "",
  });

  // Certifications State
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
  });

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

  const handleMoveCredentialSection = async (index, direction) => {
    const currentOrder = [
      ...(data.credentialsOrder || [
        "education",
        "internships",
        "certifications",
      ]),
    ];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const [moved] = currentOrder.splice(index, 1);
    currentOrder.splice(targetIndex, 0, moved);
    await persistData({ ...data, credentialsOrder: currentOrder });
  };

  const handleMoveListItem = async (listKey, index, direction) => {
    const list = [...(data[listKey] || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    await persistData({ ...data, [listKey]: list });
  };

  // Projects Handlers
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const techArray = projectForm.techText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const formattedLiveUrl = normalizeLink(projectForm.liveUrl);
    const formattedGithubUrl = normalizeLink(projectForm.githubUrl);

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
              liveUrl: formattedLiveUrl,
              githubUrl: formattedGithubUrl,
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
        liveUrl: formattedLiveUrl,
        githubUrl: formattedGithubUrl,
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
      techText: (proj.tech || []).join(", "),
      liveUrl: proj.liveUrl === "#" ? "" : proj.liveUrl || "",
      githubUrl: proj.githubUrl === "#" ? "" : proj.githubUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = (id) => {
    if (editingProjectId === id) setEditingProjectId(null);
    persistData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  // Skills Handlers
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

  // Education Handlers (Add + Edit)
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) return;

    if (editingEduId) {
      const updatedEdu = (data.education || []).map((item) =>
        item.id === editingEduId ? { ...item, ...eduForm } : item
      );
      await persistData({ ...data, education: updatedEdu });
      setEditingEduId(null);
    } else {
      await persistData({
        ...data,
        education: [...(data.education || []), { id: Date.now(), ...eduForm }],
      });
    }

    setEduForm({
      degree: "",
      institution: "",
      location: "",
      period: "",
      highlights: "",
    });
  };

  const handleEditEducationClick = (edu) => {
    setEditingEduId(edu.id);
    setEduForm({
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      period: edu.period || "",
      highlights: edu.highlights || "",
    });
  };

  const handleDeleteEducation = (id) => {
    if (editingEduId === id) setEditingEduId(null);
    persistData({
      ...data,
      education: (data.education || []).filter((e) => e.id !== id),
    });
  };

  // Internships Handlers (Add + Edit)
  const handleSaveInternship = async (e) => {
    e.preventDefault();
    if (!internForm.role.trim() || !internForm.organization.trim()) return;

    if (editingInternId) {
      const updatedInterns = (data.internships || []).map((item) =>
        item.id === editingInternId ? { ...item, ...internForm } : item
      );
      await persistData({ ...data, internships: updatedInterns });
      setEditingInternId(null);
    } else {
      await persistData({
        ...data,
        internships: [
          ...(data.internships || []),
          { id: Date.now(), ...internForm },
        ],
      });
    }

    setInternForm({
      role: "",
      organization: "",
      period: "",
      description: "",
    });
  };

  const handleEditInternshipClick = (intern) => {
    setEditingInternId(intern.id);
    setInternForm({
      role: intern.role || "",
      organization: intern.organization || "",
      period: intern.period || "",
      description: intern.description || "",
    });
  };

  const handleDeleteInternship = (id) => {
    if (editingInternId === id) setEditingInternId(null);
    persistData({
      ...data,
      internships: (data.internships || []).filter((i) => i.id !== id),
    });
  };

  // Certifications Handlers (Add + Edit)
  const handleSaveCertification = async (e) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) return;

    const payload = {
      ...certForm,
      credentialUrl: normalizeLink(certForm.credentialUrl),
    };

    if (editingCertId) {
      const updatedCerts = (data.certifications || []).map((item) =>
        item.id === editingCertId ? { ...item, ...payload } : item
      );
      await persistData({ ...data, certifications: updatedCerts });
      setEditingCertId(null);
    } else {
      await persistData({
        ...data,
        certifications: [
          ...(data.certifications || []),
          { id: Date.now(), ...payload },
        ],
      });
    }

    setCertForm({
      title: "",
      issuer: "",
      date: "",
      credentialUrl: "",
    });
  };

  const handleEditCertificationClick = (cert) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
      credentialUrl: cert.credentialUrl || "",
    });
  };

  const handleDeleteCertification = (id) => {
    if (editingCertId === id) setEditingCertId(null);
    persistData({
      ...data,
      certifications: (data.certifications || []).filter((c) => c.id !== id),
    });
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
    { id: "credentials", label: "Education & Certs", icon: GraduationCap },
    { id: "contact", label: "Contact & Footer", icon: Mail },
  ];

  const currentOrder = data.credentialsOrder || [
    "education",
    "internships",
    "certifications",
  ];

  const educationList = data.education || [];
  const internshipList = data.internships || [];
  const certificationList = data.certifications || [];

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
              <div>
                <h2 className="text-lg font-bold">
                  {editingProjectId ? "Edit Project" : "Add New Project"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Clicking any project card on your public portfolio redirects directly to its Live Project URL (or GitHub URL if no live demo link is set).
                </p>
              </div>

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
                    LIVE PROJECT URL (CARD REDIRECT LINK)
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-project.vercel.app/"
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
                    type="text"
                    placeholder="https://github.com/..."
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
              {data.projects.map((proj, idx) => (
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
                    {proj.liveUrl && proj.liveUrl !== "#" && (
                      <p className="text-[11px] font-mono text-sky-400 mt-1 truncate max-w-md">
                        {proj.liveUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveListItem("projects", idx, -1)}
                      className="p-2 rounded-xl glass-card disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                      title="Move Project Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.projects.length - 1}
                      onClick={() => handleMoveListItem("projects", idx, 1)}
                      className="p-2 rounded-xl glass-card disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                      title="Move Project Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditProjectClick(proj)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-xs text-slate-200 hover:border-accent-primary/40"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
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

        {activeTab === "credentials" && (
          <div className="space-y-8">
            {/* Section Display Order Controller */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Section Display Order</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reorder how Education, Internships, and Certifications appear on your public portfolio.
                </p>
              </div>

              <div className="space-y-2.5">
                {currentOrder.map((key, idx) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-dark-900/90 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-accent-primary/15 text-accent-primary font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-100">
                        {CREDENTIAL_ORDER_META[key] || key}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCredentialSection(idx, -1)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-slate-200"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        Up
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentOrder.length - 1}
                        onClick={() => handleMoveCredentialSection(idx, 1)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-slate-200"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Manager (Add, Edit & Reorder) */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingEduId
                    ? "Edit Education Qualification"
                    : "Education Qualifications"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit (percentage, year, institution), or reorder B.Sc., Inter, and SSC entries.
                </p>
              </div>
              <form
                onSubmit={handleSaveEducation}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  required
                  placeholder="Degree / Class (e.g., B.Sc. AI, Intermediate, SSC)"
                  value={eduForm.degree}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, degree: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Institution / School Name"
                  value={eduForm.institution}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, institution: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Location (e.g., Rajahmundry, AP)"
                  value={eduForm.location}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, location: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Period / Year (e.g., 2025 – Present)"
                  value={eduForm.period}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, period: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Highlights / Percentage / CGPA"
                  value={eduForm.highlights}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, highlights: e.target.value })
                  }
                  className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs hover:bg-sky-300"
                  >
                    {editingEduId ? (
                      <>
                        <Save className="w-4 h-4" />
                        Update Education
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Education
                      </>
                    )}
                  </button>
                  {editingEduId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEduId(null);
                        setEduForm({
                          degree: "",
                          institution: "",
                          location: "",
                          period: "",
                          highlights: "",
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl glass-card text-xs text-slate-300"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-3 pt-2">
                {educationList.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl bg-dark-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-accent-primary/15 text-accent-primary font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{edu.degree}</p>
                        <p className="text-xs text-slate-400">
                          {edu.institution} • {edu.period}
                        </p>
                        {edu.highlights && (
                          <p className="text-xs text-slate-300 mt-0.5">
                            {edu.highlights}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveListItem("education", idx, -1)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === educationList.length - 1}
                        onClick={() => handleMoveListItem("education", idx, 1)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditEducationClick(edu)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200"
                        title="Edit Education"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-2 text-rose-400 hover:bg-white/5 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internships Manager (Add, Edit & Reorder) */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingInternId
                    ? "Edit Internship / Simulation"
                    : "Internships & Simulations"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit details, or reorder your internships and simulations.
                </p>
              </div>
              <form
                onSubmit={handleSaveInternship}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  required
                  placeholder="Role / Program Title"
                  value={internForm.role}
                  onChange={(e) =>
                    setInternForm({ ...internForm, role: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Organization (e.g., Deloitte Australia / Forage)"
                  value={internForm.organization}
                  onChange={(e) =>
                    setInternForm({
                      ...internForm,
                      organization: e.target.value,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Period (e.g., 2026)"
                  value={internForm.period}
                  onChange={(e) =>
                    setInternForm({ ...internForm, period: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Key Responsibilities / Outcome"
                  value={internForm.description}
                  onChange={(e) =>
                    setInternForm({
                      ...internForm,
                      description: e.target.value,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs hover:bg-sky-300"
                  >
                    {editingInternId ? (
                      <>
                        <Save className="w-4 h-4" />
                        Update Internship
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Internship
                      </>
                    )}
                  </button>
                  {editingInternId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInternId(null);
                        setInternForm({
                          role: "",
                          organization: "",
                          period: "",
                          description: "",
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl glass-card text-xs text-slate-300"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-3 pt-2">
                {internshipList.map((intern, idx) => (
                  <div
                    key={intern.id}
                    className="p-4 rounded-xl bg-dark-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-accent-secondary/15 text-accent-secondary font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{intern.role}</p>
                        <p className="text-xs text-slate-400">
                          {intern.organization} • {intern.period}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          handleMoveListItem("internships", idx, -1)
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === internshipList.length - 1}
                        onClick={() =>
                          handleMoveListItem("internships", idx, 1)
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditInternshipClick(intern)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200"
                        title="Edit Internship"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInternship(intern.id)}
                        className="p-2 text-rose-400 hover:bg-white/5 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Manager (Add, Edit & Reorder) */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingCertId ? "Edit Certification" : "Certifications"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit certificate name/issuer/link, or reorder your certifications.
                </p>
              </div>
              <form
                onSubmit={handleSaveCertification}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  required
                  placeholder="Certificate Title"
                  value={certForm.title}
                  onChange={(e) =>
                    setCertForm({ ...certForm, title: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Issuing Organization (e.g., Microsoft & LinkedIn)"
                  value={certForm.issuer}
                  onChange={(e) =>
                    setCertForm({ ...certForm, issuer: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Date / Year (e.g., May 2026)"
                  value={certForm.date}
                  onChange={(e) =>
                    setCertForm({ ...certForm, date: e.target.value })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <input
                  type="text"
                  placeholder="Credential / Drive Link (Optional)"
                  value={certForm.credentialUrl}
                  onChange={(e) =>
                    setCertForm({
                      ...certForm,
                      credentialUrl: e.target.value,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm"
                />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs hover:bg-sky-300"
                  >
                    {editingCertId ? (
                      <>
                        <Save className="w-4 h-4" />
                        Update Certification
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Certification
                      </>
                    )}
                  </button>
                  {editingCertId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCertId(null);
                        setCertForm({
                          title: "",
                          issuer: "",
                          date: "",
                          credentialUrl: "",
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl glass-card text-xs text-slate-300"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-3 pt-2">
                {certificationList.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-dark-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{cert.title}</p>
                        <p className="text-xs text-slate-400">
                          {cert.issuer} • {cert.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          handleMoveListItem("certifications", idx, -1)
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === certificationList.length - 1}
                        onClick={() =>
                          handleMoveListItem("certifications", idx, 1)
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditCertificationClick(cert)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200"
                        title="Edit Certification"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="p-2 text-rose-400 hover:bg-white/5 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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