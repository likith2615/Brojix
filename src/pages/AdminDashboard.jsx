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
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Tabs in Details Pane: 'request' | 'portal' | 'milestones'
  const [activeTab, setActiveTab] = useState('request');

  // Client Portal Form States
  const [editProgress, setEditProgress] = useState(0);
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

  useEffect(() => {
    // Session load
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    loadSubmissions();
  }, []);

  // Sync edit form states when selected submission changes
  useEffect(() => {
    if (selectedSubmission) {
      setEditProgress(selectedSubmission.progress !== undefined ? selectedSubmission.progress : (selectedSubmission.status === 'Completed' ? 100 : selectedSubmission.status === 'In Progress' ? 60 : 15));
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
              <div className="flex border-b border-white/5 text-xs text-center">
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
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-on-surface-variant">
              Select a submission entry from the database grid to inspect details and metadata payloads.
            </div>
          )}
        </div>
      </div>

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
                    onChange={(e) => setCreateService(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="Software Project">Software Project</option>
                    <option value="Internship Report">Internship Report</option>
                    <option value="Project + Report Bundle">Project + Report Bundle</option>
                    <option value="Custom Requirement">Custom Requirement</option>
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
