import React, { useRef, useState, useEffect } from 'react';
import { Camera, UploadCloud, XCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Dropzone = ({ onImageSelect }) => {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  // Handle tab switching: Auto-start or stop camera
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else if (activeTab === 'upload') {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Clean up stream on unmount only
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Assign stream to video element when it mounts
  useEffect(() => {
    if (activeTab === 'camera' && isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [isCameraActive, stream, activeTab]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  };

  const startCamera = async (mode = facingMode) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Camera API not available. Falling back to native input.");
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
    setStream(null);
  };

  const switchCamera = async () => {
    stopCamera();
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onImageSelect(file);
        stopCamera();
      }
    }, 'image/jpeg');
  };

  return (
    <div className="dropzone-container">
      
      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <UploadCloud size={20} />
          {lang === 'id' ? 'Unggah Gambar' : 'Upload Image'}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <Camera size={20} />
          {lang === 'id' ? 'Gunakan Kamera' : 'Use Camera'}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' ? (
          /* Upload Column */
          <div 
            className={`glass dropzone ${isDragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={48} color="var(--color-emerald)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>{t('dropzone.drag')}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{t('dropzone.or')}</p>
            <button className="btn mt-4" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              {t('dropzone.browse')}
            </button>
          </div>
        ) : (
          /* Camera Column */
          <div className="glass camera-section">
            {isCameraActive ? (
              <div className="camera-active-container">
                <div className="video-wrapper">
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="camera-controls">
                  <button className="btn btn-secondary" onClick={switchCamera} style={{ flex: 0.5 }}>
                    <RefreshCw size={20} />
                  </button>
                  <button className="btn btn-secondary" onClick={stopCamera}>
                    <XCircle size={20} />
                    Stop
                  </button>
                  <button className="btn" onClick={capturePhoto}>
                    <Camera size={20} />
                    Capture
                  </button>
                </div>
              </div>
            ) : (
              <div className="camera-inactive-container">
                <Camera size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Live Camera</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Snap a photo directly
                </p>
                <button className="btn btn-secondary" onClick={startCamera}>
                  <Camera size={20} />
                  {t('dropzone.camera')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/png, image/jpeg, image/jpg" 
        onChange={handleFileChange} 
      />
      
      <input 
        type="file" 
        ref={cameraInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default Dropzone;
