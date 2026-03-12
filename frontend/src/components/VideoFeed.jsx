import React, { useEffect, useRef } from 'react';

/**
 * VideoFeed Component
 * Handles camera permissions and displays the live video stream.
 */
const VideoFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Request access to camera and microphone
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera/microphone:", err);
        alert("Please allow camera and microphone access to use this application.");
      }
    };

    getMedia();

    // Cleanup: Stop all tracks when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="video-feed-container">
      <h3>Candidate Camera</h3>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="live-video"
        />
        <div className="recording-indicator">
          <span className="dot"></span> LIVE
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
