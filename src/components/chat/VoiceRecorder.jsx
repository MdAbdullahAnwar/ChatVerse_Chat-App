import React, { useState, useRef, useEffect } from "react";
import { uploadAudioToDropbox } from "../../lib/dropboxUpload";
import "./VoiceRecorder.css";

const VoiceRecorder = ({ onSendVoiceNote, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg',
      'audio/mp4'
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      console.log("Using mimeType:", mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access failed:", err);
      alert("Microphone access failed: " + err.message);
      onClose();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const sendVoiceNote = async () => {
    if (!audioURL) return;
    setIsLoading(true);

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      const file = new File([blob], `voice-${Date.now()}.webm`, {
        type: "audio/webm"
      });

      const audioLink = await uploadAudioToDropbox(file);
      await onSendVoiceNote(audioLink);
      onClose();
    } catch (error) {
      console.error("Error uploading voice note:", error);
      alert("Failed to upload voice note: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="voice-recorder-container">
      {!audioURL ? (
        <div className="recording-section">
          {isRecording ? (
            <>
              <div className="recording-indicator">
                <div className="pulse"></div>
                <span>Recording...</span>
                <span className="recording-time">{formatTime(recordingTime)}</span>
              </div>
              <button onClick={stopRecording} className="stop-btn">
                Stop Recording
              </button>
            </>
          ) : (
            <>
              <div className="mic-icon">
                <img src="./mic.png" alt="Microphone" />
                <span>Click to start recording</span>
              </div>
              <button onClick={startRecording} className="start-btn">
                Start Recording
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="playback-section">
          <audio src={audioURL} controls className="audio-player" />
          <div className="playback-controls">
            <button onClick={() => setAudioURL(null)} className="discard-btn">
              Retake
            </button>
            <button onClick={sendVoiceNote} className="send-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
      <button onClick={onClose} className="close-btn">
        Close
      </button>
    </div>
  );
};

export default VoiceRecorder;
