import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import AdminPortal from "./components/AdminPortal";
import {
  defaultPortfolioData,
  fetchLivePortfolioData,
} from "./data/portfolioData";

export default function App() {
  const [data, setData] = useState(defaultPortfolioData);
  const isAdminRoute = window.location.pathname.toLowerCase() === "/admin";

  useEffect(() => {
    fetchLivePortfolioData().then((liveData) => {
      setData(liveData);
    });
  }, []);

  if (isAdminRoute) {
    return <AdminPortal data={data} setData={setData} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 selection:bg-accent-primary/30 selection:text-accent-primary">
      <Navbar personal={data.personal} />
      <main>
        <Hero personal={data.personal} />
        <Projects projects={data.projects} />
        <Skills skills={data.skills} />
      </main>
      <Contact personal={data.personal} contact={data.contact} />
    </div>
  );
}