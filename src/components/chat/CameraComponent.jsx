import React, { useRef, useState, useEffect } from "react";
import upload from "../../lib/upload";
import "./CameraComponent.css";

const CameraComponent = ({ onSendPhoto, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraOn(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please check permissions.");
      handleClose();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const photoUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(photoUrl);

    stopCamera();
  };

  const sendPhoto = async () => {
    if (!capturedPhoto) return;
    setIsLoading(true);

    try {
      const res = await fetch(capturedPhoto);
      const blob = await res.blob();
      const file = new File([blob], "camera-photo.png", { type: "image/png" });

      const imageUrl = await upload(file);
      await onSendPhoto(imageUrl);
    } catch (err) {
      console.error("Send photo error:", err);
      alert("Failed to send photo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-box">
        {!capturedPhoto ? (
          <>
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
              />
            ) : (
              <p style={{ color: "white", marginBottom: "10px" }}>
                Camera is off.
              </p>
            )}
            <div className="camera-controls">
              {cameraOn && (
                <button onClick={capturePhoto} className="capture-btn">
                  Take Photo
                </button>
              )}
              <button onClick={handleClose} className="close-btn">
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <img src={capturedPhoto} alt="Captured" className="preview-image" />
            <div className="preview-controls">
              <button
                onClick={sendPhoto}
                className="send-btn"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
              <button
                onClick={stopCamera}
                className="off-camera-btn"
                style={{ width: "120px" }}
              >
                Turn Off Camera
              </button>
              <button
                onClick={handleClose}
                className="close-btn"
                style={{ width: "120px" }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
