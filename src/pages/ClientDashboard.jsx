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
  Copy,
  Download,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { printInvoice, printCertificate } from '../lib/InvoiceCertificateGenerator';

export default function ClientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [feedbackToken, setFeedbackToken] = useState(null);

  // Set page metadata for SEO
  useDocumentMetadata({
    title: "Client Workspace | BROJIX — Deliverables & Progress",
    description: "Track your active sprint deliverables, timeline milestones, and billing details in your secure Brojix development workspace.",
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
        localStorage.setItem('recent_project_lookup', query);
        navigate(`/dashboard?id=${matched.id}`, { replace: true });
        
        if (!isAutoLoad) {
          toast.success(`Workspace loaded: ${matched.topic}`);
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
      try {
        const decodedJSON = atob(decodeURIComponent(dataParam));
        const sharedProject = JSON.parse(decodedJSON);
        if (sharedProject && sharedProject.id) {
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
      const lastLookup = localStorage.getItem('recent_project_lookup');
      if (lastLookup) {
        setSearchQuery(lastLookup);
        handleLookup(lastLookup, true);
      }
    }
  }, [location.search]);

  // Load linked feedback token
  useEffect(() => {
    if (project) {
      loadFeedbackToken();
    }
  }, [project]);

  const loadFeedbackToken = async () => {
    try {
      let activeToken = null;
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('feedback_links')
          .select('token')
          .eq('project_id', project.id)
          .eq('is_disabled', false)
          .limit(1);
        if (!error && data && data.length > 0) {
          activeToken = data[0].token;
        }
      }
      if (!activeToken) {
        const storedLinks = JSON.parse(localStorage.getItem('feedback_links') || '[]');
        const link = storedLinks.find(l => l.project_id === project.id && !l.is_disabled);
        if (link) activeToken = link.token;
      }
      setFeedbackToken(activeToken);
    } catch (err) {
      console.warn("Failed to load feedback token:", err);
    }
  };

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

    const defaultMilestones = [
      {
        id: 'def-1',
        date: project?.created_at ? new Date(project.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        label: "Project Proposal Submitted",
        description: "Requirements received and parsed. Initial consultation review initialized.",
        done: true
      }
    ];

    if (project?.status === "In Progress" || project?.status === "Completed") {
      defaultMilestones.push({
        id: 'def-2',
        date: project?.created_at ? new Date(new Date(project.created_at).getTime() + 86400000).toLocaleDateString() : new Date().toLocaleDateString(),
        label: "Architecture & Scope Aligned",
        description: "PRD requirements draft created. Code architecture, technologies, and pricing locked.",
        done: true
      });
    }

    if (project?.status === "Completed") {
      defaultMilestones.push({
        id: 'def-3',
        date: project?.deadline ? new Date(project.deadline).toLocaleDateString() : new Date().toLocaleDateString(),
        label: "Final Build & Handover",
        description: "Source code compile validated, reports generated, and credentials safely transferred to client.",
        done: true
      });
    } else if (project?.status === "In Progress") {
      defaultMilestones.push({
        id: 'def-3',
        date: "In Progress",
        label: "System Implementation",
        description: "Developing primary functions, front-end integrations, and documentation report generation.",
        done: false
      });
    }

    return defaultMilestones;
  };

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

  const progressPct = getProgressPercentage();
  const timelineMilestones = getTimeline();

  // Pricing calculations
  const totalVal = project?.totalPrice || project?.budget || 0;
  const advPaid = project?.advancePaid || 0;
  const discountVal = project?.discount || 0;
  const gstVal = project?.gst || 0;

  const baseVal = totalVal - discountVal;
  const finalVal = project?.final_amount || Math.round(baseVal + (baseVal * (gstVal / 100)));
  const balance = Math.max(0, finalVal - advPaid);
  const paymentStatus = project?.paymentStatus || (finalVal > 0 ? (advPaid >= finalVal ? "Fully Paid" : advPaid > 0 ? "Partially Paid" : "Pending") : "Estimate Pending");

  const termsText = project?.customTerms || `1. Scope Constraints: Any additions to original requirements will be estimated as a separate sprint.
2. Review Window: The client has 7 days from project completion to request revisions.
3. Hosting & Deployment: Primary deployment package includes Netlify/Vercel setup. Domain purchasing is client-funded.`;

  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 md:px-8 relative overflow-hidden font-sans">
      
      {/* Drifting Ambient Glowing Vectors */}
      <div className="ambient-bg" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#d2f000]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {!project ? (
          /* 1. LOOKUP SCREEN */
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d2f000]/20 bg-[#d2f000]/5 text-[#d2f000] text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> SECURE CLIENT ACCESS
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Delivery Workspace
            </h1>
            <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Enter your secure Project Reference Key or associated contact WhatsApp to initialize your sprint portal.
            </p>

            <form onSubmit={handleSubmit} className="relative mb-6">
              <input 
                type="text"
                placeholder="e.g. PRJ-X7G92 or WhatsApp number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-2xl pl-12 pr-28 py-4 text-sm text-white focus:outline-none focus:border-[#d2f000] focus:ring-1 focus:ring-[#d2f000] transition-all"
              />
              <Search className="absolute left-4.5 top-4.5 w-5 h-5 text-on-surface-variant" />
              
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bg-[#d2f000] hover:bg-[#d2f000]/95 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider"
              >
                {isLoading ? "Syncing..." : "Connect"}
              </button>
            </form>

            <p className="text-[10px] text-on-surface-variant">
              Protected by SSL and Brojix cryptographic access links.
            </p>
          </div>
        ) : (
          /* 2. DYNAMIC PREMIUM CLIENT DASHBOARD WORKSPACE */
          <div className="space-y-8">
            
            {/* Header Panel */}
            <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#d2f000]/5 w-48 h-48 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#d2f000]">
                  <Layers className="w-3.5 h-3.5" /> Project Workspace
                </div>
                
                <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {project.topic}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button 
                    onClick={copyProjectId}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                  >
                    ID: {project.id} {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  
                  <span className="text-on-surface-variant text-[10px]">•</span>
                  <span className="text-xs text-on-surface-variant font-medium">Lead: <strong className="text-white">{project.assigned_team_member || "Brojix Lead"}</strong></span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setProject(null)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Switch Workspace
                </button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SPRINT TRACK (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Build Progress Tracker */}
                <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#d2f000]" /> active sprint timeline</h3>
                    <span className="text-xs font-mono font-bold text-[#d2f000]">{progressPct}% Complete</span>
                  </div>

                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#d2f000] rounded-full transition-all duration-500 shadow-[0_0_10px_#d2f000]" 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Milestones Flow */}
                  <div className="space-y-4 pt-2">
                    {timelineMilestones.map((m, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx !== timelineMilestones.length - 1 && (
                          <div className={`absolute left-3 top-6 bottom-0 w-0.5 ${m.done ? 'bg-[#d2f000]' : 'bg-white/5'}`} />
                        )}
                        <div className={`w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${
                          m.done 
                            ? 'bg-[#d2f000]/10 border-[#d2f000] text-[#d2f000]' 
                            : 'bg-[#1c1b1b] border-white/10 text-on-surface-variant'
                        }`}>
                          {m.done ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        </div>

                        <div className="space-y-1 pb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{m.label || m.title}</h4>
                            <span className="text-[10px] text-[#d2f000]/80 font-mono">{m.date}</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope & PRD specs */}
                <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-4 h-4 text-secondary" /> Scope of Work Specifications</h3>
                  <div className="bg-black/20 border border-white/10 p-4 rounded-2xl text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                    {project.requirements || project.prdText || "No project specs defined yet."}
                  </div>
                  {project.prdLink && (
                    <a 
                      href={project.prdLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-[#d2f000] hover:underline"
                    >
                      View Shared Workspace Assets <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>

              {/* RIGHT LEDGER TRACK (5 Columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Billing panel */}
                <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#d2f000]" /> billing status</span>
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                      paymentStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      paymentStatus === 'Partially Paid' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-wider">Estimate</span>
                      <span className="text-xs font-bold text-white">₹{totalVal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-wider">Paid</span>
                      <span className="text-xs font-bold text-emerald-400">₹{advPaid.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-wider">Balance</span>
                      <span className="text-xs font-bold text-red-400">₹{balance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Documents & Receipts print */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => printInvoice(project)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d2f000]" /> Print Invoice
                    </button>
                    <button
                      onClick={() => printCertificate(project)}
                      disabled={project.status !== 'Completed'}
                      className="bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 border border-white/10 text-white font-bold py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                      <Download className="w-3.5 h-3.5 text-secondary" /> Certificate
                    </button>
                  </div>
                </div>

                {/* Handover release gate / Feedback trigger */}
                <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
                  
                  {project.status === 'Completed' ? (
                    /* Completed: Feedback Release Gate */
                    <div className="space-y-4">
                      <div className="flex gap-2 items-center">
                        <Award className="w-5 h-5 text-[#d2f000] animate-pulse" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Project Handover Gate</h4>
                      </div>
                      
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Your project has been successfully deployed and verified. Complete the secure feedback evaluation ledger to release final assets and download your handover certificate.
                      </p>

                      <button
                        onClick={() => {
                          if (feedbackToken) {
                            navigate(`/feedback/${feedbackToken}`);
                          } else {
                            toast.warning("The handover access token is being generated. Please contact the Brojix coordinator.");
                          }
                        }}
                        className="w-full bg-[#d2f000] text-black font-bold py-3 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        Enter Feedback Portal <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* In Progress: Waiting Gate */
                    <div className="space-y-2.5 opacity-70">
                      <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300"><Clock className="w-4 h-4" /> handovers pending</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Handover and evaluation locks will release automatically once the engineering team completes active target sprints and marks the system as completed.
                      </p>
                    </div>
                  )}

                </div>

                {/* Guidelines */}
                <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 shadow-xl">
                  <span className="text-xs text-slate-300 font-bold uppercase block mb-2 tracking-widest"><ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#d2f000]" /> Contract Rules</span>
                  <div className="text-xs text-slate-200 font-mono space-y-2 whitespace-pre-line leading-relaxed">
                    {termsText}
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
