import React, { useRef, useState, useEffect } from 'react';
import { Camera, UploadCloud, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Dropzone = ({ onImageSelect }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback to mobile native camera input if getUserMedia fails
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

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
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
    <div className="glass animate-fade-in" style={{ borderRadius: '1rem', padding: '2rem' }}>
      {isCameraActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ borderRadius: '0.5rem', overflow: 'hidden', width: '100%', backgroundColor: '#000' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button className="btn btn-secondary" onClick={stopCamera}>
              <XCircle size={20} />
              {t('dropzone.camera.stop')}
            </button>
            <button className="btn" onClick={capturePhoto}>
              <Camera size={20} />
              {t('dropzone.camera.capture')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div 
            className={`dropzone ${isDragging ? 'active' : ''}`}
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
          
          <div className="text-center mt-4 mb-4">
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{t('dropzone.or')}</span>
          </div>
          
          <button className="btn btn-secondary" onClick={startCamera}>
            <Camera size={20} />
            {t('dropzone.camera')}
          </button>
        </>
      )}

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
