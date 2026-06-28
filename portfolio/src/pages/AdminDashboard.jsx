import React, { useState, useEffect } from 'react';
import { Shield, Users, Layers, Calendar, CheckCircle, Clock, Trash2, Edit3, MessageSquare, ArrowLeft, LogOut, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Admin credentials — set VITE_ADMIN_USER and VITE_ADMIN_PASS in Netlify environment variables
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USER || '';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || '';

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Load submissions from LocalStorage or seed mock data if empty
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
          status: 'In Progress'
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
          status: 'Pending'
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
          status: 'Completed'
        }
      ];
      localStorage.setItem('contact_submissions', JSON.stringify(mockSubmissions));
      stored = mockSubmissions;
    }
    setSubmissions(stored);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success('Access Granted. Welcome back, Admin.');
    } else {
      toast.error('Access Denied. Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    toast.success('Logged out successfully.');
  };

  const updateStatus = (id, newStatus) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: newStatus };
      }
      return sub;
    });
    setSubmissions(updated);
    localStorage.setItem('contact_submissions', JSON.stringify(updated));
    toast.success(`Submission status updated to ${newStatus}`);
  };

  const deleteSubmission = (id) => {
    if (window.confirm('Are you sure you want to purge this record?')) {
      const filtered = submissions.filter(sub => sub.id !== id);
      setSubmissions(filtered);
      localStorage.setItem('contact_submissions', JSON.stringify(filtered));
      toast.success('Submission record purged successfully.');
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculations
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const progressCount = submissions.filter(s => s.status === 'In Progress').length;
  const completedCount = submissions.filter(s => s.status === 'Completed').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Glow Effects */}
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
          <p className="text-sm text-on-surface-variant mb-6">Enter password credentials to access submission database.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white text-center placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300"
            />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white text-center placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300"
            />
            <button 
              type="submit"
              className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-xl font-bold hover:shadow-[0_0_25px_#d2f000] transition-all duration-300"
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
        <div className="flex gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Submissions Database</h2>
            {/* Search Bar */}
            <div className="relative max-w-xs w-full">
              <input 
                type="text"
                placeholder="Search database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed transition-all"
              />
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-white/5 overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                  <th className="py-4 px-6">Client Details</th>
                  <th className="py-4 px-6">Service & Topic</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-on-surface-variant">No submission payloads matched the filters.</td>
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
                        <div className="text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-white/40" />
                          {sub.deadline}
                        </div>
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

        {/* Details Pane */}
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Selected Payload</h2>
          
          {selectedSubmission ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-fixed/5 w-32 h-32 rounded-full blur-2xl"></div>

              <div>
                <span className="text-[10px] font-label-caps text-secondary uppercase tracking-widest block mb-1">
                  SUBMISSION METADATA
                </span>
                <h3 className="text-2xl font-bold text-white">{selectedSubmission.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1 font-medium">{selectedSubmission.college}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 text-sm">
                <div>
                  <div className="text-on-surface-variant text-xs mb-1">SERVICE REQUEST</div>
                  <div className="font-semibold text-primary-fixed">{selectedSubmission.service}</div>
                </div>
                <div>
                  <div className="text-on-surface-variant text-xs mb-1">DEADLINE</div>
                  <div className="font-semibold text-white">{selectedSubmission.deadline}</div>
                </div>
              </div>

              <div>
                <div className="text-on-surface-variant text-xs mb-2">PROJECT TOPIC</div>
                <div className="bg-surface-container/30 border border-white/5 p-4 rounded-xl text-white font-semibold">
                  {selectedSubmission.topic}
                </div>
              </div>

              <div>
                <div className="text-on-surface-variant text-xs mb-2">REQUIREMENTS BRIEF</div>
                <div className="bg-surface-container/30 border border-white/5 p-4 rounded-xl text-sm leading-relaxed text-on-surface-variant max-h-48 overflow-y-auto">
                  {selectedSubmission.requirements || 'No specific requirements payload.'}
                </div>
              </div>

              {/* Status Update Options */}
              <div>
                <div className="text-on-surface-variant text-xs mb-2">FLOW PIPELINE STATUS</div>
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

              {/* Action Routes */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <a 
                  href={`https://wa.me/${selectedSubmission.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-500 font-bold py-3 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-on-surface-variant">
              Select a submission entry from the database grid to inspect details and metadata payloads.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
