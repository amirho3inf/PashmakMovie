import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  CloseIcon,
} from './icons';
import { Loader } from './Loader';

interface VideoPlayerProps {
  sourceUrl: string;
  title: string;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

export const VideoPlayer = ({ sourceUrl, title, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const hideControls = () => {
    setIsControlsVisible(false);
  }

  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
    }
  }, [isPlaying]);
  
  // Effect to manage controls visibility timeout
  useEffect(() => {
    if (isPlaying) {
      showControls();
    } else {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      setIsControlsVisible(true);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);
  
  // Effect for keyboard shortcuts and fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleKeyDown = (e: KeyboardEvent) => {
        showControls();
        const video = videoRef.current;
        if (!video) return;

        const isPlayerFocused = containerRef.current && containerRef.current.contains(document.activeElement);
        if (!isPlayerFocused && !isFullscreen) return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                handlePlayPause();
                break;
            case 'f':
                handleFullscreen();
                break;
            case 'm':
                handleMute();
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                video.volume = Math.min(1, video.volume + 0.05);
                break;
            case 'ArrowDown':
                e.preventDefault();
                video.volume = Math.max(0, video.volume - 0.05);
                break;
            case 'Escape':
                if (isFullscreen) {
                    handleFullscreen();
                } else {
                    onClose();
                }
                break;
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, onClose, showControls]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseFloat(e.target.value);
    }
  };
  
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (isFullscreen) {
      document.exitFullscreen().catch(console.error);
    } else {
      containerRef.current.requestFullscreen().catch(console.error);
    }
  };

  // Video Element Event Handlers
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const onDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  const onVolumeChange = () => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    }
  };
  const onWaiting = () => setIsLoading(true);
  const onPlaying = () => setIsLoading(false);
  const onLoadedData = () => {
      setIsLoading(false);
      const video = videoRef.current;
      if (!video) return;

      video.play().catch(err => {
        console.warn("Autoplay was prevented:", err);
        setIsPlaying(false);
      });
  };

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center ${!isControlsVisible && isPlaying ? 'cursor-none' : ''}`}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
      tabIndex={-1}
    >
      <video
        ref={videoRef}
        src={sourceUrl}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
        onDoubleClick={handleFullscreen}
        onPlay={onPlay}
        onPause={onPause}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
        onVolumeChange={onVolumeChange}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onLoadedData={onLoadedData}
        crossOrigin="anonymous"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-red-600"></div>
        </div>
      )}

      {/* Header - Always visible with controls, even during loading */}
      <div
        className={`absolute top-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h2 className="text-white text-lg md:text-2xl font-bold truncate">{title}</h2>
        <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label="Close">
          <CloseIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-white font-mono text-xs md:text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 md:h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <span className="text-white font-mono text-xs md:text-sm">{formatTime(duration)}</span>
        </div>
        {/* Bottom Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handlePlayPause} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon className="w-7 h-7 md:w-8 md:h-8" /> : <PlayIcon className="w-7 h-7 md:w-8 md:h-8" />}
            </button>
            <div className="flex items-center gap-2 group">
               <button onClick={handleMute} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0 ? <VolumeOffIcon className="w-6 h-6 md:w-7 md:h-7" /> : <VolumeUpIcon className="w-6 h-6 md:w-7 md:h-7" />}
               </button>
               <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-0 md:group-hover:w-24 h-1 md:h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer accent-white transition-all duration-300"
               />
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <button onClick={handleFullscreen} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
              {isFullscreen ? <ExitFullscreenIcon className="w-6 h-6 md:w-7 md:h-7" /> : <EnterFullscreenIcon className="w-6 h-6 md:w-7 md:h-7" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};