import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Layers, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Trash2, 
  MessageSquare, 
  ArrowLeft, 
  LogOut, 
  Search, 
  Eye, 
  Download, 
  Share2, 
  FileText, 
  DollarSign, 
  Sparkles, 
  Link as LinkIcon, 
  Settings, 
  Plus, 
  X, 
  Mail, 
  Printer, 
  FileCheck, 
  Copy, 
  QrCode, 
  Star, 
  Check, 
  TrendingUp, 
  Percent, 
  PlusCircle, 
  FolderPlus, 
  Bell,
  Sliders,
  TrendingDown,
  Info,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { printInvoice, printCertificate } from '../lib/InvoiceCertificateGenerator';

const TEAM_MEMBERS = ['Likith Kumar', 'Alex Rivera', 'Sarah Chen', 'Devon Patel'];
const ACCENT_COLORS = ['#d2f000', '#00ffcc', '#ff3366', '#3399ff', '#ff9900'];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('brojix_admin_auth') === 'true');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [activeTab, setActiveTab] = useState('projects'); // projects, links, crm, analytics, notifications
  const [loading, setLoading] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = import.meta.env.VITE_ADMIN_USER || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASS || 'Likithkumar@26';

    if (loginUser.trim() === adminUser && loginPass.trim() === adminPass) {
      setIsAuthenticated(true);
      localStorage.setItem('brojix_admin_auth', 'true');
      toast.success("Welcome back to the Command Center.");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('brojix_admin_auth');
    toast.success("Logged out successfully.");
  };

  // Database lists
  const [projects, setProjects] = useState([]);
  const [feedbackLinks, setFeedbackLinks] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Search & Filter
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [crmSearch, setCrmSearch] = useState('');

  // Selected details drawer
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTopic, setNewProjectTopic] = useState('');
  const [newProjectService, setNewProjectService] = useState('Development');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectWhatsapp, setNewProjectWhatsapp] = useState('');
  const [newProjectCollege, setNewProjectCollege] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Edit Project Form States
  const [editStatus, setEditStatus] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editPriority, setEditPriority] = useState('Medium');
  const [editAssignedMember, setEditAssignedMember] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editAdvance, setEditAdvance] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editGst, setEditGst] = useState(0);

  // Link Builder Form
  const [linkProject, setLinkProject] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkOneTime, setLinkOneTime] = useState(true);

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    setLoading(true);
    try {
      let dbProjects = [];
      let dbLinks = [];
      let dbFeedback = [];
      let dbNotifications = [];

      if (isSupabaseConfigured) {
        // Load cloud projects
        const { data: projs, error: projsErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!projsErr && projs) dbProjects = projs;

        // Load links
        const { data: links, error: linksErr } = await supabase.from('feedback_links').select('*').order('created_at', { ascending: false });
        if (!linksErr && links) dbLinks = links;

        // Load feedback
        const { data: fbs, error: fbsErr } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        if (!fbsErr && fbs) dbFeedback = fbs;

        // Load notifications
        const { data: notifs, error: notifsErr } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (!notifsErr && notifs) dbNotifications = notifs;
      }

      // Fallback: LocalStorage Sync
      if (dbProjects.length === 0) {
        dbProjects = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      }
      if (dbLinks.length === 0) {
        dbLinks = JSON.parse(localStorage.getItem('feedback_links') || '[]');
      }
      if (dbFeedback.length === 0) {
        dbFeedback = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');
      }
      if (dbNotifications.length === 0) {
        dbNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      }

      // If empty completely, inject default mock seed
      if (dbProjects.length === 0) {
        const mockProject = {
          id: 'PRJ-MOCK10',
          created_at: new Date().toISOString(),
          name: 'Likith Kumar',
          email: 'likith@brojix.com',
          college: 'Brojix Academy',
          service: 'Custom Software',
          topic: 'Premium SaaS System',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          requirements: 'Complete dashboard matching Linear-style design system with custom animations.',
          status: 'In Progress',
          progress: 60,
          totalPrice: 120000,
          budget: 120000,
          advancePaid: 60000,
          paymentStatus: 'Partially Paid',
          assigned_team_member: 'Likith Kumar',
          priority: 'High',
          project_color: '#d2f000',
          timeline: [
            { label: 'Requirements alignment', date: '2026-07-01', done: true },
            { label: 'Database schema config', date: '2026-07-03', done: true },
            { label: 'Admin Command center UI', date: '2026-07-06', done: false }
          ]
        };
        dbProjects = [mockProject];
        localStorage.setItem('contact_submissions', JSON.stringify(dbProjects));
      }

      setProjects(dbProjects);
      setFeedbackLinks(dbLinks);
      setFeedbackList(dbFeedback);
      setNotifications(dbNotifications);

    } catch (err) {
      toast.error(`Database Load Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName || !newProjectTopic) {
      toast.error("Project details cannot be empty.");
      return;
    }

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newProjectId = `PRJ-${randomId}`;
    const budgetVal = Number(newProjectBudget) || 0;

    const newProject = {
      id: newProjectId,
      created_at: new Date().toISOString(),
      name: newProjectName,
      whatsapp: (newProjectWhatsapp && newProjectWhatsapp.trim()) ? newProjectWhatsapp.trim() : '0000000000',
      college: (newProjectCollege && newProjectCollege.trim()) ? newProjectCollege.trim() : 'Brojix Client College',
      service: newProjectService,
      topic: newProjectTopic,
      deadline: newProjectDeadline || new Date().toISOString().split('T')[0],
      status: 'In Progress',
      progress: 0,
      totalPrice: budgetVal,
      budget: budgetVal,
      advancePaid: 0,
      paymentStatus: 'Unpaid',
      priority: 'Medium',
      project_color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      timeline: [
        { label: 'Project Kickoff', date: new Date().toISOString().split('T')[0], done: true }
      ]
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').insert([newProject]);
        if (error) throw error;
      }

      const updated = [newProject, ...projects];
      setProjects(updated);
      localStorage.setItem('contact_submissions', JSON.stringify(updated));

      // Reset Form
      setNewProjectName('');
      setNewProjectTopic('');
      setNewProjectBudget('');
      setNewProjectDeadline('');
      setNewProjectWhatsapp('');
      setNewProjectCollege('');
      setIsCreatingProject(false);
      toast.success(`Project ${newProjectId} created!`);
    } catch (err) {
      toast.error(`Project creation failed: ${err.message}`);
    }
  };

  // Select project for editing
  const selectProjectForEdit = (proj) => {
    setSelectedProject(proj);
    setEditStatus(proj.status || 'In Progress');
    setEditProgress(proj.progress || 0);
    setEditPriority(proj.priority || 'Medium');
    setEditAssignedMember(proj.assigned_team_member || '');
    setEditNotes(proj.notes || '');
    setEditInternalNotes(proj.internal_notes || '');
    setEditBudget(proj.totalPrice || proj.budget || 0);
    setEditAdvance(proj.advancePaid || 0);
    setEditDiscount(proj.discount || 0);
    setEditGst(proj.gst || 0);
    setIsEditingProject(true);
  };

  // Save Project Changes
  const handleSaveProject = async () => {
    const budgetVal = Number(editBudget) || 0;
    const advVal = Number(editAdvance) || 0;
    const discountVal = Number(editDiscount) || 0;
    const gstVal = Number(editGst) || 0;

    const baseVal = budgetVal - discountVal;
    const finalVal = Math.round(baseVal + (baseVal * (gstVal / 100)));
    const remVal = Math.max(0, finalVal - advVal);
    const payStatus = advVal >= finalVal ? 'Fully Paid' : advVal > 0 ? 'Partially Paid' : 'Unpaid';

    const updatedProject = {
      ...selectedProject,
      priority: editPriority,
      status: editStatus,
      progress: Number(editProgress),
      assigned_team_member: editAssignedMember,
      notes: editNotes,
      internal_notes: editInternalNotes,
      totalPrice: budgetVal,
      budget: budgetVal,
      discount: discountVal,
      gst: gstVal,
      final_amount: finalVal,
      advancePaid: advVal,
      remaining_amount: remVal,
      paymentStatus: payStatus
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('projects')
          .update(updatedProject)
          .eq('id', selectedProject.id);
        if (error) throw error;
      }

      const updated = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
      setProjects(updated);
      localStorage.setItem('contact_submissions', JSON.stringify(updated));

      setSelectedProject(updatedProject);
      setIsEditingProject(false);
      toast.success("Project database modified.");
    } catch (err) {
      toast.error(`Failed to update project: ${err.message}`);
    }
  };

  // Generate secure feedback link
  const handleGenerateFeedbackLink = async (e) => {
    e.preventDefault();
    if (!linkProject) {
      toast.error("Please select a project to link.");
      return;
    }

    const randomToken = Math.random().toString(36).substring(2, 10).toUpperCase(); // e.g. ABX9JKS8
    const newLink = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      token: randomToken,
      project_id: linkProject,
      expiry_date: linkExpiry ? new Date(linkExpiry).toISOString() : null,
      is_disabled: false,
      is_one_time: linkOneTime,
      password: linkPassword.trim() || null,
      submissions_count: 0,
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('feedback_links').insert([newLink]);
        if (error) throw error;
      }

      const updated = [newLink, ...feedbackLinks];
      setFeedbackLinks(updated);
      localStorage.setItem('feedback_links', JSON.stringify(updated));

      // Form resets
      setLinkProject('');
      setLinkExpiry('');
      setLinkPassword('');
      toast.success(`Secure Token ${randomToken} generated!`);
    } catch (err) {
      toast.error(`Link creation failed: ${err.message}`);
    }
  };

  // Toggle feedback link state
  const toggleLinkState = async (link) => {
    const updatedLink = { ...link, is_disabled: !link.is_disabled };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('feedback_links')
          .update({ is_disabled: updatedLink.is_disabled })
          .eq('id', link.id);
        if (error) throw error;
      }

      const updated = feedbackLinks.map(l => l.id === link.id ? updatedLink : l);
      setFeedbackLinks(updated);
      localStorage.setItem('feedback_links', JSON.stringify(updated));
      
      toast.success(`Session link is now ${updatedLink.is_disabled ? 'Disabled' : 'Enabled'}.`);
    } catch (err) {
      toast.error(`Failed to toggle: ${err.message}`);
    }
  };

  const removeProject = async (projId) => {
    if (!window.confirm("Are you sure you want to delete this project? This will remove all linked feedback.")) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').delete().eq('id', projId);
        if (error) throw error;
      }
      const updated = projects.filter(p => p.id !== projId);
      setProjects(updated);
      localStorage.setItem('contact_submissions', JSON.stringify(updated));
      toast.success("Project removed from system.");
    } catch (err) {
      toast.error(`Deletion failed: ${err.message}`);
    }
  };

  const removeFeedback = async (fId) => {
    if (!window.confirm("Remove this feedback log?")) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('feedback').delete().eq('id', fId);
        if (error) throw error;
      }
      const updated = feedbackList.filter(f => f.id !== fId);
      setFeedbackList(updated);
      localStorage.setItem('feedback_submissions', JSON.stringify(updated));
      toast.success("Feedback log removed.");
    } catch (err) {
      toast.error(`Deletion failed: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportData = () => {
    const headers = ['Feedback ID', 'Project ID', 'Client Name', 'Overall Rating', 'NPS Classification', 'Testimonial', 'Allowed Public Use', 'Created At'];
    const rows = feedbackList.map(f => [
      f.id,
      f.project_id,
      f.client_name,
      f.overall_rating,
      f.nps_class,
      `"${(f.testimonial || '').replace(/"/g, '""')}"`,
      f.allow_public_use ? 'Yes' : 'No',
      f.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Brojix_Client_Feedback_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Metrics
  const avgSatisfaction = feedbackList.length > 0
    ? (feedbackList.reduce((acc, curr) => acc + Number(curr.overall_rating), 0) / feedbackList.length).toFixed(1)
    : 'N/A';

  const npsClassStats = feedbackList.reduce((acc, curr) => {
    const cls = curr.nps_class || 'Passive';
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, { Promoter: 0, Passive: 0, Detractor: 0 });

  const npsScoreMetric = feedbackList.length > 0
    ? Math.round(((npsClassStats.Promoter - npsClassStats.Detractor) / feedbackList.length) * 100)
    : 0;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(projectSearch.toLowerCase()) || 
      (p.topic || '').toLowerCase().includes(projectSearch.toLowerCase()) || 
      (p.id || '').toLowerCase().includes(projectSearch.toLowerCase());
    
    const matchesStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-base text-text-primary flex flex-col justify-center items-center p-6 relative overflow-hidden font-body">
        <div className="ambient-bg" />

        <div className="w-full max-w-md p-8 studio-card space-y-6 text-center relative overflow-hidden bg-surface-raised border-surface-border">
          <div className="w-12 h-12 bg-accent/10 border border-accent/25 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-5 h-5 text-accent" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary mb-1.5" style={{ fontFamily: "var(--font-display)" }}>Command Center</h1>
            <p className="text-text-secondary text-xs leading-relaxed max-w-xs mx-auto">
              Authorize administrative credentials to manage project ledgers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Username</label>
              <input 
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-text-primary text-xs focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</label>
              <input 
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter security passcode"
                className="w-full bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-text-primary text-xs focus:outline-none focus:border-accent transition-colors font-mono"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-accent text-accent-text font-bold py-3.5 rounded-xl hover:bg-accent-dim active:scale-95 transition-all text-xs uppercase tracking-wider mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base text-text-primary flex flex-col md:flex-row font-body overflow-hidden">
      <div className="ambient-bg" />
      
      {/* 1. LEFT Command Sidebar */}
      <div className="w-full md:w-64 border-r border-surface-border bg-surface-raised shrink-0 p-6 flex flex-col justify-between select-none relative z-20">
        <div className="space-y-8">
          
          {/* Logo Branding */}
          <div>
            <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              BRO<span className="text-accent">JIX</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold block mt-1">Admin command deck</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'projects', label: 'Projects Registry', icon: Layers },
              { id: 'links', label: 'Secure Access Keys', icon: LinkIcon },
              { id: 'crm', label: 'Feedback CRM', icon: MessageSquare },
              { id: 'analytics', label: 'Satisfaction Stats', icon: TrendingUp },
              { id: 'notifications', label: 'System Alert Logs', icon: Bell, count: notifications.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === tab.id
                    ? 'bg-accent/10 border border-accent/20 text-accent'
                    : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count > 0 && (
                  <span className="bg-accent text-accent-text text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="border-t border-surface-border pt-4 mt-6 md:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-accent-surface border border-accent-border flex items-center justify-center text-xs font-bold text-accent">
              LK
            </div>
            <div>
              <div className="text-xs font-semibold text-text-primary">Likith Kumar</div>
              <div className="text-[9px] text-text-secondary uppercase tracking-wider font-bold">Director</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-text-secondary hover:text-red-400 rounded-xl transition-all"
            title="Log Out of Command Center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. MAIN Canvas Display */}
      <div className="flex-grow overflow-y-auto px-6 md:px-10 py-8 relative">
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          {/* Header Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl tracking-tight capitalize text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {activeTab === 'crm' ? 'Feedback CRM' : activeTab === 'links' ? 'Secure Access' : activeTab === 'analytics' ? 'Satisfaction Stats' : `${activeTab} Registry`}
              </h1>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">Manage channels and deliverables</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={loadDatabase}
                className="p-2.5 bg-surface-raised border border-surface-border hover:border-accent/40 rounded-xl text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
                title="Force DB sync"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {activeTab === 'crm' && (
                <button 
                  onClick={handleExportData}
                  className="bg-surface-raised border border-surface-border hover:border-accent/40 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-surface-overlay transition-all"
                >
                  <Download className="w-4 h-4 text-accent" /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: PROJECTS REGISTRY */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-raised border border-surface-border p-4 rounded-2xl">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-secondary" />
                  <input 
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full bg-surface-base border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                  <select
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    className="bg-surface-base border border-surface-border rounded-xl px-4 py-2.5 text-xs text-text-secondary focus:outline-none focus:border-accent transition-all cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => setIsCreatingProject(true)}
                    className="bg-accent text-accent-text font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-accent-dim transition-all w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map(p => (
                  <div 
                    key={p.id}
                    className="bg-surface-raised border border-surface-border hover:border-accent-border rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-300 group"
                  >
                    {/* Glowing Accent strip */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: p.project_color || '#d2f000' }}
                    />

                    <div className="space-y-4 pt-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="text-[10px] font-mono text-text-secondary">{p.id}</div>
                          <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors text-sm line-clamp-1 mt-0.5">{p.topic}</h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          p.priority === 'Low' ? 'bg-surface-overlay text-text-secondary border border-surface-border' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {p.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs border-y border-surface-border py-3 text-text-secondary font-mono">
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase">Client</span>
                          <span className="font-semibold text-text-primary">{p.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase">Service</span>
                          <span className="font-semibold text-text-primary">{p.service}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-text-secondary">
                          <span>Build Progress</span>
                          <span className="font-bold text-text-primary">{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-overlay rounded-full overflow-hidden border border-surface-border/50">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${p.progress}%`,
                              backgroundColor: p.project_color || '#d2f000'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-surface-border">
                      <span className={`text-[11px] font-bold ${
                        p.status === 'Completed' ? 'text-emerald-400' :
                        p.status === 'Cancelled' ? 'text-red-400' : 'text-accent'
                      }`}>
                        ● {p.status}
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => selectProjectForEdit(p)}
                          className="p-2 bg-surface-overlay border border-surface-border hover:border-accent-border rounded-lg text-text-primary hover:text-accent transition-colors"
                          title="Edit database parameters"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeProject(p.id)}
                          className="p-2 bg-surface-overlay border border-surface-border hover:border-red-500/40 rounded-lg text-text-primary hover:text-red-400 transition-colors"
                          title="Purge project record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: SECURE ACCESS KEYS */}
          {activeTab === 'links' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Link Creator Form (5 Columns) */}
              <div className="lg:col-span-5">
                <form onSubmit={handleGenerateFeedbackLink} className="bg-surface-raised border border-surface-border p-6 rounded-2xl space-y-4 shadow-xl">
                  <h3 className="text-lg font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Secure Link Builder</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">Assign a unique access key token to allow client evaluation logs without authentication sessions.</p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Target Project</label>
                      <select
                        value={linkProject}
                        onChange={(e) => setLinkProject(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.topic} ({p.name})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Expiry Date (Optional)</label>
                      <input 
                        type="date"
                        value={linkExpiry}
                        onChange={(e) => setLinkExpiry(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Secure Passcode (Optional)</label>
                      <input 
                        type="password"
                        placeholder="Define link passcode"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
                      <input 
                        type="checkbox"
                        checked={linkOneTime}
                        onChange={(e) => setLinkOneTime(e.target.checked)}
                        className="accent-accent w-4 h-4 rounded border-surface-border bg-surface-base focus:ring-0"
                      />
                      <span className="text-xs text-text-secondary font-medium">Deactivate key after submission (one-time use)</span>
                    </label>

                    <button 
                      type="submit"
                      className="w-full bg-accent text-accent-text font-bold py-3.5 rounded-xl hover:bg-accent-dim active:scale-95 transition-all text-xs uppercase tracking-wider"
                    >
                      Authorize Access Key
                    </button>
                  </div>
                </form>
              </div>

              {/* Links Deck (7 Columns) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Active Token Ledgers</h3>

                {feedbackLinks.length === 0 ? (
                  <div className="border border-dashed border-surface-border rounded-2xl p-8 text-center text-text-secondary text-xs">
                    No active tokens generated yet. Use the Link Builder on the left to start.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {feedbackLinks.map(l => {
                      const matchedProj = projects.find(p => p.id === l.project_id);
                      const isExpired = l.expiry_date && new Date(l.expiry_date) < new Date();
                      return (
                        <div 
                          key={l.id}
                          className="bg-surface-raised border border-surface-border rounded-xl p-4 flex items-center justify-between hover:border-accent-border transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-accent font-mono">{l.token}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                l.is_disabled || isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {l.is_disabled ? 'Disabled' : isExpired ? 'Expired' : 'Active'}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary font-medium">
                              Project: <strong className="text-text-primary">"{matchedProj?.topic || l.project_id}"</strong>
                            </p>
                            <div className="text-[10px] text-text-secondary font-mono space-y-0.5">
                              {l.expiry_date && <div>Expires: {new Date(l.expiry_date).toLocaleDateString()}</div>}
                              {l.password && <div className="text-accent/80 font-semibold">🔒 Protected</div>}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/feedback/${l.token}`;
                                navigator.clipboard.writeText(url);
                                toast.success("Copied to clipboard!");
                              }}
                              className="p-2 bg-surface-overlay hover:bg-surface-high border border-surface-border rounded-xl text-text-primary transition-colors"
                              title="Copy secure URL link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleLinkState(l)}
                              className="p-2 bg-surface-overlay hover:bg-surface-high border border-surface-border rounded-xl text-text-primary transition-colors"
                              title={l.is_disabled ? "Enable link access" : "Disable link access"}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: FEEDBACK CRM */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              
              {/* Search filter */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-secondary" />
                <input 
                  type="text"
                  placeholder="Filter reviews by client name..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className="w-full bg-surface-raised border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              {/* Feed Grid */}
              {feedbackList.length === 0 ? (
                <div className="border border-dashed border-surface-border rounded-2xl p-12 text-center text-text-secondary text-xs">
                  No feedback submissions registered in CRM yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {feedbackList
                    .filter(f => (f.client_name || '').toLowerCase().includes(crmSearch.toLowerCase()))
                    .map(f => (
                      <div 
                        key={f.id}
                        onClick={() => setSelectedFeedback(f)}
                        className="bg-surface-raised border border-surface-border hover:border-accent-border rounded-2xl p-5 space-y-4 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-text-primary text-sm">{f.client_name}</h4>
                            <span className="text-[10px] text-text-secondary font-mono">{new Date(f.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full text-xs font-bold text-accent">
                            <span>{f.overall_rating}</span> <Star className="w-3 h-3 fill-accent stroke-accent" />
                          </div>
                        </div>

                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed italic">
                          "{f.testimonial || "No written testimonial provided."}"
                        </p>

                        <div className="flex justify-between items-center text-[10px] text-text-secondary font-mono pt-3 border-t border-surface-border">
                          <span>NPS Class: <strong className="text-text-primary">{f.nps_class}</strong></span>
                          {f.allow_public_use && <span className="text-accent font-bold">✓ Featured</span>}
                        </div>
                      </div>
                    ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SATISFACTION ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Analytics Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Average Satisfaction</span>
                  <div className="text-4xl font-extrabold text-text-primary font-mono">{avgSatisfaction} <span className="text-xs text-text-secondary">/ 10</span></div>
                  <p className="text-[10px] text-text-muted">Across all submitted evaluation sheets.</p>
                </div>

                <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest block">Net Promoter Score</span>
                  <div className="text-4xl font-extrabold text-accent font-mono">{npsScoreMetric}</div>
                  <p className="text-[10px] text-text-muted">Scale: -100 to +100. Over +50 is world-class.</p>
                </div>

                <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">Response Volume</span>
                  <div className="text-4xl font-extrabold text-text-primary font-mono">{feedbackList.length}</div>
                  <p className="text-[10px] text-text-muted">Completed feedback cycles registered.</p>
                </div>
              </div>

              {/* Chart panels */}
              {feedbackList.length === 0 ? (
                <div className="border border-dashed border-surface-border rounded-2xl p-12 text-center text-text-secondary text-xs">
                  Aggregate satisfaction charts require database logs to visualize.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Satisfaction Over Time */}
                  <div className="bg-surface-raised border border-surface-border p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Satisfaction Trend Line</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={feedbackList.map((f, i) => ({ index: i + 1, score: Number(f.overall_rating) }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="index" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                          <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.4)" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: '#131720', border: '1px solid var(--surface-border)', color: '#f0ede8' }} />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#d2f000" 
                            strokeWidth={3} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* NPS Breakdown */}
                  <div className="bg-surface-raised border border-surface-border p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">NPS Recommendation Categories</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Promoters (9-10)', value: npsClassStats.Promoter },
                              { name: 'Passives (7-8)', value: npsClassStats.Passive },
                              { name: 'Detractors (0-6)', value: npsClassStats.Detractor }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#d2f000" />
                            <Cell fill="#4f5f72" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#131720', border: '1px solid var(--surface-border)' }} />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: SYSTEM LOGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">System Event Ledger</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={async () => {
                      if (isSupabaseConfigured) {
                        await supabase.from('notifications').delete().neq('id', 'placeholder');
                      }
                      setNotifications([]);
                      localStorage.setItem('admin_notifications', '[]');
                      toast.success("Alert logs cleared.");
                    }}
                    className="text-[10px] text-red-400 hover:underline"
                  >
                    Clear All Logs
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="border border-dashed border-surface-border rounded-2xl p-12 text-center text-text-secondary text-xs">
                  No new system alerts logged.
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      className="bg-surface-raised border border-surface-border rounded-xl p-4 flex gap-3.5 items-start"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-text-primary">{n.title}</h4>
                        <p className="text-[10px] text-text-secondary leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-text-muted font-mono block pt-1">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. NEW PROJECT DRAWER FORM MODAL */}
      <AnimatePresence>
        {isCreatingProject && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-raised border border-surface-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsCreatingProject(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Create Project Record</h3>
                
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Client Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Alex Chen"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Client WhatsApp Number</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 919876543210"
                      value={newProjectWhatsapp}
                      onChange={(e) => setNewProjectWhatsapp(e.target.value)}
                      className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">College / University</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Brojix Institute"
                      value={newProjectCollege}
                      onChange={(e) => setNewProjectCollege(e.target.value)}
                      className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Project Topic</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Portfolio Website"
                      value={newProjectTopic}
                      onChange={(e) => setNewProjectTopic(e.target.value)}
                      className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Service Type</label>
                    <select
                      value={newProjectService}
                      onChange={(e) => setNewProjectService(e.target.value)}
                      className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
                    >
                      <option value="Development">Custom Development</option>
                      <option value="Branding">Branding & Logo</option>
                      <option value="SEO">SEO Optimization</option>
                      <option value="AI Integration">AI Integration</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Budget (INR)</label>
                      <input 
                        type="number"
                        placeholder="10000"
                        value={newProjectBudget}
                        onChange={(e) => setNewProjectBudget(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Deadline Target</label>
                      <input 
                        type="date"
                        value={newProjectDeadline}
                        onChange={(e) => setNewProjectDeadline(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-accent text-accent-text font-bold py-3.5 rounded-xl hover:bg-accent-dim active:scale-95 transition-all text-xs uppercase tracking-wider mt-2"
                  >
                    Commit Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. DETAIL EDIT PROJECT DRAWER SIDE MODAL */}
      <AnimatePresence>
        {isEditingProject && selectedProject && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-surface-raised border-l border-surface-border p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                  <div>
                    <span className="text-[10px] font-mono text-text-secondary">{selectedProject.id}</span>
                    <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>{selectedProject.topic}</h3>
                  </div>
                  
                  <button 
                    onClick={() => setIsEditingProject(false)}
                    className="p-1.5 hover:bg-surface-overlay rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  
                  {/* Status, Priority & Member */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Build Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Priority Grade</label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Build Progress (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(e) => setEditProgress(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Assign Lead</label>
                      <select
                        value={editAssignedMember}
                        onChange={(e) => setEditAssignedMember(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="">Unassigned</option>
                        {TEAM_MEMBERS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Financial Fields */}
                  <div className="border-t border-surface-border pt-4 space-y-3">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Financial Calculations</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Total Budget (INR)</label>
                        <input 
                          type="number"
                          value={editBudget}
                          onChange={(e) => setEditBudget(Number(e.target.value))}
                          className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Advance Paid (INR)</label>
                        <input 
                          type="number"
                          value={editAdvance}
                          onChange={(e) => setEditAdvance(Number(e.target.value))}
                          className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Discount Allowed (INR)</label>
                        <input 
                          type="number"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(Number(e.target.value))}
                          className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">GST Surcharge (%)</label>
                        <input 
                          type="number"
                          value={editGst}
                          onChange={(e) => setEditGst(Number(e.target.value))}
                          className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes fields */}
                  <div className="space-y-3 border-t border-surface-border pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Client Notes (Exposed)</label>
                      <textarea 
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Internal Team Notes (Protected)</label>
                      <textarea 
                        value={editInternalNotes}
                        onChange={(e) => setEditInternalNotes(e.target.value)}
                        className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-accent min-h-[60px]"
                      />
                    </div>
                  </div>

                </div>

              </div>

              <div className="flex gap-3 pt-6 border-t border-surface-border mt-6">
                <button
                  onClick={() => setIsEditingProject(false)}
                  className="w-1/2 bg-surface-overlay border border-surface-border hover:bg-surface-high text-text-primary font-bold py-3.5 rounded-xl text-xs uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="w-1/2 bg-accent text-accent-text font-bold py-3.5 rounded-xl hover:bg-accent-dim text-xs uppercase transition-all"
                >
                  Commit Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. FEEDBACK DETAILS MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-end" onClick={() => setSelectedFeedback(null)}>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface-raised border-l border-surface-border p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header details */}
                <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                  <div>
                    <span className="text-[10px] font-mono text-text-secondary">FEEDBACK LEDGER</span>
                    <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>{selectedFeedback.client_name}</h3>
                  </div>

                  <button 
                    onClick={() => setSelectedFeedback(null)}
                    className="p-1.5 hover:bg-surface-overlay rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  {/* Rating Overview */}
                  <div className="flex justify-between items-center bg-accent-surface border border-accent-border rounded-xl p-4">
                    <div>
                      <span className="text-[10px] text-text-secondary uppercase font-bold">Overall Rating</span>
                      <div className="text-2xl font-extrabold text-accent font-mono mt-1">
                        {selectedFeedback.overall_rating} <span className="text-xs text-text-secondary font-medium">/ 10</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-text-secondary uppercase font-bold">NPS Class</span>
                      <div className="text-xs font-extrabold text-text-primary mt-1.5 uppercase tracking-wider bg-surface-base px-3 py-1 rounded-full border border-surface-border">
                        {selectedFeedback.nps_class}
                      </div>
                    </div>
                  </div>

                  {/* Public Testimonial block */}
                  <div className="bg-surface-base border border-surface-border p-4 rounded-xl space-y-2">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Verified Testimonial</span>
                    <p className="text-xs text-text-primary leading-relaxed italic">
                      "{selectedFeedback.testimonial || 'No text review written.'}"
                    </p>
                    {selectedFeedback.allow_public_use && (
                      <span className="text-[10px] text-accent font-bold block pt-1">
                        ✓ Consent granted for public advertising portfolio.
                      </span>
                    )}
                  </div>

                  {/* Detailed star ratings */}
                  {selectedFeedback.detailed_ratings && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Pillar Evaluation Grades</span>
                      <div className="grid grid-cols-2 gap-3 bg-surface-base border border-surface-border p-3 rounded-xl">
                        {Object.entries(selectedFeedback.detailed_ratings).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-[11px] text-text-secondary">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-text-primary font-mono">{val} ★</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text feedbacks */}
                  {selectedFeedback.text_feedback && (
                    <div className="space-y-3.5">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Written Responses</span>
                      
                      {selectedFeedback.text_feedback.likedMost && (
                        <div className="space-y-1 bg-surface-base p-3 rounded-xl border border-surface-border">
                          <div className="text-[10px] text-text-secondary uppercase font-bold">Liked Most</div>
                          <p className="text-text-primary mt-1">{selectedFeedback.text_feedback.likedMost}</p>
                        </div>
                      )}
                      
                      {selectedFeedback.text_feedback.couldImprove && (
                        <div className="space-y-1 bg-surface-base p-3 rounded-xl border border-surface-border">
                          <div className="text-[10px] text-text-secondary uppercase font-bold">Could Improve</div>
                          <p className="text-text-primary mt-1">{selectedFeedback.text_feedback.couldImprove}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media recordings links */}
                  {(selectedFeedback.audio_url || selectedFeedback.video_url) && (
                    <div className="space-y-3">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Media Testimonials</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedFeedback.audio_url && (
                          <div className="bg-surface-base border border-surface-border p-3 rounded-xl flex flex-col justify-between gap-2 text-center">
                            <span className="text-[10px] text-text-secondary uppercase font-bold">Voice testimonial</span>
                            <audio src={selectedFeedback.audio_url} controls className="w-full h-8 mt-1" />
                          </div>
                        )}
                        {selectedFeedback.video_url && (
                          <div className="bg-surface-base border border-surface-border p-3 rounded-xl flex flex-col justify-between gap-2 text-center">
                            <span className="text-[10px] text-text-secondary uppercase font-bold">Video Clip</span>
                            <a 
                              href={selectedFeedback.video_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs text-accent font-bold py-2 bg-accent-surface rounded-lg border border-accent-border hover:bg-accent/10 transition-colors inline-block mt-1"
                            >
                              Play Video External
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Referrals & Cross-sells */}
                  {((selectedFeedback.referral?.referrerName) || (selectedFeedback.future_project?.title)) && (
                    <div className="space-y-3.5">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">System Leads Generated</span>

                      {selectedFeedback.referral?.referrerName && (
                        <div className="bg-accent-surface border border-accent-border p-3 rounded-xl space-y-1">
                          <span className="text-[10px] text-accent uppercase font-bold">Client Referral Lead</span>
                          <div className="font-semibold text-text-primary mt-1">{selectedFeedback.referral.referrerName}</div>
                          {selectedFeedback.referral.referralContact && (
                            <div className="text-[11px] text-text-secondary font-mono mt-0.5">{selectedFeedback.referral.referralContact}</div>
                          )}
                        </div>
                      )}

                      {selectedFeedback.future_project?.title && (
                        <div className="bg-surface-base border border-surface-border p-3 rounded-xl space-y-1">
                          <span className="text-[10px] text-text-secondary uppercase font-bold">Client Future Project Request</span>
                          <div className="font-semibold text-text-primary mt-1">{selectedFeedback.future_project.title}</div>
                          {selectedFeedback.future_project.description && (
                            <p className="text-[11px] text-text-secondary mt-0.5">{selectedFeedback.future_project.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>

              <div className="pt-6 border-t border-surface-border mt-6">
                <button
                  onClick={() => removeFeedback(selectedFeedback.id)}
                  className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 font-bold py-3.5 rounded-xl text-xs uppercase transition-all"
                >
                  Purge Feedback Ledger
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
