import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ClientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Set page metadata for SEO
  useDocumentMetadata({
    title: "Client Portal | BROJIX — Track Your Project Status",
    description: "Access your personalized project tracking dashboard. Review project requirement documents, monitor real-time development timeline, and view billing details.",
    canonicalUrl: "https://brojix.netlify.app/dashboard",
  });

  // Normalize phone numbers for search comparison
  const normalizePhone = (num) => {
    return num ? num.replace(/\D/g, '') : '';
  };

  // Main lookup function
  const handleLookup = async (queryStr, isAutoLoad = false) => {
    const query = queryStr.trim();
    if (!query) return;

    setIsLoading(true);
    // Add small visual delay for premium loading experience
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let matched = null;

      // 1. Try to fetch from Supabase first if configured
      if (isSupabaseConfigured) {
        const queryDigits = normalizePhone(query);
        let dbQuery = supabase.from('projects').select('*');
        if (queryDigits) {
          dbQuery = dbQuery.or(`id.ilike."${query}",whatsapp.ilike."%${queryDigits}%"`);
        } else {
          dbQuery = dbQuery.ilike('id', query);
        }

        const { data, error } = await dbQuery;
        if (!error && data && data.length > 0) {
          matched = data[0];
        }
      }

      // 2. Fallback to Local Files / LocalStorage if not found on Supabase
      if (!matched) {
        let serverProjects = [];
        try {
          const res = await fetch('/projects.json');
          if (res.ok) {
            serverProjects = await res.json();
          }
        } catch (err) {
          console.warn("Server projects.json not available.");
        }

        const localProjects = JSON.parse(localStorage.getItem('contact_submissions') || '[]');

        const combined = [...serverProjects];
        localProjects.forEach(localItem => {
          if (!combined.some(item => item.id === localItem.id)) {
            combined.push(localItem);
          }
        });

        const queryDigits = normalizePhone(query);
        matched = combined.find(proj => {
          if (proj.id.toLowerCase() === query.toLowerCase()) return true;

          if (proj.whatsapp) {
            const projDigits = normalizePhone(proj.whatsapp);
            if (projDigits && queryDigits && (projDigits.endsWith(queryDigits) || queryDigits.endsWith(projDigits))) {
              return true;
            }
          }
          return false;
        });
      }

      if (matched) {
        setProject(matched);
        // Save to recent search history
        localStorage.setItem('recent_project_lookup', query);
        
        // Update URL hash/param for shareable tracking
        navigate(`/dashboard?id=${matched.id}`, { replace: true });
        
        if (!isAutoLoad) {
          toast.success(`Project loaded: ${matched.topic}`);
        }
      } else {
        if (!isAutoLoad) {
          toast.error("No active project matched that ID or WhatsApp number.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during project database search.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLookup(searchQuery);
  };

  // URL Parameter & Local Storage Hydration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    const dataParam = params.get('data');

    if (dataParam) {
      // Handle base64 shared link
      try {
        const decodedJSON = atob(decodeURIComponent(dataParam));
        const sharedProject = JSON.parse(decodedJSON);
        if (sharedProject && sharedProject.id) {
          // Import to local storage contact_submissions
          const localProjects = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
          const existsIdx = localProjects.findIndex(p => p.id === sharedProject.id);
          if (existsIdx >= 0) {
            localProjects[existsIdx] = sharedProject;
          } else {
            localProjects.unshift(sharedProject);
          }
          localStorage.setItem('contact_submissions', JSON.stringify(localProjects));
          
          setProject(sharedProject);
          toast.success(`Imported shared project: ${sharedProject.topic}`);
          // Redirect to clean ID url
          navigate(`/dashboard?id=${sharedProject.id}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Failed to parse shared project base64 payload:", err);
        toast.error("The project link metadata appears corrupted.");
      }
    }

    if (idParam) {
      handleLookup(idParam, true);
    } else {
      // Check last lookup in local storage
      const lastLookup = localStorage.getItem('recent_project_lookup');
      if (lastLookup) {
        setSearchQuery(lastLookup);
        handleLookup(lastLookup, true);
      }
    }
  }, [location.search]);

  // Copy Project ID
  const copyProjectId = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.id);
    setCopiedId(true);
    toast.success("Project ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Helper values with defaults
  const getTimeline = () => {
    if (project?.timeline && project.timeline.length > 0) {
      return project.timeline;
    }

    // Default timeline milestones
    const defaultMilestones = [
      {
        id: 'def-1',
        date: project?.created_at ? new Date(project.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        title: "Project Proposal Submitted",
        description: "Requirements received and parsed. Initial consultation review initialized.",
        status: "Completed"
      }
    ];

    if (project?.status === "In Progress" || project?.status === "Completed") {
      defaultMilestones.push({
        id: 'def-2',
        date: project?.created_at ? new Date(new Date(project.created_at).getTime() + 86400000).toLocaleDateString() : new Date().toLocaleDateString(),
        title: "Architecture & Scope Aligned",
        description: "PRD requirements draft created. Code architecture, technologies, and pricing locked.",
        status: "Completed"
      });
    }

    if (project?.status === "Completed") {
      defaultMilestones.push({
        id: 'def-3',
        date: project?.deadline ? new Date(project.deadline).toLocaleDateString() : new Date().toLocaleDateString(),
        title: "Final Build & Handover",
        description: "Source code compile validated, reports generated, and credentials safely transferred to client.",
        status: "Completed"
      });
    } else if (project?.status === "In Progress") {
      defaultMilestones.push({
        id: 'def-3',
        date: "In Progress",
        title: "System Implementation",
        description: "Developing primary functions, front-end integrations, and documentation report generation.",
        status: "Current"
      });
    }

    return defaultMilestones;
  };

  // Status mapping
  const getProgressPercentage = () => {
    if (project?.progress !== undefined && project?.progress !== null) {
      return Number(project.progress);
    }
    switch (project?.status) {
      case 'Completed': return 100;
      case 'In Progress': return 60;
      default: return 15;
    }
  };

  const getStatusStep = () => {
    const pct = getProgressPercentage();
    if (pct >= 100) return 4; // Delivered
    if (pct >= 75) return 3;  // Testing
    if (pct >= 40) return 2;  // Development
    if (pct >= 15) return 1;  // Planning
    return 0;                 // Review
  };

  const currentStep = getStatusStep();
  const progressPct = getProgressPercentage();
  const timelineMilestones = getTimeline();

  // Pricing calculations
  const totalVal = project?.totalPrice ? Number(project.totalPrice) : 0;
  const advPaid = project?.advancePaid ? Number(project.advancePaid) : 0;
  const balance = Math.max(0, totalVal - advPaid);
  const paymentStatus = project?.paymentStatus || (totalVal > 0 ? (advPaid >= totalVal ? "Fully Paid" : advPaid > 0 ? "Partially Paid" : "Pending") : "Estimate Pending");

  // Default terms
  const termsText = project?.customTerms || `1. Scope Constraints: Any additions to original requirements will be estimated as a separate sprint.
2. Review Window: The client has 7 days from project completion to request revisions.
3. Hosting & Deployment: Primary deployment package includes Netlify/Vercel setup. Domain purchasing is client-funded.`;

  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-fixed/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Lookup / Search Bar */}
        {!project ? (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-fixed/20 bg-primary-fixed/5 text-primary-fixed text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> SECURE CLIENT ACCESS
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Track Your Project
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
              Enter the WhatsApp number or Project ID associated with your order to view live updates, requirements, and payments.
            </p>

            <form onSubmit={handleSubmit} className="relative mb-4">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter WhatsApp or Project ID (e.g. 918179072511)"
                className="w-full bg-surface-container/60 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-white text-base placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300 shadow-xl"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-2 top-2 p-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed rounded-xl hover:shadow-[0_0_15px_#d2f000] active:scale-95 transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </form>
            <p className="text-xs text-on-surface-variant">
              Format tip: Try entering digits only (e.g. 9876543210).
            </p>
          </div>
        ) : (
          /* Active Dashboard View */
          <div className="space-y-8">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <button 
                  onClick={() => {
                    setProject(null);
                    setSearchQuery('');
                    navigate('/dashboard', { replace: true });
                  }}
                  className="text-xs font-semibold tracking-widest text-primary-fixed hover:text-white uppercase flex items-center gap-1.5 transition-colors mb-2"
                >
                  ← ACCESS PORTAL
                </button>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Project tracking log
                  </h1>
                  <span className="text-xs text-on-surface-variant font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5 flex items-center gap-1">
                    ID: {project.id}
                    <button onClick={copyProjectId} className="hover:text-primary-fixed transition-colors">
                      {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <a 
                  href={`https://wa.me/918179072511?text=Hi%20Likith,%20I'm%20checking%20on%20my%20project:%20${encodeURIComponent(project.topic)}%20(ID:%20${project.id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" /> Live Chat Support
                </a>
              </div>
            </div>

            {/* Project Summary Hero Card */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-primary-fixed/5 w-60 h-60 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Info Text */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary-container/20 border border-secondary/20 text-secondary">
                      {project.service}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      project.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      project.status === 'In Progress' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                      'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                      {project.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                      {project.status}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.topic}
                  </h2>
                  <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                    Registered to <strong className="text-white">{project.name}</strong> • {project.college}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-on-surface-variant mt-2 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary-fixed" />
                      Inquiry Date: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-error" />
                      Handover Target: {project.deadline}
                    </span>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="lg:col-span-5 w-full flex flex-col items-center lg:items-end justify-center">
                  <div className="w-full max-w-sm bg-surface-container-lowest/80 border border-white/5 rounded-2xl p-5 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-on-surface-variant">Development Sprint</span>
                      <span className="text-primary-fixed text-base font-mono">{progressPct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ 
                          width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, #b8d300 0%, #d2f000 100%)',
                          boxShadow: '0 0 10px rgba(210, 240, 0, 0.4)'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Milestone Steps */}
                    <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                      <span className={currentStep >= 1 ? "text-primary-fixed" : ""}>Plan</span>
                      <span className={currentStep >= 2 ? "text-primary-fixed" : ""}>Develop</span>
                      <span className={currentStep >= 3 ? "text-primary-fixed" : ""}>Test</span>
                      <span className={currentStep >= 4 ? "text-primary-fixed" : ""}>Deliver</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Split layout: Timeline and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Timeline updates (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span className="w-1.5 h-6 bg-primary-fixed rounded-full inline-block"></span>
                  Chronological Updates
                </h3>

                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative shadow-xl">
                  {/* Vertical line through timeline */}
                  <div className="absolute left-[29px] top-8 bottom-8 w-0.5 bg-white/10"></div>

                  <div className="space-y-8">
                    {timelineMilestones.map((m, idx) => {
                      const isCurrent = m.status === 'Current';
                      const isCompleted = m.status === 'Completed';
                      
                      return (
                        <div key={m.id || idx} className="relative pl-10 group transition-all duration-300">
                          {/* Timeline node marker */}
                          <div className={`absolute left-0 top-0 w-[20px] h-[20px] rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                            isCompleted ? 'bg-primary-fixed border-primary-fixed-dim shadow-[0_0_10px_#d2f000]' :
                            isCurrent ? 'bg-surface border-secondary shadow-[0_0_10px_rgba(220,184,255,0.6)] animate-pulse' :
                            'bg-surface border-white/20'
                          }`} style={{ transform: 'translate(4.5px, 2px)' }}>
                            {isCompleted && <Check className="w-2.5 h-2.5 text-on-primary-fixed stroke-[4px]" />}
                            {isCurrent && <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>}
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-on-surface-variant tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {m.date}
                            </span>
                            <h4 className={`text-base font-bold transition-colors ${
                              isCompleted ? 'text-white' :
                              isCurrent ? 'text-secondary' :
                              'text-on-surface-variant'
                            }`}>
                              {m.title}
                            </h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: PRD Document and Financial Tracker (5 Columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* PRD Panel */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="w-1.5 h-6 bg-secondary rounded-full inline-block"></span>
                    Requirements & Brief (PRD)
                  </h3>

                  <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden shadow-xl space-y-4">
                    <div className="flex justify-between items-center text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Scope Specification</span>
                      <span>v1.0</span>
                    </div>

                    <div className="bg-surface-container-lowest/80 border border-white/5 p-4 rounded-xl text-xs md:text-sm font-mono text-on-surface-variant leading-relaxed max-h-48 overflow-y-auto shadow-inner whitespace-pre-line">
                      {project.prdText || project.requirements || "No details specified yet."}
                    </div>

                    {project.prdLink && (
                      <a 
                        href={project.prdLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full bg-white/5 border border-white/10 hover:border-primary-fixed/20 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-primary-fixed" /> View External Resources
                      </a>
                    )}
                  </div>
                </div>

                {/* Billing Summary Panel */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                    Billing & Finance
                  </h3>

                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> PAYMENT METRICS</span>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        paymentStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        paymentStatus === 'Partially Paid' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-error/10 text-error border border-error/20'
                      }`}>
                        {paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-y border-white/5 py-4 text-center">
                      <div>
                        <div className="text-[10px] text-on-surface-variant mb-1 font-semibold">ESTIMATE</div>
                        <div className="text-base font-bold text-white">
                          ₹{totalVal ? totalVal.toLocaleString() : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-on-surface-variant mb-1 font-semibold">ADVANCE PAID</div>
                        <div className="text-base font-bold text-emerald-400">
                          ₹{advPaid ? advPaid.toLocaleString() : '0'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-on-surface-variant mb-1 font-semibold">BALANCE</div>
                        <div className="text-base font-bold text-error">
                          ₹{balance ? balance.toLocaleString() : '—'}
                        </div>
                      </div>
                    </div>

                    {totalVal > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-on-surface-variant">
                          <span>Financial Milestone Progress</span>
                          <span>{Math.round((advPaid / totalVal) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 rounded-full" 
                            style={{ width: `${Math.min(100, (advPaid / totalVal) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions Panel */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="w-1.5 h-6 bg-outline rounded-full inline-block"></span>
                    Guidelines & Terms
                  </h3>

                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold mb-3">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURITY CONTRACT RULES
                    </div>
                    <div className="text-xs text-on-surface-variant font-mono space-y-2 whitespace-pre-line leading-relaxed">
                      {termsText}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
