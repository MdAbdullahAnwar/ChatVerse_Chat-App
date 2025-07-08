import React, { useRef, useState } from 'react';
import upload from '../../lib/upload';
import './CameraComponent.css';

const CameraComponent = ({ 
  onSendPhoto, 
  onClose, 
  currentUser, 
  chatId, 
  user 
}) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Start camera when component mounts
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      onClose();
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const photoUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(photoUrl);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Send captured photo
  const sendPhoto = async () => {
    if (!capturedPhoto) return;
    setIsLoading(true);

    try {
      // Convert data URL to blob
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const file = new File([blob], "camera-photo.png", { type: "image/png" });

      // Upload photo to imgBB
      const imgUrl = await upload(file);
      
      if (!imgUrl) throw new Error("Failed to upload photo");

      // Call parent component's send function
      await onSendPhoto(imgUrl);
      
      // Close camera component
      onClose();
    } catch (error) {
      console.error("Error sending photo:", error);
      alert("Failed to send photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up camera stream when component unmounts
  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      {!capturedPhoto ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="camera-preview"
          />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-btn">
              Take Photo
            </button>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </>
      ) : (
        <div className="photo-preview">
          <img src={capturedPhoto} alt="Captured" className="preview-image" />
          <div className="preview-controls">
            <button 
              onClick={() => setCapturedPhoto(null)} 
              className="discard-btn"
            >
              Retake
            </button>
            <button 
              onClick={sendPhoto} 
              className="send-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;