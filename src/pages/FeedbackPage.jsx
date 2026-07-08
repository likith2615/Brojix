import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Smile, 
  Send, 
  Mic, 
  Video as VideoIcon, 
  Upload, 
  Check, 
  ShieldAlert, 
  Lock, 
  Download, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Copy,
  Volume2,
  Trash2,
  Play,
  Pause,
  Award,
  Sparkles,
  FileCheck,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { printInvoice, printCertificate } from '../lib/InvoiceCertificateGenerator';

const SERVICES_OPTIONS = [
  'Website Maintenance',
  'SEO',
  'Hosting',
  'Branding',
  'Logo Design',
  'AI Automation',
  'Custom Software',
  'Mobile App',
  'UI UX',
  'Marketing'
];

const EMOJI_MAP = {
  10: '😍', 9: '🥰', 8: '🙂', 7: '😊', 6: '😐',
  5: '😐', 4: '😕', 3: '😕', 2: '😢', 1: '😢', 0: '😭'
};

export default function FeedbackPage() {
  const { token: routeToken } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryToken = new URLSearchParams(location.search).get('token');
  const token = routeToken || queryToken;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [linkData, setLinkData] = useState(null);
  const [projectData, setProjectData] = useState(null);

  // Password protection
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // Form states
  const [submitted, setSubmitted] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Ratings
  const [overallRating, setOverallRating] = useState(10);
  const [detailedRatings, setDetailedRatings] = useState({
    communication: 5,
    professionalism: 5,
    designQuality: 5,
    developmentQuality: 5,
    speed: 5,
    support: 5,
    pricing: 5,
    overallSatisfaction: 5
  });

  // Text inputs
  const [textFeedback, setTextFeedback] = useState({
    likedMost: '',
    couldImprove: '',
    wasMissing: '',
    suggestions: ''
  });

  // NPS Score
  const [npsScore, setNpsScore] = useState(10);

  // Testimonial details
  const [testimonial, setTestimonial] = useState('');
  const [allowPublicUse, setAllowPublicUse] = useState(false);

  // Media Testimonials
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const audioRecorderRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const videoStreamRef = useRef(null);
  const liveVideoPreviewRef = useRef(null);

  // File Uploads
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Cross-sell & Referrals
  const [workAgain, setWorkAgain] = useState('Yes');
  const [interestedServices, setInterestedServices] = useState([]);
  const [referralName, setReferralName] = useState('');
  const [referralContact, setReferralContact] = useState('');
  const [futureProjectTitle, setFutureProjectTitle] = useState('');
  const [futureProjectDesc, setFutureProjectDesc] = useState('');
  const [contactPermission, setContactPermission] = useState(true);

  useEffect(() => {
    if (!token) {
      setErrorMsg("No secure token detected. Access denied.");
      setLoading(false);
      return;
    }
    loadFeedbackDetails();
  }, [token]);

  // Calculate Form Completion Progress Percentage
  useEffect(() => {
    let fieldsFilled = 0;
    let totalFields = 8;

    if (overallRating !== null) fieldsFilled++;
    if (testimonial.trim() !== '') fieldsFilled++;
    if (textFeedback.likedMost.trim() !== '') fieldsFilled++;
    if (textFeedback.couldImprove.trim() !== '') fieldsFilled++;
    if (allowPublicUse) fieldsFilled++;
    if (interestedServices.length > 0) fieldsFilled++;
    if (referralName.trim() !== '') fieldsFilled++;
    if (futureProjectTitle.trim() !== '') fieldsFilled++;

    setFormProgress(Math.min(100, Math.round((fieldsFilled / totalFields) * 100)));
  }, [overallRating, testimonial, textFeedback.likedMost, textFeedback.couldImprove, allowPublicUse, interestedServices.length, referralName, futureProjectTitle]);

  const loadFeedbackDetails = async () => {
    setLoading(true);
    try {
      let activeLink = null;
      let matchedProject = null;

      if (isSupabaseConfigured) {
        const { data: link, error: linkError } = await supabase
          .from('feedback_links')
          .select('*')
          .eq('token', token)
          .single();

        if (!linkError && link) {
          activeLink = link;
          
          const { data: proj, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', link.project_id)
            .single();

          if (!projError && proj) {
            matchedProject = proj;
          }
        }
      }

      // Fallback LocalStorage
      if (!activeLink) {
        const storedLinks = JSON.parse(localStorage.getItem('feedback_links') || '[]');
        activeLink = storedLinks.find(l => l.token === token);

        if (activeLink) {
          const storedProjects = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
          matchedProject = storedProjects.find(p => p.id === activeLink.project_id);
        }
      }

      if (!activeLink) {
        setErrorMsg("This secure link does not exist or has been revoked.");
        setLoading(false);
        return;
      }

      if (activeLink.is_disabled) {
        setErrorMsg("This feedback session has been completed or disabled.");
        setLoading(false);
        return;
      }

      if (activeLink.expiry_date && new Date(activeLink.expiry_date) < new Date()) {
        setErrorMsg("This secure feedback link has expired.");
        setLoading(false);
        return;
      }

      setLinkData(activeLink);
      setProjectData(matchedProject || { id: activeLink.project_id, name: "Brojix Client", topic: "Custom Software", service: "Development" });
      
      if (!activeLink.password) {
        setIsPasswordVerified(true);
        triggerLinkOpenedNotification(matchedProject?.id || activeLink.project_id);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the secure authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const triggerLinkOpenedNotification = async (projectId) => {
    try {
      const newNotif = {
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        type: 'link_opened',
        title: 'Feedback Link Opened',
        message: `Client opened secure feedback link for token ${token}.`,
        project_id: projectId,
        read: false,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured) {
        await supabase.from('notifications').insert([newNotif]);
      } else {
        const currentNotifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        currentNotifs.unshift(newNotif);
        localStorage.setItem('admin_notifications', JSON.stringify(currentNotifs));
      }
    } catch (err) {
      console.warn("Notification logging failed:", err);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === linkData.password) {
      setIsPasswordVerified(true);
      triggerLinkOpenedNotification(projectData?.id || linkData.project_id);
      toast.success("Identity verified successfully!");
    } else {
      toast.error("Incorrect password.");
    }
  };

  const getNpsClass = (score) => {
    if (score >= 9) return 'Promoter';
    if (score >= 7) return 'Passive';
    return 'Detractor';
  };

  // Audio Recording Handlers
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      audioRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      audioRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      audioRecorderRef.current.start();
      setIsRecordingAudio(true);
      toast.info("Recording voice comments...");
    } catch (err) {
      toast.error("Microphone access denied.");
    }
  };

  const stopRecordingAudio = () => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  // Video Recording Handlers
  const startRecordingVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoStreamRef.current = stream;
      if (liveVideoPreviewRef.current) {
        liveVideoPreviewRef.current.srcObject = stream;
      }

      videoRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      videoRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      videoRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      videoRecorderRef.current.start();
      setIsRecordingVideo(true);
    } catch (err) {
      toast.error("Camera access denied.");
    }
  };

  const stopRecordingVideo = () => {
    if (videoRecorderRef.current && isRecordingVideo) {
      videoRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  // File Upload Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formatted = files.map(f => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      type: f.type,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    }));

    setAttachedFiles(prev => [...prev, ...formatted]);
    toast.success(`${files.length} file(s) attached.`);
  };

  const removeFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleServiceToggle = (serv) => {
    setInterestedServices(prev => 
      prev.includes(serv) ? prev.filter(s => s !== serv) : [...prev, serv]
    );
  };

  // Submit Feedback
  const handleFormSubmit = async () => {
    setLoading(true);

    const feedbackPayload = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      token: token,
      project_id: projectData.id,
      client_name: projectData.client_name || projectData.name,
      overall_rating: overallRating,
      detailed_ratings: detailedRatings,
      text_feedback: textFeedback,
      nps_score: npsScore,
      nps_class: getNpsClass(npsScore),
      testimonial: testimonial.trim(),
      allow_public_use: allowPublicUse,
      video_url: videoUrl,
      audio_url: audioUrl,
      files: attachedFiles,
      work_again: workAgain,
      more_services: interestedServices,
      referral: {
        referrerName: referralName.trim(),
        wouldRefer: referralName.trim() !== '',
        referralContact: referralContact.trim()
      },
      future_project: {
        title: futureProjectTitle.trim(),
        description: futureProjectDesc.trim(),
        hasFutureProject: futureProjectTitle.trim() !== ''
      },
      contact_permission: contactPermission,
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        // DB insert
        const { error: dbError } = await supabase.from('feedback').insert([feedbackPayload]);
        if (dbError) throw dbError;

        // Update Link sub count
        const updatedCount = (linkData.submissions_count || 0) + 1;
        const shouldDisable = linkData.is_one_time;
        await supabase
          .from('feedback_links')
          .update({ submissions_count: updatedCount, is_disabled: shouldDisable })
          .eq('token', token);

        // Notify Admin
        await supabase.from('notifications').insert([{
          type: 'feedback_submitted',
          title: 'Client Feedback Submitted',
          message: `${feedbackPayload.client_name} submitted a ${feedbackPayload.overall_rating}/10 review for "${projectData.topic}".`,
          project_id: projectData.id
        }]);

        if (referralName.trim()) {
          await supabase.from('notifications').insert([{
            type: 'referral_submitted',
            title: 'New Client Referral',
            message: `${feedbackPayload.client_name} referred ${referralName}.`,
            project_id: projectData.id
          }]);
        }

        if (futureProjectTitle.trim()) {
          await supabase.from('notifications').insert([{
            type: 'client_requested_another_project',
            title: 'Future Project proposed',
            message: `${feedbackPayload.client_name} requested a new project: "${futureProjectTitle}".`,
            project_id: projectData.id
          }]);
        }
      } else {
        // Fallback LocalStorage
        const currentFeedback = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');
        currentFeedback.unshift(feedbackPayload);
        localStorage.setItem('feedback_submissions', JSON.stringify(currentFeedback));

        const storedLinks = JSON.parse(localStorage.getItem('feedback_links') || '[]');
        const idx = storedLinks.findIndex(l => l.token === token);
        if (idx >= 0) {
          storedLinks[idx].submissions_count = (storedLinks[idx].submissions_count || 0) + 1;
          if (storedLinks[idx].is_one_time) {
            storedLinks[idx].is_disabled = true;
          }
          localStorage.setItem('feedback_links', JSON.stringify(storedLinks));
        }

        const localNotifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        localNotifs.unshift({
          id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          type: 'feedback_submitted',
          title: 'Client Feedback Submitted',
          message: `${feedbackPayload.client_name} submitted a ${feedbackPayload.overall_rating}/10 review for "${projectData.topic}".`,
          project_id: projectData.id,
          read: false,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('admin_notifications', JSON.stringify(localNotifs));
      }

      setSubmitted(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d2f000', '#ffffff', '#000000']
      });
      toast.success("Feedback registered! We appreciate your cooperation.");
    } catch (err) {
      toast.error(`Submission failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReview = () => {
    const text = `Overall Rating: ${overallRating}/10\nNPS Recommendation Score: ${npsScore}/10 (${getNpsClass(npsScore)})\nTestimonial: "${testimonial}"\n\nSubmitted via Brojix Portal.`;
    navigator.clipboard.writeText(text);
    toast.success("Review copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#d2f000] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-[#d2f000] animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col justify-center items-center p-6 text-center">
        <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Secure Gateway Exception</h1>
          <p className="text-on-surface-variant text-xs leading-relaxed">{errorMsg}</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#d2f000] text-black font-bold py-3 px-6 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] transition-all active:scale-95"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col justify-center items-center p-6">
        <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#d2f000]/5 w-32 h-32 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="w-12 h-12 bg-[#d2f000]/10 border border-[#d2f000]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5 text-[#d2f000]" />
          </div>
          
          <h1 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Identity Verification</h1>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs mx-auto">
            This project handover channel requires a passcode set by the system director.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <input 
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter passcode"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-center text-white text-base focus:outline-none focus:border-[#d2f000] focus:ring-1 focus:ring-[#d2f000] transition-all font-mono"
            />
            <button 
              type="submit"
              className="w-full bg-[#d2f000] text-black font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_#d2f000] active:scale-98 transition-all duration-300 text-sm"
            >
              Verify Passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden font-sans">
      <div className="ambient-bg" />
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#d2f000]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {submitted ? (
          /* SUCCESS VIEW */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto backdrop-blur-xl bg-white/[0.015] border border-[#d2f000]/20 p-8 rounded-3xl shadow-2xl text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#d2f000]/5 w-60 h-60 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-[#d2f000]/10 border border-[#d2f000]/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 text-[#d2f000]" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Handover Approved</h1>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto font-medium">
                Your evaluation and satisfaction log has been registered. You can now download the official project handover package and credentials receipt.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-[#d2f000]" /> Handover Package</h4>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => printInvoice(projectData)}
                  className="bg-background border border-white/10 hover:border-[#d2f000]/20 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:text-[#d2f000] transition-colors"
                >
                  <Download className="w-4 h-4" /> Invoice PDF
                </button>
                <button 
                  onClick={() => printCertificate(projectData)}
                  className="bg-background border border-white/10 hover:border-[#d2f000]/20 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:text-[#d2f000] transition-colors"
                >
                  <Download className="w-4 h-4" /> Certificate
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5 max-w-md mx-auto">
              <h4 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Share on Public Portals</h4>
              <button 
                onClick={handleCopyReview}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#d2f000] hover:underline"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Verified Review to Clipboard
              </button>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => navigate('/')} 
                className="bg-[#d2f000] text-black font-bold px-8 py-3 rounded-xl text-xs hover:shadow-[0_0_15px_#d2f000] active:scale-95 transition-all uppercase tracking-wider"
              >
                Return to Portals
              </button>
            </div>
          </motion.div>
        ) : (
          /* SPLIT VIEW FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT STICKY PREVIEW PANEL (5 Columns) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              {/* Dynamic Handover Certificate Mockup */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 relative overflow-hidden shadow-2xl aspect-[1.4/1] flex flex-col justify-between">
                
                {/* Glow border based on rating */}
                <div 
                  className="absolute inset-0 border-2 rounded-3xl pointer-events-none transition-all duration-500"
                  style={{ 
                    borderColor: overallRating >= 8 ? '#d2f000' : 'rgba(255,255,255,0.06)',
                    boxShadow: overallRating >= 8 ? 'inset 0 0 20px rgba(223,255,0,0.05), 0 0 25px rgba(223,255,0,0.03)' : 'none'
                  }}
                />

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-base font-bold tracking-tight font-display" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      BRO<span className="text-[#d2f000]">JIX</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Verification Handover</span>
                  </div>
                  <Award className={`w-8 h-8 transition-colors duration-500 ${overallRating >= 8 ? 'text-[#d2f000]' : 'text-on-surface-variant'}`} />
                </div>

                <div className="space-y-2 py-4">
                  <span className="text-[8px] uppercase tracking-wider text-secondary font-bold">VERIFIED RECIPIENT</span>
                  <h3 className="text-lg font-semibold text-white leading-tight">{projectData?.client_name || projectData?.name}</h3>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Satisfactory delivery verified for custom software system: <br />
                    <strong className="text-white">"{projectData?.topic}"</strong>
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div className="text-[8px] font-mono text-on-surface-variant">
                    <div>Ref: {projectData?.id}</div>
                    <div>Handover: {projectData?.deadline || new Date().toLocaleDateString()}</div>
                  </div>

                  {allowPublicUse && (
                    <div className="flex items-center gap-1 text-[9px] text-[#d2f000] font-bold tracking-wide animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> TESTIMONIAL VERIFIED
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Panel */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] rounded-3xl p-6 space-y-3 shadow-xl">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <span className="text-on-surface-variant">Evaluation Progress</span>
                  <span className="text-[#d2f000] font-mono">{formProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#d2f000] rounded-full transition-all duration-500 shadow-[0_0_8px_#d2f000]"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
                <p className="text-[9px] text-on-surface-variant leading-relaxed">
                  Grades logged here are securely pushed to our administrative servers. Thank you for building with Brojix.
                </p>
              </div>

            </div>

            {/* RIGHT SCROLLING FORM PANEL (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Header Title */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Project Feedback</h1>
                <p className="text-xs text-on-surface-variant">Fill out this quick assessment to release final assets and download handover receipts.</p>
              </div>

              {/* Step 1: Overall experience */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl relative">
                <div>
                  <span className="text-[9px] text-[#d2f000] font-bold uppercase tracking-wider">SECTION 1</span>
                  <h3 className="text-lg font-bold text-white mt-1">Overall Satisfaction</h3>
                </div>

                <div className="flex flex-col items-center gap-4 py-4 border-y border-white/5">
                  <div className="text-5xl">{EMOJI_MAP[overallRating]}</div>
                  <div className="text-2xl font-bold text-white font-mono">{overallRating} <span className="text-xs text-on-surface-variant">/ 10</span></div>
                  <input 
                    type="range"
                    min="0"
                    max="10"
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    className="w-full max-w-sm accent-[#d2f000] bg-white/10 rounded-lg appearance-none h-1.5"
                  />
                </div>
              </div>

              {/* Step 2: Detailed Pillars */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">SECTION 2</span>
                  <h3 className="text-lg font-bold text-white mt-1">Detailed Evaluation</h3>
                </div>

                <div className="space-y-4">
                  {Object.keys(detailedRatings).map((k) => {
                    const name = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={k} className="flex justify-between items-center py-2 border-b border-white/[0.02] last:border-0">
                        <span className="text-xs font-semibold text-on-surface-variant">{name}</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setDetailedRatings(prev => ({ ...prev, [k]: star }))}
                              className="hover:scale-110 active:scale-95 transition-all text-[#d2f000]"
                            >
                              <Star 
                                className="w-4 h-4" 
                                fill={detailedRatings[k] >= star ? '#d2f000' : 'none'} 
                                stroke={detailedRatings[k] >= star ? '#d2f000' : 'currentColor'} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: NPS recommendation */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[9px] text-[#d2f000] font-bold uppercase tracking-wider">SECTION 3</span>
                  <h3 className="text-lg font-bold text-white mt-1">NPS Net Promoter Score</h3>
                  <p className="text-xs text-on-surface-variant mt-1">How likely are you to recommend Brojix to other developers or teams?</p>
                </div>

                <div className="space-y-4">
                  {/* Discrete bubble grid */}
                  <div className="grid grid-cols-11 gap-1.5 md:gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setNpsScore(score)}
                        className={`aspect-square rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-center ${
                          npsScore === score 
                            ? 'bg-[#d2f000]/10 border-[#d2f000] text-[#d2f000] shadow-[0_0_10px_rgba(223,255,0,0.15)]' 
                            : 'bg-white/5 border-white/5 hover:border-white/10 text-on-surface-variant'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>Not likely</span>
                    <span className="text-[#d2f000] font-bold uppercase">{getNpsClass(npsScore)}</span>
                    <span>Extremely likely</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Text review */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">SECTION 4</span>
                  <h3 className="text-lg font-bold text-white mt-1">Written Feedback</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-on-surface-variant uppercase font-bold">What did you like most about working with us?</label>
                    <textarea 
                      value={textFeedback.likedMost}
                      onChange={(e) => setTextFeedback(prev => ({ ...prev, likedMost: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-[#d2f000] min-h-[70px] resize-y"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-on-surface-variant uppercase font-bold">Was there any feature/criteria that could be improved?</label>
                    <textarea 
                      value={textFeedback.couldImprove}
                      onChange={(e) => setTextFeedback(prev => ({ ...prev, couldImprove: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-[#d2f000] min-h-[70px] resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Testimonial & Voice/Video */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[9px] text-[#d2f000] font-bold uppercase tracking-wider">SECTION 5</span>
                  <h3 className="text-lg font-bold text-white mt-1">Testimonials & Attachments</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] text-on-surface-variant uppercase font-bold">Public Testimonial</label>
                    <textarea 
                      value={testimonial}
                      onChange={(e) => setTestimonial(e.target.value)}
                      placeholder="Share a testimonial that we can feature publicly in our portfolio..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-[#d2f000] min-h-[75px] resize-y"
                    />
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={allowPublicUse}
                        onChange={(e) => setAllowPublicUse(e.target.checked)}
                        className="accent-[#d2f000] rounded"
                      />
                      <span className="text-[9px] text-on-surface-variant font-medium">I consent to Brojix sharing this testimonial publicly.</span>
                    </label>
                  </div>

                  {/* Audio/Video Recorders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Audio recorder card */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3">
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-[#d2f000]" /> Voice Testimonial</span>
                      
                      {audioUrl ? (
                        <div className="w-full space-y-2">
                          <audio src={audioUrl} controls className="w-full h-8" />
                          <button 
                            type="button"
                            onClick={() => { setAudioUrl(null); setAudioBlob(null); }}
                            className="text-[10px] text-red-400 hover:underline flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Clip
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
                          className={`w-full py-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-2 ${
                            isRecordingAudio 
                              ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
                              : 'bg-background border-white/10 hover:border-[#d2f000]/20 text-white'
                          }`}
                        >
                          {isRecordingAudio ? "Stop Recording" : "Record Voice Testimonial"}
                        </button>
                      )}
                    </div>

                    {/* Video recorder card */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3">
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase flex items-center gap-1.5"><VideoIcon className="w-3.5 h-3.5 text-[#d2f000]" /> Video Testimonial</span>
                      
                      {isRecordingVideo && (
                        <video ref={liveVideoPreviewRef} autoPlay muted playsInline className="w-full max-h-[80px] bg-black rounded-lg" />
                      )}

                      {videoUrl ? (
                        <div className="w-full space-y-2">
                          <video src={videoUrl} controls className="w-full max-h-[80px] bg-black rounded-lg" />
                          <button 
                            type="button"
                            onClick={() => { setVideoUrl(null); setVideoBlob(null); }}
                            className="text-[10px] text-red-400 hover:underline flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Video
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={isRecordingVideo ? stopRecordingVideo : startRecordingVideo}
                          className={`w-full py-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-2 ${
                            isRecordingVideo 
                              ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
                              : 'bg-background border-white/10 hover:border-[#d2f000]/20 text-white'
                          }`}
                        >
                          {isRecordingVideo ? "Stop Capture" : "Record Video Testimonial"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Screenshots Zone */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase block">Attach Support Files (Screenshots / PDFs / Docs)</span>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border border-dashed border-white/10 hover:border-[#d2f000]/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/[0.01] transition-all flex flex-col items-center gap-2"
                    >
                      <Upload className="w-5 h-5 text-on-surface-variant" />
                      <span className="text-xs text-on-surface-variant font-semibold">Click to attach files</span>
                      <span className="text-[8px] text-on-surface-variant">Drag and drop also supported</span>
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />

                    {attachedFiles.length > 0 && (
                      <div className="space-y-1.5">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-background border border-white/5 px-4 py-2 rounded-xl text-xs">
                            <span className="truncate">{file.name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] text-on-surface-variant">{file.size}</span>
                              <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 6: Referral & Cross-sells */}
              <div className="backdrop-blur-xl bg-white/[0.015] border border-white/[0.06] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">SECTION 6</span>
                  <h3 className="text-lg font-bold text-white mt-1">Cross-Sell & Client Referral</h3>
                </div>

                <div className="space-y-5">
                  {/* Interested Services */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase block">Interested in other services?</span>
                    <div className="grid grid-cols-2 gap-2">
                      {SERVICES_OPTIONS.map((serv) => (
                        <label 
                          key={serv} 
                          className={`flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-on-surface-variant cursor-pointer select-none hover:border-white/10 transition-all ${
                            interestedServices.includes(serv) ? 'border-[#d2f000]/20 text-white' : ''
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={interestedServices.includes(serv)}
                            onChange={() => handleServiceToggle(serv)}
                            className="accent-[#d2f000] rounded"
                          />
                          <span>{serv}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Referral fields */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                    <span className="text-[9px] text-[#d2f000] font-bold uppercase block">Refer a Colleague</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text"
                        placeholder="Referral Name"
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d2f000]"
                      />
                      <input 
                        type="text"
                        placeholder="Contact (Email/Phone)"
                        value={referralContact}
                        onChange={(e) => setReferralContact(e.target.value)}
                        className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d2f000]"
                      />
                    </div>
                  </div>

                  {/* Future Project */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                    <span className="text-[9px] text-secondary font-bold uppercase block">Propose Next Project Concept</span>
                    <input 
                      type="text"
                      placeholder="Project Concept Name"
                      value={futureProjectTitle}
                      onChange={(e) => setFutureProjectTitle(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#d2f000]"
                    />
                    <textarea 
                      placeholder="Briefly describe what you'd like to build..."
                      value={futureProjectDesc}
                      onChange={(e) => setFutureProjectDesc(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-[#d2f000] min-h-[50px] resize-y"
                    />
                  </div>

                  {/* Contact consent */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={contactPermission}
                      onChange={(e) => setContactPermission(e.target.checked)}
                      className="accent-[#d2f000] rounded"
                    />
                    <span className="text-[9px] text-on-surface-variant font-medium">I agree to be contacted by Brojix about these concepts.</span>
                  </label>
                </div>
              </div>

              {/* Submit panel */}
              <button 
                type="button"
                onClick={handleFormSubmit}
                className="w-full bg-[#d2f000] text-black font-bold py-4 rounded-2xl text-xs hover:shadow-[0_0_20px_#d2f000] transition-all uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Publish Feedback Ledger <Send className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
