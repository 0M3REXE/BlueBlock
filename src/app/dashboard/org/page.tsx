"use client";

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import ProjectForm from '../../../components/ProjectForm';

interface Project {
  id: string;
  name: string;
  total_area_hectares: number | null;
}

interface Site {
  id: string;
  name: string;
  project_id: string;
}

export default function OrgDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsRes, sitesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/sites'),
      ]);
      const projectsData = await projectsRes.json();
      const sitesData = await sitesRes.json();
      setProjects(projectsData || []);
      setSites(sitesData || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProjectCreated = () => {
    setShowCreateProjectModal(false);
    fetchData();
  };

  const kpis = [
    {
      label: 'Total Projects',
      value: loading ? '...' : projects.length,
      color: 'text-emerald-400',
    },
    {
      label: 'Active Sites',
      value: loading ? '...' : sites.length,
      color: 'text-cyan-400',
    },
    {
      label: 'Total Area (ha)',
      value: loading
        ? '...'
        : projects.reduce((sum, p) => sum + (p.total_area_hectares || 0), 0).toFixed(1),
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base font-semibold tracking-wide sm:text-lg">
          Organization Dashboard
        </h1>
        <button
          onClick={() => setShowCreateProjectModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-[#062024] transition hover:bg-cyan-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6"
          >
            <p className="mb-1 text-xs text-white/50 sm:text-sm">{kpi.label}</p>
            <p className={`text-2xl font-bold sm:text-3xl ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-sm font-medium text-white/80 sm:text-base">Recent Projects</h2>
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-white/40">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-white/40">No projects yet. Create your first project to get started.</p>
          ) : (
            projects.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-xs sm:text-sm"
              >
                <span className="font-medium text-white/90">{p.name}</span>
                <span className="text-white/50">
                  {p.total_area_hectares ? `${p.total_area_hectares} ha` : '—'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-sm font-medium text-white/80 sm:text-base">Recent Sites</h2>
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-white/40">Loading...</p>
          ) : sites.length === 0 ? (
            <p className="text-sm text-white/40">No sites yet.</p>
          ) : (
            sites.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-xs sm:text-sm"
              >
                <span className="font-medium text-white/90">{s.name}</span>
                <span className="truncate text-white/40">{s.project_id.slice(0, 8)}...</span>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        title="Create New Project"
      >
        <ProjectForm onSuccess={handleProjectCreated} onCancel={() => setShowCreateProjectModal(false)} />
      </Modal>
    </div>
  );
}
