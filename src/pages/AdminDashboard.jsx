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
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_PRESETS = {
  services: [
    { name: 'Software Project', price: 15000 },
    { name: 'Internship Report', price: 8000 },
    { name: 'Project + Report Bundle', price: 20000 },
    { name: 'Custom Requirement', price: 10000 }
  ],
  technologies: [
    'React', 'Tailwind CSS', 'Node.js', 'Express', 'FastAPI', 
    'Python', 'Supabase', 'PostgreSQL', 'Solidity', 'Ethers.js', 
    'Firebase', 'LaTeX', 'UML Diagrams', 'Figma Mockup'
  ],
  paymentTerms: [
    '50% Advance + 50% on Handover',
    '30% Advance + 40% Midpoint + 30% Handover',
    '100% Advance Payment',
    'Estimate Pending'
  ],
  supportTerms: [
    '1 week of free post-delivery updates & support',
    '15 days of free revisions & minor changes',
    'No post-delivery support included',
    'Deployment support included (Netlify/Vercel/Render)'
  ],
  contractClauses: [
    'Scope Constraints: Any additions to original requirements will be estimated as a separate sprint.',
    'Review Window: The client has 7 days from project completion to request revisions.',
    'Hosting & Deployment: Primary deployment package includes Netlify/Vercel/Render setup. Domain purchasing is client-funded.'
  ]
};

