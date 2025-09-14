import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  CloseIcon,
  SubtitleIcon
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
  const initialTrackSet = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for internal subtitles
  const [availableTracks, setAvailableTracks] = useState<TextTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<TextTrack | null>(null);
  const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = useState(false);

  const hideControls = () => {
    setIsControlsVisible(false);
    setIsSubtitleMenuOpen(false);
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
  
  // Effect to detect and manage internal subtitle tracks
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTracks = () => {
      const videoElem = videoRef.current;
      if (!videoElem) return;

      const tracks = Array.from(videoElem.textTracks).filter(
        (track) => track.kind === 'subtitles' || track.kind === 'captions'
      );
      
      setAvailableTracks(tracks);
      
      let activeTrack = tracks.find(t => t.mode === 'showing');

      // If tracks have been found and we haven't set a default one yet
      if (!initialTrackSet.current && tracks.length > 0) {
        // If the browser hasn't already enabled a track, let's enable one.
        if (!activeTrack) {
            // A track with the 'default' property is the best candidate.
            // FIX: The 'default' property is not in the standard TextTrack type, but may exist on tracks derived from <track> elements.
            // Cast to `any` to access this property and respect the original logic of selecting a default track.
            const trackToEnable = tracks.find(t => (t as any).default) || tracks[0];
            if (trackToEnable) {
                // Set its mode to 'showing' to make it visible.
                trackToEnable.mode = 'showing';
                activeTrack = trackToEnable; // update for state sync below
            }
        }
        initialTrackSet.current = true; // Mark that we've handled the initial setup.
      }
      
      setSelectedTrack(activeTrack || null);
    };

    const handleLoadedMetadata = () => {
        // When new metadata loads, we might have new tracks.
        // Reset the flag to allow auto-selection for the new source.
        initialTrackSet.current = false;
        // A small delay can help ensure tracks are parsed from the media stream
        setTimeout(updateTracks, 500);
    };

    video.textTracks.addEventListener('addtrack', updateTracks);
    video.textTracks.addEventListener('change', updateTracks);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Initial check on mount
    updateTracks();

    return () => {
      if (video.textTracks) {
        video.textTracks.removeEventListener('addtrack', updateTracks);
        video.textTracks.removeEventListener('change', updateTracks);
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [sourceUrl]); // Rerun if source changes

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

  const handleTrackSelect = (track: TextTrack | null) => {
    if (!videoRef.current) return;
    
    // Disable all subtitle tracks
    availableTracks.forEach(t => {
      t.mode = 'disabled';
    });

    // Enable the selected one
    if (track) {
      track.mode = 'showing';
    }
    
    setSelectedTrack(track);
    setIsSubtitleMenuOpen(false);
  };

  // Video Element Event Handlers
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };
  const onDurationChange = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
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
      videoRef.current?.play().catch(err => {
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
      
      {isLoading && <div className="absolute z-10"><Loader /></div>}

      {/* Header - Always visible with controls, even during loading */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h2 className="text-white text-2xl font-bold truncate">{title}</h2>
        <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label="Close">
          <CloseIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <span className="text-white font-mono text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <span className="text-white font-mono text-sm">{formatTime(duration)}</span>
        </div>
        {/* Bottom Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
            <div className="flex items-center gap-2 group">
               <button onClick={handleMute} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0 ? <VolumeOffIcon className="w-7 h-7" /> : <VolumeUpIcon className="w-7 h-7" />}
               </button>
               <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover:w-24 h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer accent-white transition-all duration-300"
               />
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            {isSubtitleMenuOpen && availableTracks.length > 0 && (
                <div className="absolute bottom-14 right-0 bg-black/80 rounded-lg p-2 flex flex-col items-stretch z-20 w-48 text-right">
                    <button
                        onClick={() => handleTrackSelect(null)}
                        className={`px-3 py-2 text-lg rounded-md text-right w-full transition-colors ${!selectedTrack ? 'bg-red-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}
                    >
                        خاموش
                    </button>
                    {availableTracks.map((track, index) => (
                        <button
                            key={index}
                            onClick={() => handleTrackSelect(track)}
                            className={`px-3 py-2 text-lg rounded-md text-right w-full transition-colors truncate ${selectedTrack === track ? 'bg-red-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}
                        >
                            {track.label || track.language || `Track ${index + 1}`}
                        </button>
                    ))}
                </div>
            )}
            <button 
              onClick={() => setIsSubtitleMenuOpen(prev => !prev)}
              disabled={availableTracks.length === 0}
              className={`p-2 text-white rounded-full transition-colors disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-white/20 ${selectedTrack ? 'text-red-500' : ''}`} 
              aria-label="Select Subtitles"
            >
                <SubtitleIcon className="w-7 h-7" />
            </button>
            <button onClick={handleFullscreen} className="p-2 text-white hover:bg-white/20 rounded-full" aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
              {isFullscreen ? <ExitFullscreenIcon className="w-7 h-7" /> : <EnterFullscreenIcon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};