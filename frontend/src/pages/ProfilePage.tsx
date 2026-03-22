import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, TrendingUp, TrendingDown, Wallet, Camera, Upload, X } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, isDemo } = useAuth();
  const { transactions } = useExpense();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isDemo) navigate('/login');
  }, [user, isDemo, navigate]);

  const photoKey = user ? `trackify_photo_${user.id}` : 'trackify_photo_guest';
  const [photo, setPhoto] = useState<string | null>(() => localStorage.getItem(photoKey));
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Update photo when user changes
  useEffect(() => {
    setPhoto(localStorage.getItem(photoKey));
  }, [photoKey]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalTransactions = transactions.length;

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    setShowOptions(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission.');
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Take photo from camera
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(dataUrl);
    localStorage.setItem(photoKey, dataUrl);
    stopCamera();
  };

  // Upload from file
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhoto(dataUrl);
      localStorage.setItem(photoKey, dataUrl);
      setShowOptions(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const removePhoto = () => {
    setPhoto(null);
    localStorage.removeItem(photoKey);
    setShowOptions(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>Profile</h1>

          {/* User Card */}
          <div className="p-8 rounded-[32px] mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="flex items-center gap-6 mb-8">

              {/* Avatar with upload button */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg shadow-violet-500/20 border-2 border-violet-500/30">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-violet-600 flex items-center justify-center text-3xl font-bold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Camera button */}
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 transition-all shadow-lg"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>

                {/* Options dropdown */}
                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      className="absolute top-10 left-10 z-50 rounded-2xl overflow-hidden shadow-2xl min-w-[180px]"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                    >
                      <button
                        onClick={startCamera}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Camera className="w-4 h-4 text-violet-400" />
                        Take Photo
                      </button>
                      <button
                        onClick={() => { fileInputRef.current?.click(); setShowOptions(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Upload className="w-4 h-4 text-blue-400" />
                        Upload Photo
                      </button>
                      {photo && (
                        <button
                          onClick={removePhoto}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-rose-500/10 transition-colors text-rose-400"
                        >
                          <X className="w-4 h-4" />
                          Remove Photo
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.username}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Change photo
                </button>
              </div>
            </div>

            {/* Error message */}
            {cameraError && (
              <div className="mb-4 p-3 rounded-xl text-sm text-rose-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {cameraError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
                <User className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Username</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Income', value: `₹${totalIncome.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, icon: TrendingDown, color: 'text-rose-400' },
              { label: 'Transactions', value: totalTransactions.toString(), icon: Wallet, color: 'text-violet-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[24px]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
              >
                <stat.icon className={`w-5 h-5 mb-3 ${stat.color}`} />
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full py-4 rounded-2xl font-bold text-rose-400 transition-all hover:bg-rose-500/10"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}
          >
            Sign Out
          </button>
        </motion.div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-[32px] overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              {/* Camera header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Take a Photo</h3>
                <button
                  onClick={stopCamera}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video feed */}
              <div className="p-6">
                <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Capture button */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 rounded-2xl font-bold transition-all hover:bg-white/5"
                  style={{ border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={takePhoto}
                  className="flex-1 py-3 rounded-2xl font-bold bg-violet-600 hover:bg-violet-500 transition-all text-white flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}