export default function AdminDashboard() {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState('services');

  // Input states for adding new presets
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newTechName, setNewTechName] = useState('');
  const [newPaymentTerm, setNewPaymentTerm] = useState('');
  const [newClause, setNewClause] = useState('');

  // Document Generator States
  const [selectedDocType, setSelectedDocType] = useState('Agreement');
  const [includeScope, setIncludeScope] = useState(true);
  const [includePricing, setIncludePricing] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Tabs in Details Pane: 'request' | 'portal' | 'milestones' | 'documents'
  const [activeTab, setActiveTab] = useState('request');

  // Client Portal Form States
  const [editProgress, setEditProgress] = useState(0);
  const [editClientName, setEditClientName] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editService, setEditService] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editPrdText, setEditPrdText] = useState('');
  const [editPrdLink, setEditPrdLink] = useState('');
  const [editTotalPrice, setEditTotalPrice] = useState('');
  const [editAdvancePaid, setEditAdvancePaid] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('Pending');
  const [editCustomTerms, setEditCustomTerms] = useState('');
  const [editTimeline, setEditTimeline] = useState([]);

  // Add Milestone Form States
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // Add Manual Project Modal State & Form States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createWhatsapp, setCreateWhatsapp] = useState('');
  const [createCollege, setCreateCollege] = useState('');
  const [createService, setCreateService] = useState('Software Project');
  const [createTopic, setCreateTopic] = useState('');
  const [createDeadline, setCreateDeadline] = useState('');
  const [createPrdText, setCreatePrdText] = useState('');
  const [createPrdLink, setCreatePrdLink] = useState('');
  const [createTotalPrice, setCreateTotalPrice] = useState('');
  const [createAdvancePaid, setCreateAdvancePaid] = useState('');
  const [createPaymentStatus, setCreatePaymentStatus] = useState('Pending');
  const [createCustomTerms, setCreateCustomTerms] = useState('');

  // Admin credentials env comparison fallback
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USER || 'admin';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || 'admin';

  // Load submissions list from Supabase or LocalStorage
  const loadSubmissions = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setSubmissions(data);
          return;
        } else if (error) {
          console.error("Supabase load error:", error);
        }
      }

      // LocalStorage Fallback if Supabase is not configured or fails
      let stored = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      if (stored.length === 0) {
        const mockSubmissions = [
          {
            id: 'mock-1',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            name: 'Rahul Sharma',
            whatsapp: '919876543210',
            college: 'MITS University',
            service: 'Software Project',
            topic: 'AI Resume Analyzer',
            deadline: '2026-07-15',
            requirements: 'Needs to scan PDF files, check ATS score, and suggest improvements using OpenAI API. Built with React and FastAPI.',
            status: 'In Progress',
            progress: 65,
            prdText: "Features:\n- Upload PDF resumes\n- Extract text using PyPDF\n- Match keywords against job description using GPT-4o\n- Generate score and action items\n\nStack: React, FastAPI, OpenAI API, Tailwind CSS.",
            prdLink: "https://github.com/likith2615/AI-Resume-Analyzer",
            totalPrice: 15000,
            advancePaid: 5000,
            paymentStatus: "Partially Paid",
            customTerms: "1. Delivery in 2 iterations.\n2. Code deployed on Render & Netlify.\n3. 1 week of free post-delivery updates.",
            timeline: [
              {
                id: 't1',
                date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
                title: 'Proposal & Advance Received',
                description: 'Advanced payment received and project architecture created.',
                status: 'Completed'
              },
              {
                id: 't2',
                date: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
                title: 'Figma Mockup Approved',
                description: 'Wireframes and system layout reviewed with client.',
                status: 'Completed'
              },
              {
                id: 't3',
                date: new Date().toLocaleDateString(),
                title: 'Backend APIs Integrated',
                description: 'FastAPI server and PDF text parser endpoints developed and tested.',
                status: 'Current'
              }
            ]
          },
          {
            id: 'mock-2',
            created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
            name: 'Anjali Varma',
            whatsapp: '918765432109',
            college: 'VIT Vellore',
            service: 'Project + Report Bundle',
            topic: 'Blockchain Voting System',
            deadline: '2026-08-01',
            requirements: 'Ethereum based smart contract for secure voting. Needs a full report in IEEE format including UML diagrams.',
            status: 'Pending',
            progress: 15,
            prdText: "Features:\n- Secure login via MetaMask\n- Deploy smart contract on Sepolia testnet\n- Allow admin to create election\n- Count votes in decentralized ledger\n\nStack: Solidity, React, Ethers.js.",
            prdLink: "",
            totalPrice: 20000,
            advancePaid: 0,
            paymentStatus: "Pending",
            customTerms: "1. Smart contract deployment cost is separate.\n2. Detailed IEEE documentation report will be provided.",
            timeline: [
              {
                id: 't1',
                date: new Date(Date.now() - 86400000 * 4).toLocaleDateString(),
                title: 'Inquiry Logged',
                description: 'Client details registered. Technical constraints review active.',
                status: 'Completed'
              }
            ]
          },
          {
            id: 'mock-3',
            created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
            name: 'Vikram Singh',
            whatsapp: '917654321098',
            college: 'IIT Madras',
            service: 'Internship Report',
            topic: 'Cybersecurity Network Diagnostics',
            deadline: '2026-06-20',
            requirements: 'Report detailing network packets, port scanning, and automated firewall configuration script details.',
            status: 'Completed',
            progress: 100,
            prdText: "Report containing:\n- Network diagnostics details\n- Port scanning scripts via Nmap\n- Firewall automation via Bash/Python scripts\n- Mitigation strategies\n\nStack: Python, Bash, Nmap, LaTeX.",
            prdLink: "https://notion.so/Cybersecurity-Network-Diagnostics",
            totalPrice: 8000,
            advancePaid: 8000,
            paymentStatus: "Fully Paid",
            customTerms: "1. Project and report delivered in full.\n2. No additional revisions are included in this bundle.",
            timeline: [
              {
                id: 't1',
                date: new Date(Date.now() - 86400000 * 10).toLocaleDateString(),
                title: 'Project Initiated',
                description: 'Payment made and research constraints set.',
                status: 'Completed'
              },
              {
                id: 't2',
                date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
                title: 'Scripting Completed',
                description: 'Python scanner scripts ready and validated.',
                status: 'Completed'
              },
              {
                id: 't3',
                date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
                title: 'Report Delivered',
                description: 'Final project report compiled in LaTeX and sent to client.',
                status: 'Completed'
              }
            ]
          }
        ];
        localStorage.setItem('contact_submissions', JSON.stringify(mockSubmissions));
        stored = mockSubmissions;
      }
      setSubmissions(stored);
    } catch (err) {
      console.error(err);
    }
  };

  // Seed default mock projects directly to Supabase cloud instance
  const seedMockDataToSupabase = async () => {
    if (!isSupabaseConfigured) return;

    const mockProjects = [
      {
        id: 'PRJ-MOCK1',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        name: 'Rahul Sharma',
        whatsapp: '919876543210',
        college: 'MITS University',
        service: 'Software Project',
        topic: 'AI Resume Analyzer',
        deadline: '2026-07-15',
        requirements: 'Needs to scan PDF files, check ATS score, and suggest improvements using OpenAI API. Built with React and FastAPI.',
        status: 'In Progress',
        progress: 65,
        prdText: "Features:\n- Upload PDF resumes\n- Extract text using PyPDF\n- Match keywords against job description using GPT-4o\n- Generate score and action items\n\nStack: React, FastAPI, OpenAI API, Tailwind CSS.",
        prdLink: "https://github.com/likith2615/AI-Resume-Analyzer",
        totalPrice: 15000,
        advancePaid: 5000,
        paymentStatus: "Partially Paid",
        customTerms: "1. Delivery in 2 iterations.\n2. Code deployed on Render & Netlify.\n3. 1 week of free post-delivery updates.",
        timeline: [
          {
            id: 't1',
            date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
            title: 'Proposal & Advance Received',
            description: 'Advanced payment received and project architecture created.',
            status: 'Completed'
          },
          {
            id: 't2',
            date: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
            title: 'Figma Mockup Approved',
            description: 'Wireframes and system layout reviewed with client.',
            status: 'Completed'
          },
          {
            id: 't3',
            date: new Date().toLocaleDateString(),
            title: 'Backend APIs Integrated',
            description: 'FastAPI server and PDF text parser endpoints developed and tested.',
            status: 'Current'
          }
        ]
      },
      {
        id: 'PRJ-MOCK2',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        name: 'Anjali Varma',
        whatsapp: '918765432109',
        college: 'VIT Vellore',
        service: 'Project + Report Bundle',
        topic: 'Blockchain Voting System',
        deadline: '2026-08-01',
        requirements: 'Ethereum based smart contract for secure voting. Needs a full report in IEEE format including UML diagrams.',
        status: 'Pending',
        progress: 15,
        prdText: "Features:\n- Secure login via MetaMask\n- Deploy smart contract on Sepolia testnet\n- Allow admin to create election\n- Count votes in decentralized ledger\n\nStack: Solidity, React, Ethers.js.",
        prdLink: "",
        totalPrice: 20000,
        advancePaid: 0,
        paymentStatus: "Pending",
        customTerms: "1. Smart contract deployment cost is separate.\n2. Detailed IEEE documentation report will be provided.",
        timeline: [
          {
            id: 't1',
            date: new Date(Date.now() - 86400000 * 4).toLocaleDateString(),
            title: 'Inquiry Logged',
            description: 'Client details registered. Technical constraints review active.',
            status: 'Completed'
          }
        ]
      },
      {
        id: 'PRJ-MOCK3',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        name: 'Vikram Singh',
        whatsapp: '917654321098',
        college: 'IIT Madras',
        service: 'Internship Report',
        topic: 'Cybersecurity Network Diagnostics',
        deadline: '2026-06-20',
        requirements: 'Report detailing network packets, port scanning, and automated firewall configuration script details.',
        status: 'Completed',
        progress: 100,
        prdText: "Report containing:\n- Network diagnostics details\n- Port scanning scripts via Nmap\n- Firewall automation via Bash/Python scripts\n- Mitigation strategies\n\nStack: Python, Bash, Nmap, LaTeX.",
        prdLink: "https://notion.so/Cybersecurity-Network-Diagnostics",
        totalPrice: 8000,
        advancePaid: 8000,
        paymentStatus: "Fully Paid",
        customTerms: "1. Project and report delivered in full.\n2. No additional revisions are included in this bundle.",
        timeline: [
          {
            id: 't1',
            date: new Date(Date.now() - 86400000 * 10).toLocaleDateString(),
            title: 'Project Initiated',
            description: 'Payment made and research constraints set.',
            status: 'Completed'
          },
          {
            id: 't2',
            date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
            title: 'Scripting Completed',
            description: 'Python scanner scripts ready and validated.',
            status: 'Completed'
          },
          {
            id: 't3',
            date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
            title: 'Report Delivered',
            description: 'Final project report compiled in LaTeX and sent to client.',
            status: 'Completed'
          }
        ]
      }
    ];

    try {
      const { error } = await supabase.from('projects').insert(mockProjects);
      if (error) throw error;
      toast.success("Mock projects successfully seeded to Supabase!");
      loadSubmissions();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to seed data: ${err.message}`);
    }
  };

  const loadPresets = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'global_presets')
          .single();
        if (!error && data && data.value) {
          setPresets(data.value);
          return;
        } else if (error && error.code !== 'PGRST116') {
          console.error("Supabase load presets error:", error);
        }
      }

      // LocalStorage fallback
      const stored = localStorage.getItem('admin_presets');
      if (stored) {
        setPresets(JSON.parse(stored));
      } else {
        localStorage.setItem('admin_presets', JSON.stringify(DEFAULT_PRESETS));
        setPresets(DEFAULT_PRESETS);
        
        if (isSupabaseConfigured) {
          await supabase.from('admin_settings').upsert({
            key: 'global_presets',
            value: DEFAULT_PRESETS
          });
        }
      }
    } catch (err) {
      console.error("Error loading presets:", err);
    }
  };

  const savePresets = async (newPresets) => {
    try {
      setPresets(newPresets);
      localStorage.setItem('admin_presets', JSON.stringify(newPresets));
      
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert({
            key: 'global_presets',
            value: newPresets
          });
        if (error) throw error;
      }
      toast.success("Settings presets saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save presets: ${err.message}`);
    }
  };

  useEffect(() => {
    // Session load
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    loadSubmissions();
    loadPresets();
  }, []);

  // Sync edit form states when selected submission changes
  useEffect(() => {
    if (selectedSubmission) {
      setEditProgress(selectedSubmission.progress !== undefined ? selectedSubmission.progress : (selectedSubmission.status === 'Completed' ? 100 : selectedSubmission.status === 'In Progress' ? 60 : 15));
      setEditClientName(selectedSubmission.name || '');
      setEditWhatsapp(selectedSubmission.whatsapp || '');
      setEditCollege(selectedSubmission.college || '');
      setEditService(selectedSubmission.service || '');
      setEditTopic(selectedSubmission.topic || '');
      setEditDeadline(selectedSubmission.deadline || '');
      setEditPrdText(selectedSubmission.prdText || selectedSubmission.requirements || '');
      setEditPrdLink(selectedSubmission.prdLink || '');
      setEditTotalPrice(selectedSubmission.totalPrice || '');
      setEditAdvancePaid(selectedSubmission.advancePaid || '');
      setEditPaymentStatus(selectedSubmission.paymentStatus || 'Pending');
      setEditCustomTerms(selectedSubmission.customTerms || '');
      setEditTimeline(selectedSubmission.timeline || []);
      
      // Default dates
      setNewMilestoneDate(new Date().toISOString().split('T')[0]);
      setNewMilestoneTitle('');
      setNewMilestoneDesc('');
    }
  }, [selectedSubmission]);

  // Handle Login using Supabase Auth, fallback to local env variables
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      });

      if (!error && data?.user) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        toast.success('Access Granted (Supabase Auth). Welcome back.');
        loadSubmissions();
        return;
      }
    }

    // Local env variables fallback comparison
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success('Access Granted (Local Env Credentials).');
      loadSubmissions();
    } else {
      toast.error('Access Denied. Invalid credentials.');
    }
  };

  // Sign out
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    toast.success('Logged out successfully.');
  };

  // Update flow pipeline status (synchronized in real-time)
  const updateStatus = async (id, newStatus) => {
    let pct = selectedSubmission?.progress;
    if (newStatus === 'Completed') pct = 100;
    else if (newStatus === 'In Progress' && pct === 100) pct = 60;

    try {
      if (isSupabaseConfigured) {
        // Update Supabase directly (only)
        const { error } = await supabase
          .from('projects')
          .update({ status: newStatus, progress: pct })
          .eq('id', id);
        if (error) throw error;
        
        const updated = submissions.map(sub => 
          sub.id === id ? { ...sub, status: newStatus, progress: pct } : sub
        );
        setSubmissions(updated);
      } else {
        // Sync Local Storage fallback (only if Supabase is offline)
        const updated = submissions.map(sub => {
          if (sub.id === id) {
            return { ...sub, status: newStatus, progress: pct };
          }
          return sub;
        });
        setSubmissions(updated);
        localStorage.setItem('contact_submissions', JSON.stringify(updated));
      }

      toast.success(`Submission status updated to ${newStatus}`);
      
      // Update selected item state
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus, progress: pct });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  // Delete project (synchronized in real-time)
  const deleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to purge this record?')) {
      try {
        if (isSupabaseConfigured) {
          // Delete from Supabase directly
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
          if (error) throw error;
          
          const filtered = submissions.filter(sub => sub.id !== id);
          setSubmissions(filtered);
        } else {
          // Sync Local Storage fallback
          const filtered = submissions.filter(sub => sub.id !== id);
          setSubmissions(filtered);
          localStorage.setItem('contact_submissions', JSON.stringify(filtered));
        }

        toast.success('Submission record purged successfully.');
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      } catch (err) {
        console.error(err);
        toast.error(`Failed to delete project: ${err.message}`);
      }
    }
  };

  // Save edits to Client Portal specifications (synchronized in real-time)
  const savePortalChanges = async () => {
    if (!selectedSubmission) return;

    const updatedSubmission = {
      ...selectedSubmission,
      name: editClientName,
      whatsapp: editWhatsapp,
      college: editCollege,
      service: editService,
      topic: editTopic,
      deadline: editDeadline,
      progress: Number(editProgress),
      prdText: editPrdText,
      prdLink: editPrdLink,
      totalPrice: editTotalPrice ? Number(editTotalPrice) : '',
      advancePaid: editAdvancePaid ? Number(editAdvancePaid) : '',
      paymentStatus: editPaymentStatus,
      customTerms: editCustomTerms,
      timeline: editTimeline
    };

    try {
      if (isSupabaseConfigured) {
        // Save to Supabase
        const { error } = await supabase
          .from('projects')
          .update({
            name: editClientName,
            whatsapp: editWhatsapp,
            college: editCollege,
            service: editService,
            topic: editTopic,
            deadline: editDeadline,
            progress: Number(editProgress),
            prdText: editPrdText,
            prdLink: editPrdLink,
            totalPrice: editTotalPrice ? Number(editTotalPrice) : null,
            advancePaid: editAdvancePaid ? Number(editAdvancePaid) : null,
            paymentStatus: editPaymentStatus,
            customTerms: editCustomTerms,
            timeline: editTimeline
          })
          .eq('id', selectedSubmission.id);
        if (error) throw error;
        
        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
      } else {
        // Sync Local Storage fallback
        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('contact_submissions', JSON.stringify(updatedSubmissions));
      }

      setSelectedSubmission(updatedSubmission);
      toast.success('Client Portal specifications updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save modifications: ${err.message}`);
    }
  };

  // Add a new milestone timeline update (synchronized in real-time)
  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) {
      toast.error("Milestone title is required.");
      return;
    }

    const newMilestone = {
      id: Date.now().toString(),
      date: newMilestoneDate ? new Date(newMilestoneDate).toLocaleDateString() : new Date().toLocaleDateString(),
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim(),
      status: 'Completed'
    };

    const updatedTimeline = [...editTimeline, newMilestone];
    setEditTimeline(updatedTimeline);

    const updatedSubmission = {
      ...selectedSubmission,
      timeline: updatedTimeline
    };

    try {
      if (isSupabaseConfigured) {
        // Save to Supabase
        const { error } = await supabase
          .from('projects')
          .update({ timeline: updatedTimeline })
          .eq('id', selectedSubmission.id);
        if (error) throw error;
        
        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
      } else {
        // Sync Local Storage fallback
        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('contact_submissions', JSON.stringify(updatedSubmissions));
      }

      setSelectedSubmission(updatedSubmission);
      setNewMilestoneTitle('');
      setNewMilestoneDesc('');
      toast.success("Timeline milestone update logged!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to record milestone: ${err.message}`);
    }
  };

  // Delete a milestone update (synchronized in real-time)
  const deleteMilestone = async (milestoneId) => {
    const updatedTimeline = editTimeline.filter(m => m.id !== milestoneId);
    setEditTimeline(updatedTimeline);

    const updatedSubmission = {
      ...selectedSubmission,
      timeline: updatedTimeline
    };

    try {
      if (isSupabaseConfigured) {
        // Save to Supabase
        const { error } = await supabase
          .from('projects')
          .update({ timeline: updatedTimeline })
          .eq('id', selectedSubmission.id);
        if (error) throw error;

        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
      } else {
        // Sync Local Storage fallback
        const updatedSubmissions = submissions.map(sub => 
          sub.id === selectedSubmission.id ? updatedSubmission : sub
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('contact_submissions', JSON.stringify(updatedSubmissions));
      }

      setSelectedSubmission(updatedSubmission);
      toast.success("Milestone record removed.");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete milestone: ${err.message}`);
    }
  };

  // Create manual project form handler (inserts to Supabase or LocalStorage fallback)
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!createName.trim() || !createWhatsapp.trim() || !createTopic.trim()) {
      toast.error("Client Name, WhatsApp, and Project Topic are required.");
      return;
    }

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newProjectId = `PRJ-${randomId}`;

    const newProject = {
      id: newProjectId,
      created_at: new Date().toISOString(),
      name: createName.trim(),
      whatsapp: createWhatsapp.trim(),
      college: createCollege.trim() || 'Custom Client',
      service: createService,
      topic: createTopic.trim(),
      deadline: createDeadline || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      requirements: createPrdText.trim(),
      status: 'Pending',
      progress: 15,
      prdText: createPrdText.trim(),
      prdLink: createPrdLink.trim(),
      totalPrice: createTotalPrice ? Number(createTotalPrice) : 0,
      advancePaid: createAdvancePaid ? Number(createAdvancePaid) : 0,
      paymentStatus: createPaymentStatus,
      customTerms: createCustomTerms.trim(),
      timeline: [
        {
          id: 't1',
          date: new Date().toLocaleDateString(),
          title: "Project Manual Setup",
          description: "Project registered and tracking index created in administrative system.",
          status: "Completed"
        }
      ]
    };

    try {
      if (isSupabaseConfigured) {
        // Write to Supabase ONLY
        const { error } = await supabase.from('projects').insert([newProject]);
        if (error) throw error;
        
        const updatedList = [newProject, ...submissions];
        setSubmissions(updatedList);
      } else {
        // Fallback to Local Storage
        const existing = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        existing.unshift(newProject);
        localStorage.setItem('contact_submissions', JSON.stringify(existing));
        
        const updatedList = [newProject, ...submissions];
        setSubmissions(updatedList);
      }

      setSelectedSubmission(newProject);
      
      // Reset creation form states
      setCreateName('');
      setCreateWhatsapp('');
      setCreateCollege('');
      setCreateService('Software Project');
      setCreateTopic('');
      setCreateDeadline('');
      setCreatePrdText('');
      setCreatePrdLink('');
      setCreateTotalPrice('');
      setCreateAdvancePaid('');
      setCreatePaymentStatus('Pending');
      setCreateCustomTerms('');
      
      setIsCreateModalOpen(false);
      toast.success(`Project ${newProjectId} created successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to create project: ${err.message}`);
    }
  };

  // Generate Base64 share link
  const generateShareLink = () => {
    if (!selectedSubmission) return;

    const payload = {
      id: selectedSubmission.id,
      created_at: selectedSubmission.created_at,
      name: selectedSubmission.name,
      whatsapp: selectedSubmission.whatsapp,
      college: selectedSubmission.college,
      service: selectedSubmission.service,
      topic: selectedSubmission.topic,
      deadline: selectedSubmission.deadline,
      status: selectedSubmission.status,
      progress: Number(editProgress),
      prdText: editPrdText,
      prdLink: editPrdLink,
      totalPrice: editTotalPrice ? Number(editTotalPrice) : 0,
      advancePaid: editAdvancePaid ? Number(editAdvancePaid) : 0,
      paymentStatus: editPaymentStatus,
      customTerms: editCustomTerms,
      timeline: editTimeline
    };

    try {
      const base64Data = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const shareUrl = `${window.location.origin}/dashboard?data=${encodeURIComponent(base64Data)}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Secure client share link copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate share link.");
    }
  };

  // Export database to projects.json file
  const exportDatabase = () => {
    const dbPayload = submissions.map(sub => {
      return {
        id: sub.id,
        created_at: sub.created_at,
        name: sub.name,
        whatsapp: sub.whatsapp,
        college: sub.college,
        service: sub.service,
        topic: sub.topic,
        deadline: sub.deadline,
        status: sub.status,
        progress: sub.progress !== undefined ? sub.progress : (sub.status === 'Completed' ? 100 : sub.status === 'In Progress' ? 60 : 15),
        prdText: sub.prdText || sub.requirements || '',
        prdLink: sub.prdLink || '',
        totalPrice: sub.totalPrice || 0,
        advancePaid: sub.advancePaid || 0,
        paymentStatus: sub.paymentStatus || 'Pending',
        customTerms: sub.customTerms || '',
        timeline: sub.timeline || []
      };
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", "projects.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Submissions database exported as projects.json. Drop it in your /public folder to deploy!");
  };

  const generateDocumentText = () => {
    if (!selectedSubmission) return "";
    
    const clientName = editClientName || selectedSubmission.name;
    const projectTopic = editTopic || selectedSubmission.topic;
    const projectService = editService || selectedSubmission.service;
    const deadline = editDeadline || selectedSubmission.deadline;
    const totalPrice = editTotalPrice || selectedSubmission.totalPrice || 0;
    const advancePaid = editAdvancePaid || selectedSubmission.advancePaid || 0;
    const balance = Math.max(0, totalPrice - advancePaid);
    const dateStr = new Date().toLocaleDateString();

    let text = "";

    if (selectedDocType === "Agreement") {
      text += `=========================================\n`;
      text += `        PROJECT SERVICE AGREEMENT        \n`;
      text += `=========================================\n`;
      text += `Date: ${dateStr}\n`;
      text += `Project ID: ${selectedSubmission.id}\n\n`;
      text += `CLIENT DETAILS:\n`;
      text += `- Name: ${clientName}\n`;
      text += `- College/Univ: ${editCollege || selectedSubmission.college || 'N/A'}\n`;
      text += `- Contact (WA): +${editWhatsapp || selectedSubmission.whatsapp}\n\n`;
      text += `PROJECT IN BRIEF:\n`;
      text += `- Service Type: ${projectService}\n`;
      text += `- Project Topic: ${projectTopic}\n`;
      text += `- Target Handover: ${deadline}\n\n`;
      
      if (includeScope) {
        text += `SCOPE OF WORK & DELIVERABLES:\n`;
        text += `${editPrdText || selectedSubmission.prdText || '- Specific modules and features as per requirements.'}\n\n`;
      }
      
      if (includePricing) {
        text += `FINANCIAL BREAKDOWN:\n`;
        text += `- Total Cost: ₹${Number(totalPrice).toLocaleString()}\n`;
        text += `- Advance Paid: ₹${Number(advancePaid).toLocaleString()}\n`;
        text += `- Balance Amount: ₹${Number(balance).toLocaleString()}\n`;
        text += `- Status: ${editPaymentStatus || selectedSubmission.paymentStatus || 'Pending'}\n\n`;
      }
      
      if (includeTerms) {
        text += `CONTRACT TERMS & POLICIES:\n`;
        text += `${editCustomTerms || selectedSubmission.customTerms || 'Standard service policies apply.'}\n\n`;
      }

      text += `-----------------------------------------\n`;
      text += `This agreement governs the development cycle of the project. By proceeding, both parties align on the scope and financial structures outlined.\n`;
      text += `-----------------------------------------\n`;
      text += `Developer: brojix\n`;
      text += `Client Signature / Approval: __________________\n`;
      text += `=========================================`;
    } else if (selectedDocType === "Invoice") {
      text += `=========================================\n`;
      text += `              TAX INVOICE                \n`;
      text += `=========================================\n`;
      text += `Invoice Date: ${dateStr}\n`;
      text += `Invoice No: INV-${selectedSubmission.id}\n`;
      text += `Due Date: ${deadline}\n\n`;
      text += `BILL TO:\n`;
      text += `- Client Name: ${clientName}\n`;
      text += `- College/Univ: ${editCollege || selectedSubmission.college || 'N/A'}\n`;
      text += `- Contact: +${editWhatsapp || selectedSubmission.whatsapp}\n\n`;
      text += `DESCRIPTION OF SERVICES:\n`;
      text += `1. Development of "${projectTopic}" (${projectService})\n\n`;
      
      if (includePricing) {
        text += `AMOUNT SUMMARY:\n`;
        text += `- Total Amount Due: ₹${Number(totalPrice).toLocaleString()}\n`;
        text += `- Advance Paid: ₹${Number(advancePaid).toLocaleString()}\n`;
        text += `- Balance Due: ₹${Number(balance).toLocaleString()}\n\n`;
      }
      
      text += `PAYMENT METHODS:\n`;
      text += `- UPI / WhatsApp Pay / Bank Transfer\n\n`;
      text += `Thank you for your business!\n`;
      text += `Issued by: brojix\n`;
      text += `=========================================`;
    } else if (selectedDocType === "Receipt") {
      text += `=========================================\n`;
      text += `             PAYMENT RECEIPT             \n`;
      text += `=========================================\n`;
      text += `Receipt Date: ${dateStr}\n`;
      text += `Receipt No: RCP-${selectedSubmission.id}\n\n`;
      text += `RECEIVED FROM:\n`;
      text += `- Name: ${clientName}\n`;
      text += `- Contact: +${editWhatsapp || selectedSubmission.whatsapp}\n\n`;
      text += `PAYMENT DETAILS:\n`;
      text += `- Project Topic: ${projectTopic}\n`;
      text += `- Amount Received: ₹${Number(advancePaid).toLocaleString()}\n`;
      text += `- Remaining Balance: ₹${Number(balance).toLocaleString()}\n`;
      text += `- Payment Reference: Advanced Payment\n\n`;
      text += `Verified by: brojix\n`;
      text += `Status: Cleared\n`;
      text += `=========================================`;
    } else if (selectedDocType === "Proposal") {
      text += `=========================================\n`;
      text += `            PROJECT PROPOSAL             \n`;
      text += `=========================================\n`;
      text += `Date: ${dateStr}\n`;
      text += `Proposal ID: PROP-${selectedSubmission.id}\n\n`;
      text += `Prepared For: ${clientName} (${editCollege || selectedSubmission.college || 'N/A'})\n`;
      text += `Prepared By: brojix\n\n`;
      text += `PROJECT CONCEPT:\n`;
      text += `Development of "${projectTopic}" service package: ${projectService}.\n\n`;
      
      if (includeScope) {
        text += `PROPOSED SCOPE & TECHNOLOGY:\n`;
        text += `${editPrdText || selectedSubmission.prdText || '- Complete design, development, and handover.'}\n\n`;
      }
      
      if (includePricing) {
        text += `PROPOSED FINANCIALS:\n`;
        text += `- Estimated Budget: ₹${Number(totalPrice).toLocaleString()}\n`;
        text += `- Target Handover Timeline: ${deadline}\n\n`;
      }
      
      text += `Next Steps:\n`;
      text += `Please review and authorize this proposal. Once approved, development will initiate upon receipt of the advance payment.\n`;
      text += `=========================================`;
    }

    return text;
  };

  const handlePrintDocument = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to download the document.");
      return;
    }

    const documentTitle = `${selectedDocType}_${selectedSubmission.id}`;
    const totalPrice = editTotalPrice || selectedSubmission.totalPrice || 0;
    const advancePaid = editAdvancePaid || selectedSubmission.advancePaid || 0;
    const balance = Math.max(0, totalPrice - advancePaid);
    
    let htmlContent = `
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap');
            @page {
              size: A4;
              margin: 1.2cm 1.5cm;
            }
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              background: #ffffff;
              padding: 0;
              margin: 0;
              line-height: 1.35;
              font-size: 11px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .brand {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 20px;
              font-weight: 700;
              color: #0f172a;
              letter-spacing: -0.05em;
              text-transform: lowercase;
            }
            .meta-info {
              text-align: right;
              font-size: 10px;
              color: #64748b;
            }
            .doc-title {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 16px;
              font-weight: 700;
              text-transform: uppercase;
              text-align: center;
              margin-bottom: 15px;
              color: #0f172a;
              letter-spacing: 0.05em;
            }
            .section {
              margin-bottom: 12px;
            }
            .section-title {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #64748b;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 3px;
              margin-bottom: 6px;
            }
            .grid-2 {
              display: flex;
              gap: 20px;
            }
            .grid-2 > * {
              flex: 1;
            }
            .info-item {
              margin-bottom: 4px;
            }
            .info-label {
              font-size: 9px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 12px;
              font-weight: 500;
              color: #0f172a;
            }
            .bullet-list {
              font-family: monospace;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 10px;
              font-size: 11px;
              color: #334155;
              white-space: pre-wrap;
              margin: 0;
            }
            .pricing-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }
            .pricing-table th, .pricing-table td {
              border: 1px solid #e2e8f0;
              padding: 6px 8px;
              text-align: left;
              font-size: 11px;
            }
            .pricing-table th {
              background: #f8fafc;
              font-weight: 600;
            }
            .pricing-table tr.total-row td {
              font-weight: 700;
              background: #f8fafc;
            }
            .signatures {
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
            .signatures > div {
              width: 42%;
            }
            .signature-line {
              border-top: 1px solid #94a3b8;
              margin-top: 30px;
              padding-top: 6px;
              font-size: 11px;
              color: #64748b;
              text-align: center;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <div class="brand">brojix</div>
              </div>
              <div class="meta-info">
                <div><strong>Document Date:</strong> ${new Date().toLocaleDateString()}</div>
                <div><strong>Project ID:</strong> ${selectedSubmission.id}</div>
                <div><strong>Status:</strong> ${editPaymentStatus || selectedSubmission.paymentStatus || 'Pending'}</div>
              </div>
            </div>

            <div class="doc-title">${selectedDocType} Document</div>

            <div class="section">
              <div class="section-title">Client Details</div>
              <div class="grid-2">
                <div>
                  <div class="info-item">
                    <div class="info-label">Client Name</div>
                    <div class="info-value">${editClientName || selectedSubmission.name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">WhatsApp Contact</div>
                    <div class="info-value">+${editWhatsapp || selectedSubmission.whatsapp}</div>
                  </div>
                </div>
                <div>
                  <div class="info-item">
                    <div class="info-label">College / University</div>
                    <div class="info-value">${editCollege || selectedSubmission.college || 'N/A'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Target Handover</div>
                    <div class="info-value">${editDeadline || selectedSubmission.deadline}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Project Context</div>
              <div class="grid-2">
                <div class="info-item">
                  <div class="info-label">Service Type</div>
                  <div class="info-value">${editService || selectedSubmission.service}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Project Topic</div>
                  <div class="info-value">${editTopic || selectedSubmission.topic}</div>
                </div>
              </div>
            </div>

            ${includeScope ? `
            <div class="section">
              <div class="section-title">Scope of Work & Deliverables</div>
              <div class="bullet-list">${editPrdText || selectedSubmission.prdText || 'Specifications pending outline.'}</div>
            </div>
            ` : ''}

            ${includePricing ? `
            <div class="section">
              <div class="section-title">Financial Summary</div>
              <table class="pricing-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Payment Status</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Development of "${editTopic || selectedSubmission.topic}" (${editService || selectedSubmission.service})</td>
                    <td>${editPaymentStatus || selectedSubmission.paymentStatus || 'Pending'}</td>
                    <td style="text-align: right;">₹${Number(totalPrice).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align: right; font-weight: 600;">Advance Paid</td>
                    <td style="text-align: right; color: #16a34a; font-weight: 600;">₹${Number(advancePaid).toLocaleString()}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="2" style="text-align: right;">Balance Due</td>
                    <td style="text-align: right; color: #dc2626;">₹${Number(balance).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : ''}

            ${includeTerms ? `
            <div class="section">
              <div class="section-title">Contract Guidelines & Terms</div>
              <div style="font-size: 11px; color: #475569; white-space: pre-wrap; font-family: monospace; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">${editCustomTerms || selectedSubmission.customTerms || 'Standard service policies apply.'}</div>
            </div>
            ` : ''}

            ${includeSignature ? `
            <div class="signatures">
              <div>
                <div class="signature-line">Authorized Signatory<br/><strong>brojix</strong></div>
              </div>
              <div>
                <div class="signature-line">Client Agreement Signature<br/><strong>${editClientName || selectedSubmission.name}</strong></div>
              </div>
            </div>
            ` : ''}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    if (!selectedSubmission) return;
    
    const clientName = editClientName || selectedSubmission.name;
    const projectTopic = editTopic || selectedSubmission.topic;
    const documentType = selectedDocType.toUpperCase();
    const totalPrice = editTotalPrice || selectedSubmission.totalPrice || 0;
    const advancePaid = editAdvancePaid || selectedSubmission.advancePaid || 0;
    const balance = Math.max(0, totalPrice - advancePaid);
    
    const payload = {
      id: selectedSubmission.id,
      created_at: selectedSubmission.created_at,
      name: editClientName,
      whatsapp: editWhatsapp,
      college: editCollege,
      service: editService,
      topic: editTopic,
      deadline: editDeadline,
      status: selectedSubmission.status,
      progress: Number(editProgress),
      prdText: editPrdText,
      prdLink: editPrdLink,
      totalPrice: editTotalPrice ? Number(editTotalPrice) : 0,
      advancePaid: editAdvancePaid ? Number(editAdvancePaid) : 0,
      paymentStatus: editPaymentStatus,
      customTerms: editCustomTerms,
      timeline: editTimeline
    };
    
    let portalLink = "";
    try {
      const base64Data = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      portalLink = `${window.location.origin}/dashboard?data=${encodeURIComponent(base64Data)}`;
    } catch (e) {
      portalLink = `${window.location.origin}/dashboard?id=${selectedSubmission.id}`;
    }

    const textMessage = `*brojix* 🚀\n\n` +
      `Hi *${clientName}*,\n` +
      `Your *${documentType}* has been compiled for your project:\n` +
      `📌 *Topic:* ${projectTopic}\n` +
      `📋 *Service:* ${editService || selectedSubmission.service}\n` +
      `📅 *Target Deadline:* ${editDeadline || selectedSubmission.deadline}\n\n` +
      `💰 *Financial Summary:* \n` +
      `- Total Cost: ₹${Number(totalPrice).toLocaleString()}\n` +
      `- Advance Paid: ₹${Number(advancePaid).toLocaleString()}\n` +
      `- Balance Due: ₹${Number(balance).toLocaleString()}\n` +
      `- Payment Status: ${editPaymentStatus}\n\n` +
      `🔗 *Live Tracker & Portal:* ${portalLink}\n\n` +
      `Please review the tracking portal link to see your scope, timelines, and payment receipts. Reach out if you have any questions!`;

    const encodedText = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/${editWhatsapp || selectedSubmission.whatsapp}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  const handleShareEmail = () => {
    if (!selectedSubmission) return;
    
    const clientName = editClientName || selectedSubmission.name;
    const projectTopic = editTopic || selectedSubmission.topic;
    const documentType = selectedDocType.toUpperCase();
    const totalPrice = editTotalPrice || selectedSubmission.totalPrice || 0;
    const advancePaid = editAdvancePaid || selectedSubmission.advancePaid || 0;
    const balance = Math.max(0, totalPrice - advancePaid);
    
    const subject = encodeURIComponent(`[brojix] Project ${selectedDocType} - ${projectTopic}`);
    
    const body = encodeURIComponent(
      `Dear ${clientName},\n\n` +
      `We have compiled the ${documentType} for your project "${projectTopic}" (${editService || selectedSubmission.service}).\n\n` +
      `Project Summary:\n` +
      `- Target Deadline: ${editDeadline || selectedSubmission.deadline}\n` +
      `- Total Pricing: INR ${Number(totalPrice).toLocaleString()}\n` +
      `- Advance Deposited: INR ${Number(advancePaid).toLocaleString()}\n` +
      `- Outstanding Balance: INR ${Number(balance).toLocaleString()}\n` +
      `- Billing Status: ${editPaymentStatus}\n\n` +
      `Detailed Specifications:\n` +
      `${editPrdText || selectedSubmission.prdText || 'See portal'}\n\n` +
      `Terms & Guidelines:\n` +
      `${editCustomTerms || selectedSubmission.customTerms || 'Standard terms apply.'}\n\n` +
      `You can check the live status tracker of your project at any time: ${window.location.origin}/dashboard?id=${selectedSubmission.id}\n\n` +
      `Best Regards,\n` +
      `brojix`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const progressCount = submissions.filter(s => s.status === 'In Progress').length;
  const completedCount = submissions.filter(s => s.status === 'Completed').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-fixed/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none"></div>

        <a href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary-fixed transition-colors duration-300 mb-8 font-label-caps text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4" /> RETURN TO PORTFOLIO
        </a>

        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 max-w-md w-full text-center relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-surface-container-high border border-primary-fixed/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-fixed" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Secure Gateway</h1>
          <p className="text-sm text-on-surface-variant mb-6 font-medium">Enter credentials to authenticate live database access.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username / Email"
              autoComplete="username"
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-sm md:px-5 md:py-4 md:text-base text-white text-center placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300"
            />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-sm md:px-5 md:py-4 md:text-base text-white text-center placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300"
            />
            <button 
              type="submit"
              className="w-full bg-primary-fixed text-on-primary-fixed py-3 md:py-4 rounded-xl font-bold hover:shadow-[0_0_25px_#d2f000] transition-all duration-300 text-sm md:text-base"
            >
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <span className="text-[11px] tracking-[0.18em] text-primary-fixed font-medium uppercase block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={exportDatabase}
            className="bg-primary-fixed/15 hover:bg-primary-fixed/25 text-primary-fixed border border-primary-fixed/20 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300"
            title="Download database as public/projects.json file"
          >
            <Download className="w-4 h-4" /> Export JSON DB
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/20 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300"
            title="Configure services, technologies, and contract preset terms"
          >
            <Settings className="w-4 h-4" /> Presets Settings
          </button>
          <a href="/" className="bg-surface-container border border-white/10 hover:border-primary-fixed/20 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" /> View Site
          </a>
          <button 
            onClick={handleLogout}
            className="bg-error/10 hover:bg-error/20 text-error border border-error/20 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-sm font-medium">Total Proposals</span>
            <Users className="w-5 h-5 text-primary-fixed" />
          </div>
          <span className="text-3xl md:text-4xl font-bold">{totalCount}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-sm font-medium">Pending Scope</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <span className="text-3xl md:text-4xl font-bold text-yellow-500">{pendingCount}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-sm font-medium">In Progress</span>
            <Layers className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-3xl md:text-4xl font-bold text-secondary">{progressCount}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-sm font-medium">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl md:text-4xl font-bold text-emerald-500">{completedCount}</span>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table Container - 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Submissions Database</h2>
            
            <div className="flex gap-3 w-full sm:max-w-md justify-end items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <input 
                  type="text"
                  placeholder="Search database..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-container border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed transition-all"
                />
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              </div>
              
              {/* Add manual project button */}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary-fixed text-on-primary-fixed font-bold px-4 py-2.5 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] active:scale-95 transition-all shrink-0 uppercase tracking-wider"
              >
                + Add Project
              </button>
            </div>
          </div>

          {/* Database Empty Banner for Supabase */}
          {isSupabaseConfigured && submissions.length === 0 && (
            <div className="glass-panel p-8 rounded-2xl border border-primary-fixed/20 text-center space-y-4 shadow-xl">
              <Sparkles className="w-8 h-8 text-primary-fixed mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Live Database Connected</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  Your Supabase cloud database is successfully connected but has no active project logs. Seed default mock projects to test the interface.
                </p>
              </div>
              <button 
                onClick={seedMockDataToSupabase}
                className="bg-primary-fixed text-on-primary-fixed font-bold px-5 py-2.5 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] transition-all active:scale-95"
              >
                Seed Mock Projects to Supabase
              </button>
            </div>
          )}

          <div className="glass-panel rounded-2xl border border-white/5 overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[550px]">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                  <th className="py-4 px-6">Client Details</th>
                  <th className="py-4 px-6">Service & Topic</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-on-surface-variant">No submission payloads matched the filters.</td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedSubmission?.id === sub.id ? 'bg-primary-fixed/[0.03]' : ''}`}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{sub.name}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">{sub.college}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-primary-fixed text-sm">{sub.service}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5 max-w-[150px] truncate">{sub.topic}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                          sub.status === 'In Progress' ? 'bg-secondary/10 text-secondary' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-2 hover:text-primary-fixed hover:bg-white/5 rounded-lg transition-all"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteSubmission(sub.id)}
                            className="p-2 hover:text-error hover:bg-white/5 rounded-lg transition-all"
                            title="Purge Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Pane - 5 Columns */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Selected Payload</h2>
          
          {selectedSubmission ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-fixed/5 w-32 h-32 rounded-full blur-2xl pointer-events-none"></div>

              {/* Header metadata */}
              <div>
                <span className="text-[10px] font-label-caps text-secondary uppercase tracking-widest block mb-1">
                  SUBMISSION METADATA
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight">{selectedSubmission.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1 font-medium">{selectedSubmission.college}</p>
              </div>

              {/* Sub-navigation tabs inside selected details */}
              <div className="flex border-b border-white/5 text-[11px] text-center">
                <button 
                  onClick={() => setActiveTab('request')}
                  className={`flex-1 pb-3 font-semibold transition-all ${activeTab === 'request' ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Request Info
                </button>
                <button 
                  onClick={() => setActiveTab('portal')}
                  className={`flex-1 pb-3 font-semibold transition-all ${activeTab === 'portal' ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Portal Spec
                </button>
                <button 
                  onClick={() => setActiveTab('milestones')}
                  className={`flex-1 pb-3 font-semibold transition-all ${activeTab === 'milestones' ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Milestones
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 pb-3 font-semibold transition-all ${activeTab === 'documents' ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Agreement / Docs
                </button>
              </div>

              {/* Tab Content: Request Info */}
              {activeTab === 'request' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 text-xs">
                    <div>
                      <div className="text-on-surface-variant text-[10px] mb-1 uppercase tracking-wider font-semibold">SERVICE</div>
                      <div className="font-bold text-primary-fixed">{selectedSubmission.service}</div>
                    </div>
                    <div>
                      <div className="text-on-surface-variant text-[10px] mb-1 uppercase tracking-wider font-semibold">DEADLINE</div>
                      <div className="font-bold text-white">{selectedSubmission.deadline}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-on-surface-variant text-[10px] mb-2 uppercase tracking-wider font-semibold">PROJECT TOPIC</div>
                    <div className="bg-surface-container/40 border border-white/5 p-4 rounded-xl text-white font-semibold text-sm">
                      {selectedSubmission.topic}
                    </div>
                  </div>

                  <div>
                    <div className="text-on-surface-variant text-[10px] mb-2 uppercase tracking-wider font-semibold">ORIGINAL BRIEF</div>
                    <div className="bg-surface-container/40 border border-white/5 p-4 rounded-xl text-xs leading-relaxed text-on-surface-variant max-h-48 overflow-y-auto font-mono">
                      {selectedSubmission.requirements || 'No specific requirements payload.'}
                    </div>
                  </div>

                  <div>
                    <div className="text-on-surface-variant text-[10px] mb-2 uppercase tracking-wider font-semibold">FLOW PIPELINE STATUS</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['Pending', 'In Progress', 'Completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedSubmission.id, status)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all duration-300 border ${
                            selectedSubmission.status === status
                              ? status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
                                status === 'In Progress' ? 'bg-secondary/10 border-secondary text-secondary' :
                                'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                              : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <a 
                      href={`https://wa.me/${selectedSubmission.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-500 font-bold py-3 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp Client
                    </a>
                  </div>
                </div>
              )}

              {/* Tab Content: Client Portal Specs */}
              {activeTab === 'portal' && (
                <div className="space-y-4">
                  {/* Progress percentage */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[10px] text-on-surface-variant font-semibold">
                      <span>PROGRESS LEVEL ({editProgress}%)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={editProgress}
                        onChange={(e) => setEditProgress(Number(e.target.value))}
                        className="flex-1 accent-primary-fixed cursor-pointer bg-white/10 rounded-lg h-2"
                      />
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={editProgress}
                        onChange={(e) => setEditProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-16 text-center text-xs bg-surface-container border border-white/10 rounded px-1.5 py-1 text-white"
                      />
                    </div>
                  </div>

                  {/* Pricing and payments */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">TOTAL PRICE (₹)</label>
                      <input 
                        type="number"
                        value={editTotalPrice}
                        onChange={(e) => setEditTotalPrice(e.target.value)}
                        placeholder="e.g. 15000"
                        className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">ADVANCE PAID (₹)</label>
                      <input 
                        type="number"
                        value={editAdvancePaid}
                        onChange={(e) => setEditAdvancePaid(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                  </div>

                  {/* Payment Status select */}
                  <div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PAYMENT STATUS</label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value)}
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Fully Paid">Fully Paid</option>
                      <option value="Estimate Pending">Estimate Pending</option>
                    </select>
                  </div>

                  {/* PRD URL Link */}
                  <div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">SHARED PRD LINK (NOTION / DRIVE)</label>
                    <input 
                      type="url"
                      value={editPrdLink}
                      onChange={(e) => setEditPrdLink(e.target.value)}
                      placeholder="https://notion.so/project-specification"
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                    />
                  </div>

                  {/* PRD Scope specification text */}
                  <div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">QUICK-SELECT SCOPE / TECH</label>
                    <div className="flex flex-wrap gap-1 mb-2 max-h-20 overflow-y-auto bg-surface-container-lowest/60 p-2 rounded-lg border border-white/5">
                      {presets.technologies.map(tech => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            const lineToAdd = `- ${tech}`;
                            const lines = editPrdText ? editPrdText.split('\n') : [];
                            if (!lines.includes(lineToAdd)) {
                              setEditPrdText(prev => prev ? `${prev}\n${lineToAdd}` : lineToAdd);
                            } else {
                              setEditPrdText(prev => prev.split('\n').filter(l => l !== lineToAdd).join('\n'));
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all ${
                            editPrdText && editPrdText.includes(`- ${tech}`)
                              ? 'bg-primary-fixed/20 border-primary-fixed text-primary-fixed'
                              : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PRD SCOPE SPECIFICATIONS</label>
                    <textarea 
                      rows="4"
                      value={editPrdText}
                      onChange={(e) => setEditPrdText(e.target.value)}
                      placeholder="Write full features, modules, stack details..."
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg p-3 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                    />
                  </div>

                  {/* Custom terms */}
                  <div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">PRESET PAYMENT TERM</label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const termText = `Payment Structure:\n- ${e.target.value}`;
                              setEditCustomTerms(prev => {
                                const lines = prev ? prev.split('\n') : [];
                                const filtered = lines.filter(l => !l.startsWith('Payment Structure:') && !l.startsWith('- 50%') && !l.startsWith('- 30%') && !l.startsWith('- 100%'));
                                return [termText, ...filtered].join('\n');
                              });
                            }
                          }}
                          className="w-full text-[10px] bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        >
                          <option value="">-- Choose Payment --</option>
                          {presets.paymentTerms.map(term => (
                            <option key={term} value={term}>{term}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">QUICK-SELECT CLAUSES</label>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto bg-surface-container-lowest/60 p-1 rounded border border-white/5">
                          {presets.contractClauses.map((clause, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const lineToAdd = clause;
                                const lines = editCustomTerms ? editCustomTerms.split('\n') : [];
                                if (!lines.includes(lineToAdd)) {
                                  setEditCustomTerms(prev => prev ? `${prev}\n${lineToAdd}` : lineToAdd);
                                } else {
                                  setEditCustomTerms(prev => prev.split('\n').filter(l => l !== lineToAdd).join('\n'));
                                }
                              }}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-semibold border transition-all ${
                                editCustomTerms && editCustomTerms.includes(clause)
                                  ? 'bg-secondary/20 border-secondary text-secondary'
                                  : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white'
                              }`}
                              title={clause}
                            >
                              C{idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PROJECT CONTRACT TERMS</label>
                    <textarea 
                      rows="3"
                      value={editCustomTerms}
                      onChange={(e) => setEditCustomTerms(e.target.value)}
                      placeholder="Leave blank to use default portal terms."
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg p-3 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-3 border-t border-white/5">
                    <button
                      onClick={savePortalChanges}
                      className="flex-1 bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-bold py-2.5 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] transition-all"
                    >
                      Save Specifications
                    </button>
                    <button
                      onClick={generateShareLink}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      title="Generate Client Portal share link containing portal specs"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share Link
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content: Milestones Log */}
              {activeTab === 'milestones' && (
                <div className="space-y-6">
                  {/* Current Milestones List */}
                  <div>
                    <div className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mb-3">Milestones List</div>
                    
                    {editTimeline.length === 0 ? (
                      <div className="text-center py-4 bg-surface-container/20 border border-white/5 rounded-xl text-xs text-on-surface-variant font-mono">
                        No custom milestones updates logged yet.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {editTimeline.map((m) => (
                          <div key={m.id} className="flex justify-between items-start gap-4 p-3 bg-surface-container/30 border border-white/5 rounded-xl text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-on-surface-variant font-medium text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{m.date}</span>
                                <span className="font-bold text-white">{m.title}</span>
                              </div>
                              {m.description && <p className="text-on-surface-variant leading-relaxed text-[11px]">{m.description}</p>}
                            </div>
                            <button 
                              onClick={() => deleteMilestone(m.id)}
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Milestone Form */}
                  <form onSubmit={addMilestone} className="border-t border-white/5 pt-4 space-y-3">
                    <div className="text-[10px] text-primary-fixed font-bold uppercase tracking-widest">LOG NEW MILESTONE</div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">MILESTONE TITLE</label>
                        <input 
                          type="text" 
                          required
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          placeholder="e.g. Design Approved"
                          className="w-full text-xs bg-surface-container border border-white/10 rounded px-2.5 py-1.5 text-white placeholder-on-surface-variant"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">DATE</label>
                        <input 
                          type="date"
                          value={newMilestoneDate}
                          onChange={(e) => setNewMilestoneDate(e.target.value)}
                          className="w-full text-xs bg-surface-container border border-white/10 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">DESCRIPTION / SUMMARY</label>
                      <input 
                        type="text"
                        value={newMilestoneDesc}
                        onChange={(e) => setNewMilestoneDesc(e.target.value)}
                        placeholder="Details about work items completed..."
                        className="w-full text-xs bg-surface-container border border-white/10 rounded px-2.5 py-1.5 text-white placeholder-on-surface-variant font-mono"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-secondary-container/40 hover:bg-secondary-container/60 text-secondary border border-secondary/20 font-semibold py-2 rounded-lg text-xs transition-all"
                    >
                      + Add Milestone Update
                    </button>
                  </form>
                </div>
              )}

              {/* Tab Content: Agreement & Invoice Generator */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">DOCUMENT TYPE</label>
                    <div className="grid grid-cols-4 gap-1 bg-surface-container p-1 rounded-xl border border-white/5">
                      {['Agreement', 'Proposal', 'Invoice', 'Receipt'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedDocType(type)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            selectedDocType === type
                              ? 'bg-primary-fixed text-on-primary-fixed hover:shadow-[0_0_10px_#d2f000]'
                              : 'text-on-surface-variant hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sections to include */}
                  <div className="bg-surface-container/20 border border-white/5 p-3 rounded-xl space-y-2">
                    <div className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">INCLUDE SECTIONS</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {selectedDocType !== 'Receipt' && (
                        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={includeScope}
                            onChange={(e) => setIncludeScope(e.target.checked)}
                            className="accent-primary-fixed"
                          />
                          Scope / PRD
                        </label>
                      )}
                      {selectedDocType !== 'Receipt' && (
                        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={includePricing}
                            onChange={(e) => setIncludePricing(e.target.checked)}
                            className="accent-primary-fixed"
                          />
                          Financials
                        </label>
                      )}
                      {['Agreement', 'Proposal'].includes(selectedDocType) && (
                        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={includeTerms}
                            onChange={(e) => setIncludeTerms(e.target.checked)}
                            className="accent-primary-fixed"
                          />
                          Guidelines & Terms
                        </label>
                      )}
                      {['Agreement', 'Invoice', 'Receipt'].includes(selectedDocType) && (
                        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={includeSignature}
                            onChange={(e) => setIncludeSignature(e.target.checked)}
                            className="accent-primary-fixed"
                          />
                          Signature Line
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Option to Edit Content */}
                  <div className="bg-surface-container/20 border border-white/5 p-3.5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">EDIT DOCUMENT CONTENT</span>
                      <button 
                        onClick={savePortalChanges}
                        className="bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all hover:shadow-[0_0_10px_#d2f000]"
                        title="Save edited document fields to backend database"
                      >
                        Save to Database
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">CLIENT NAME</label>
                        <input
                          type="text"
                          value={editClientName}
                          onChange={(e) => setEditClientName(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">WHATSAPP CONTACT</label>
                        <input
                          type="text"
                          value={editWhatsapp}
                          onChange={(e) => setEditWhatsapp(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">COLLEGE / UNIVERSITY</label>
                        <input
                          type="text"
                          value={editCollege}
                          onChange={(e) => setEditCollege(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">SERVICE TYPE</label>
                        <input
                          type="text"
                          value={editService}
                          onChange={(e) => setEditService(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">PROJECT TOPIC</label>
                        <input
                          type="text"
                          value={editTopic}
                          onChange={(e) => setEditTopic(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">TARGET HANDOVER</label>
                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-0.5 text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant font-semibold block mb-0.5">BILLING STATUS</label>
                        <select
                          value={editPaymentStatus}
                          onChange={(e) => setEditPaymentStatus(e.target.value)}
                          className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-fixed"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Partially Paid">Partially Paid</option>
                          <option value="Fully Paid">Fully Paid</option>
                          <option value="Estimate Pending">Estimate Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Document live preview */}
                  <div>
                    <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">LIVE DOCUMENT PREVIEW</label>
                    <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-200 text-xs md:text-sm font-sans max-h-96 overflow-y-auto leading-relaxed relative">
                      {/* Inner clean styling */}
                      <div className="border-b-2 border-slate-200 pb-3 mb-4 flex justify-between items-start">
                        <div>
                          <div className="font-bold text-base text-slate-900 tracking-tight font-display lowercase">brojix</div>
                        </div>
                        <div className="text-right text-[9px] text-slate-500 font-mono">
                          <div><strong>ID:</strong> {selectedSubmission.id}</div>
                          <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="text-center font-bold text-sm text-slate-900 uppercase tracking-widest mb-4">
                        {selectedDocType} Document
                      </div>

                      <div className="mb-4">
                        <div className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Client Profile</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><strong>Client Name:</strong> {editClientName || selectedSubmission.name}</div>
                          <div><strong>WhatsApp:</strong> +{editWhatsapp || selectedSubmission.whatsapp}</div>
                          <div className="col-span-2"><strong>College:</strong> {editCollege || selectedSubmission.college || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Brief</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><strong>Service:</strong> {editService || selectedSubmission.service}</div>
                          <div><strong>Topic:</strong> {editTopic || selectedSubmission.topic}</div>
                          <div><strong>Target Handover:</strong> {editDeadline || selectedSubmission.deadline}</div>
                        </div>
                      </div>

                      {includeScope && selectedDocType !== 'Receipt' && (
                        <div className="mb-4">
                          <div className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Scope of Work</div>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[11px] font-mono whitespace-pre-wrap text-slate-600">
                            {editPrdText || selectedSubmission.prdText || 'Specifications outline pending.'}
                          </div>
                        </div>
                      )}

                      {includePricing && selectedDocType !== 'Receipt' && (
                        <div className="mb-4">
                          <div className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Financial Summary</div>
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                                <th className="p-2 border border-slate-100">Item</th>
                                <th className="p-2 border border-slate-100 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border border-slate-100 font-medium">Development - {editTopic || selectedSubmission.topic}</td>
                                <td className="p-2 border border-slate-100 text-right">₹{Number(editTotalPrice || selectedSubmission.totalPrice || 0).toLocaleString()}</td>
                              </tr>
                              <tr className="text-emerald-700 bg-emerald-50/20 font-medium">
                                <td className="p-2 border border-slate-100 text-right">Advance Paid</td>
                                <td className="p-2 border border-slate-100 text-right">₹{Number(editAdvancePaid || selectedSubmission.advancePaid || 0).toLocaleString()}</td>
                              </tr>
                              <tr className="text-red-700 bg-red-50/20 font-bold">
                                <td className="p-2 border border-slate-100 text-right">Balance Due</td>
                                <td className="p-2 border border-slate-100 text-right">₹{Number((editTotalPrice || selectedSubmission.totalPrice || 0) - (editAdvancePaid || selectedSubmission.advancePaid || 0)).toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedDocType === 'Receipt' && (
                        <div className="mb-4 bg-emerald-50/30 border border-emerald-100 rounded-xl p-3 text-xs text-slate-700">
                          <div className="font-bold text-emerald-800 mb-1">Payment Received Receipt</div>
                          <div>We hereby acknowledge receipt of advance payment amounting to <strong>₹{Number(editAdvancePaid || selectedSubmission.advancePaid || 0).toLocaleString()}</strong> towards the development of the project <em>"{editTopic || selectedSubmission.topic}"</em>.</div>
                          <div className="mt-2 text-[10px] text-slate-500">Remaining Balance: ₹{Number((editTotalPrice || selectedSubmission.totalPrice || 0) - (editAdvancePaid || selectedSubmission.advancePaid || 0)).toLocaleString()}</div>
                        </div>
                      )}

                      {includeTerms && ['Agreement', 'Proposal'].includes(selectedDocType) && (
                        <div className="mb-4">
                          <div className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Guidelines</div>
                          <div className="text-[10px] font-mono bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-slate-500 whitespace-pre-wrap leading-relaxed">
                            {editCustomTerms || selectedSubmission.customTerms || 'Standard service policies apply.'}
                          </div>
                        </div>
                      )}

                      {includeSignature && ['Agreement', 'Invoice', 'Receipt'].includes(selectedDocType) && (
                        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center text-[10px]">
                          <div>
                            <div className="border-t border-slate-300 pt-1 text-slate-500 font-bold">Authorized Signatory<br/><strong>brojix</strong></div>
                          </div>
                          <div>
                            <div className="border-t border-slate-300 pt-1 text-slate-500 font-bold">Client Authorization Signature<br/><strong>{editClientName || selectedSubmission.name}</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dispatch options */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={handlePrintDocument}
                      className="flex-1 min-w-[80px] bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-bold py-2 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:shadow-[0_0_15px_#d2f000] transition-all"
                    >
                      <Printer className="w-3 h-3" /> Print / PDF
                    </button>
                    <button
                      onClick={() => {
                        const txt = generateDocumentText();
                        navigator.clipboard.writeText(txt);
                        toast.success("Document text copied to clipboard!");
                      }}
                      className="flex-1 min-w-[80px] bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all"
                      title="Copy plain text document to clipboard"
                    >
                      <Copy className="w-3 h-3" /> Copy Text
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex-1 min-w-[80px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold py-2 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </button>
                    <button
                      onClick={handleShareEmail}
                      className="flex-1 min-w-[80px] bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <Mail className="w-3 h-3" /> Email Doc
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-on-surface-variant">
              Select a submission entry from the database grid to inspect details and metadata payloads.
            </div>
          )}
        </div>
      </div>

      {/* Configuration Presets Modal Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => {
              loadPresets();
              setIsSettingsOpen(false);
            }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          ></div>
          
          {/* Modal Panel */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-secondary tracking-widest uppercase block mb-1">SYSTEM CONFIGURATION</span>
                <h3 className="text-2xl font-bold text-white font-display-md">Project Presets Settings</h3>
              </div>
              <button 
                onClick={() => {
                  loadPresets();
                  setIsSettingsOpen(false);
                }}
                className="text-on-surface-variant hover:text-white p-1.5 bg-white/5 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 text-[11px] text-center gap-1">
              {[
                { id: 'services', label: 'Services & Pricing' },
                { id: 'tech', label: 'Tech & Features' },
                { id: 'payment', label: 'Payment Terms' },
                { id: 'clauses', label: 'Contract Clauses' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsActiveTab(tab.id)}
                  className={`flex-1 pb-3 font-semibold transition-all ${
                    settingsActiveTab === tab.id 
                      ? 'text-secondary border-b-2 border-secondary' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content: Services */}
            {settingsActiveTab === 'services' && (
              <div className="space-y-4">
                <div className="text-xs text-on-surface-variant mb-2">Configure services and their default pricing to enable instant creation click-flows.</div>
                
                {/* Services list */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {presets.services.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-surface-container/30 border border-white/5 p-3 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-white">{service.name}</span>
                        <span className="ml-2 text-primary-fixed">₹{service.price.toLocaleString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = presets.services.filter((_, i) => i !== idx);
                          setPresets({ ...presets, services: updated });
                        }}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Remove Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Service form */}
                <div className="flex gap-2 items-end border-t border-white/5 pt-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-on-surface-variant font-semibold block mb-1">SERVICE NAME</label>
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Website Overhaul"
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-[9px] text-on-surface-variant font-semibold block mb-1">DEFAULT PRICE (₹)</label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="12000"
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newServiceName.trim() || !newServicePrice) {
                        toast.error("Enter both service name and default price.");
                        return;
                      }
                      const updated = [...presets.services, { name: newServiceName.trim(), price: Number(newServicePrice) }];
                      setPresets({ ...presets, services: updated });
                      setNewServiceName('');
                      setNewServicePrice('');
                      toast.success("Service added. Save changes below.");
                    }}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 h-[34px] hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Tab content: Technologies */}
            {settingsActiveTab === 'tech' && (
              <div className="space-y-4">
                <div className="text-xs text-on-surface-variant mb-2">Manage technology tags. Click tags in creation or specification forms to instantly build project briefs without writing.</div>
                
                {/* Tech chips list */}
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto bg-surface-container-lowest/40 border border-white/5 p-3 rounded-2xl">
                  {presets.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="inline-flex items-center gap-1.5 bg-surface-container border border-white/5 text-white font-medium px-2.5 py-1 rounded-xl text-[10px]"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = presets.technologies.filter(t => t !== tech);
                          setPresets({ ...presets, technologies: updated });
                        }}
                        className="text-on-surface-variant hover:text-error transition-colors font-bold text-[9px] ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tech form */}
                <div className="flex gap-2 items-end border-t border-white/5 pt-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-on-surface-variant font-semibold block mb-1">NEW TECHNOLOGY / KEYWORD</label>
                    <input
                      type="text"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      placeholder="e.g. Next.js"
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTechName.trim()) {
                            const updated = [...presets.technologies, newTechName.trim()];
                            setPresets({ ...presets, technologies: updated });
                            setNewTechName('');
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTechName.trim()) return;
                      const updated = [...presets.technologies, newTechName.trim()];
                      setPresets({ ...presets, technologies: updated });
                      setNewTechName('');
                    }}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 h-[34px] hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Tab content: Payment Terms */}
            {settingsActiveTab === 'payment' && (
              <div className="space-y-4">
                <div className="text-xs text-on-surface-variant mb-2">Configure standard payment structure presets to insert them into agreement specs.</div>
                
                {/* Terms list */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {presets.paymentTerms.map((term, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-surface-container/30 border border-white/5 p-3 rounded-xl text-xs">
                      <span className="text-white font-medium">{term}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = presets.paymentTerms.filter((_, i) => i !== idx);
                          setPresets({ ...presets, paymentTerms: updated });
                        }}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Payment Term form */}
                <div className="flex gap-2 items-end border-t border-white/5 pt-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-on-surface-variant font-semibold block mb-1">NEW PAYMENT STRUCTURE PRESET</label>
                    <input
                      type="text"
                      value={newPaymentTerm}
                      onChange={(e) => setNewPaymentTerm(e.target.value)}
                      placeholder="e.g. 40% Advance, 60% on completion"
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPaymentTerm.trim()) return;
                      const updated = [...presets.paymentTerms, newPaymentTerm.trim()];
                      setPresets({ ...presets, paymentTerms: updated });
                      setNewPaymentTerm('');
                    }}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 h-[34px] hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Tab content: Contract Clauses */}
            {settingsActiveTab === 'clauses' && (
              <div className="space-y-4">
                <div className="text-xs text-on-surface-variant mb-2">Configure default contract guidelines or terms that govern standard agreements.</div>
                
                {/* Clauses list */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {presets.contractClauses.map((clause, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 bg-surface-container/30 border border-white/5 p-3 rounded-xl text-xs">
                      <div className="text-white leading-relaxed flex-1">
                        <strong>Clause {idx + 1}:</strong> {clause}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = presets.contractClauses.filter((_, i) => i !== idx);
                          setPresets({ ...presets, contractClauses: updated });
                        }}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Clause form */}
                <div className="flex gap-2 items-end border-t border-white/5 pt-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-on-surface-variant font-semibold block mb-1">NEW CONTRACT CLAUSE</label>
                    <input
                      type="text"
                      value={newClause}
                      onChange={(e) => setNewClause(e.target.value)}
                      placeholder="e.g. Scope expansion will incur extra estimation cycles."
                      className="w-full text-xs bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newClause.trim()) return;
                      const updated = [...presets.contractClauses, newClause.trim()];
                      setPresets({ ...presets, contractClauses: updated });
                      setNewClause('');
                    }}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 h-[34px] hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button 
                type="button"
                onClick={() => {
                  loadPresets();
                  setIsSettingsOpen(false);
                }}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl font-bold text-center transition-all text-xs"
              >
                Cancel / Revert
              </button>
              <button 
                type="button"
                onClick={() => {
                  savePresets(presets);
                  setIsSettingsOpen(false);
                }}
                className="flex-1 bg-secondary text-on-secondary hover:shadow-[0_0_20px_rgba(220,184,255,0.6)] py-3 rounded-xl font-bold transition-all text-xs"
              >
                Save & Apply Presets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Project Creation Modal Overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCreateModalOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          ></div>
          
          {/* Modal Panel */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-primary-fixed tracking-widest uppercase block mb-1">ADMINISTRATIVE ACTION</span>
                <h3 className="text-2xl font-bold text-white font-display-md">Create New Project</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-on-surface-variant hover:text-white p-1.5 bg-white/5 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Name */}
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">CLIENT NAME *</label>
                  <input 
                    type="text" 
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                {/* WhatsApp */}
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">WHATSAPP NUMBER *</label>
                  <input 
                    type="text" 
                    required
                    value={createWhatsapp}
                    onChange={(e) => setCreateWhatsapp(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* College */}
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">COLLEGE / UNIVERSITY</label>
                  <input 
                    type="text" 
                    value={createCollege}
                    onChange={(e) => setCreateCollege(e.target.value)}
                    placeholder="e.g. MITS University"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                {/* Service Dropdown */}
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">SERVICE TYPE</label>
                  <select 
                    value={createService}
                    onChange={(e) => {
                      setCreateService(e.target.value);
                      const match = presets.services.find(s => s.name === e.target.value);
                      if (match) {
                        setCreateTotalPrice(match.price);
                      }
                    }}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                  >
                    {presets.services.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic & Target Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PROJECT TOPIC *</label>
                  <input 
                    type="text" 
                    required
                    value={createTopic}
                    onChange={(e) => setCreateTopic(e.target.value)}
                    placeholder="e.g. AI Resume Analyzer"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">TARGET DEADLINE</label>
                  <input 
                    type="date" 
                    value={createDeadline}
                    onChange={(e) => setCreateDeadline(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              {/* Pricing, Advance, Payment Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">TOTAL COST (₹)</label>
                  <input 
                    type="number" 
                    value={createTotalPrice}
                    onChange={(e) => setCreateTotalPrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">ADVANCE PAID (₹)</label>
                  <input 
                    type="number" 
                    value={createAdvancePaid}
                    onChange={(e) => setCreateAdvancePaid(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PAYMENT STATUS</label>
                  <select 
                    value={createPaymentStatus}
                    onChange={(e) => setCreatePaymentStatus(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Estimate Pending">Estimate Pending</option>
                  </select>
                </div>
              </div>

              {/* Shared Link & Requirements */}
              <div>
                <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">SHARED GOOGLE DOC / NOTION LINK</label>
                <input 
                  type="url" 
                  value={createPrdLink}
                  onChange={(e) => setCreatePrdLink(e.target.value)}
                  placeholder="https://notion.so/my-docs"
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* Quick Tech Scope Selector */}
              <div>
                <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">QUICK-SELECT SCOPE / TECH</label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-24 overflow-y-auto bg-surface-container-lowest p-2 rounded-lg border border-white/5">
                  {presets.technologies.map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        const lineToAdd = `- ${tech}`;
                        const lines = createPrdText ? createPrdText.split('\n') : [];
                        if (!lines.includes(lineToAdd)) {
                          setCreatePrdText(prev => prev ? `${prev}\n${lineToAdd}` : lineToAdd);
                        } else {
                          setCreatePrdText(prev => prev.split('\n').filter(l => l !== lineToAdd).join('\n'));
                        }
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                        createPrdText && createPrdText.includes(`- ${tech}`)
                          ? 'bg-primary-fixed/20 border-primary-fixed text-primary-fixed'
                          : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">INITIAL SPECIFICATIONS / PRD BRIEF</label>
                <textarea 
                  rows="3"
                  value={createPrdText}
                  onChange={(e) => setCreatePrdText(e.target.value)}
                  placeholder="Paste details and feature requirements list here..."
                  className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* Quick Terms & Clauses Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">PRESET PAYMENT TERM</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const termText = `Payment Structure:\n- ${e.target.value}`;
                        setCreateCustomTerms(prev => {
                          const lines = prev ? prev.split('\n') : [];
                          const filtered = lines.filter(l => !l.startsWith('Payment Structure:') && !l.startsWith('- 50%') && !l.startsWith('- 30%') && !l.startsWith('- 100%'));
                          return [termText, ...filtered].join('\n');
                        });
                      }
                    }}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="">-- Choose Preset Payment Term --</option>
                    {presets.paymentTerms.map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">QUICK-SELECT CLAUSES</label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-surface-container-lowest p-2 rounded-lg border border-white/5">
                    {presets.contractClauses.map((clause, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const lineToAdd = clause;
                          const lines = createCustomTerms ? createCustomTerms.split('\n') : [];
                          if (!lines.includes(lineToAdd)) {
                            setCreateCustomTerms(prev => prev ? `${prev}\n${lineToAdd}` : lineToAdd);
                          } else {
                            setCreateCustomTerms(prev => prev.split('\n').filter(l => l !== lineToAdd).join('\n'));
                          }
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                          createCustomTerms && createCustomTerms.includes(clause)
                            ? 'bg-secondary/20 border-secondary text-secondary'
                            : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white'
                        }`}
                        title={clause}
                      >
                        Clause {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant font-semibold block mb-1">CUSTOM CONTRACT TERMS & NOTES</label>
                <textarea 
                  rows="2"
                  value={createCustomTerms}
                  onChange={(e) => setCreateCustomTerms(e.target.value)}
                  placeholder="Enter custom guidelines specific to this project, if any."
                  className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-white placeholder-on-surface-variant font-mono focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl font-bold text-center transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim py-3 rounded-xl font-bold hover:shadow-[0_0_20px_#d2f000] transition-all"
                >
                  Create & Launch Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
