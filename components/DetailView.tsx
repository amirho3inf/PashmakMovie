import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Poster, Season, Source, Episode } from '../types';
import { Loader } from './Loader';
import { StarIcon, BackIcon, HeartIcon } from './icons';
import { OpenWithModal } from './OpenWithModal';
import { VideoPlayer } from './VideoPlayer';

interface DetailViewProps {
  item: Poster;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: Poster) => void;
  onWatch: (item: Poster) => void;
}

export const DetailView = ({ item, onBack, isFavorite, onToggleFavorite, onWatch }: DetailViewProps) => {
  const [details, setDetails] = useState<Poster | null>(item);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [activeMedia, setActiveMedia] = useState<{ source: Source; episode?: Episode } | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (item.type === 'serie') {
          // For series, the main details are from the passed `item`. We only need to fetch seasons.
          const seasonData = await api.getSeasons(item.id);
          setDetails(item);
          setSeasons(seasonData);
          if (seasonData && seasonData.length > 0) {
            setSelectedSeasonId(seasonData[0].id);
          }
        } else {
          // For movies, fetch the full, detailed information.
          const movieDetails = await api.getMovie(item.id);
          setDetails(movieDetails);
          setSeasons([]); // Ensure seasons are cleared for movies
        }
      } catch (err) {
        setError('خطا در بارگذاری جزئیات.');
        setSeasons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [item]);

  const handlePlayClick = (source: Source, episode?: Episode) => {
    if (details) {
      onWatch(details);
    }
    setActiveMedia({ source, episode });
    setShowPlayer(false); // Ensure modal shows first
  };

  const renderPlayButtons = (playSources: Source[], episode?: Episode) => {
    if (playSources.length === 0) return <p className="text-gray-400">موردی برای پخش وجود ندارد.</p>;

    return (
      <div className="flex flex-wrap gap-3 md:gap-4">
        {playSources.map(source => (
          <button
            key={source.id}
            onClick={() => handlePlayClick(source, episode)}
            className="px-4 py-2 text-sm md:px-5 md:py-2 md:text-md bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-all duration-200"
          >
            پخش {source.quality}
          </button>
        ))}
      </div>
    );
  };

  const renderDownloadButtons = (downloadSources: Source[]) => {
    if (downloadSources.length === 0) return <p className="text-gray-400">موردی برای دانلود وجود ندارد.</p>;

    return (
      <div className="flex flex-wrap gap-3 md:gap-4">
        {downloadSources.map(source => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-4 py-2 text-sm md:px-5 md:py-2 md:text-md bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-200"
          >
            دانلود {source.quality}
          </a>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full relative">
        <img src={item.cover} alt="" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30" />
        <Loader />
      </div>
    );
  }

  if (error || !details) {
    return <div className="p-10 text-2xl text-red-500">{error || 'موردی برای نمایش وجود ندارد.'}</div>;
  }

  const selectedSeason = seasons.find(s => s.id === selectedSeasonId);
  const modalTitle = activeMedia && details ? `${details.title}${selectedSeason ? ` - ${selectedSeason.title}` : ''}${activeMedia.episode?.title ? ` - ${activeMedia.episode.title}` : ''}` : '';

  return (
    <div className="relative min-h-screen">
      {activeMedia && !showPlayer && (
        <OpenWithModal
          sourceUrl={activeMedia.source.url}
          title={modalTitle}
          onClose={() => setActiveMedia(null)}
          onSelectBrowserPlayer={() => setShowPlayer(true)}
        />
      )}
      {activeMedia && showPlayer && details && (
        <VideoPlayer
          sourceUrl={activeMedia.source.url}
          title={modalTitle}
          onClose={() => {
            setShowPlayer(false);
            setActiveMedia(null);
          }}
        />
      )}

      <button
        onClick={onBack}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-30 bg-black/50 p-2 md:p-3 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400 transition-all"
        aria-label="بازگشت"
      >
        <BackIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="absolute inset-0 h-[50vh] md:h-[70vh]">
        <img src={details.cover} alt={details.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      <div className="relative z-10 pt-[30vh] md:pt-[35vh] p-4 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-shrink-0 w-40 md:w-56 lg:w-64 -mt-20 md:-mt-40 self-center">
            <img
              src={details.image}
              alt={`Poster for ${details.title}`}
              className="w-full h-auto rounded-lg shadow-2xl object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-x-4 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white">{details.title}</h1>
              <button
                onClick={() => onToggleFavorite(details)}
                aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                className="p-2 bg-black/40 rounded-full text-white transition-all duration-200 hover:bg-red-600/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white self-center"
              >
                <HeartIcon className={`w-7 h-7 md:w-9 md:h-9 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'text-white'}`} />
              </button>
            </div>
            <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-4 gap-y-2 text-gray-300 text-base md:text-lg">
              <span>{details.year}</span>
              <span className="flex items-center">
                <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mr-2" />
                {details.imdb}
              </span>
              <span>{details.duration}</span>
              <span className="border border-gray-500 px-2 py-1 rounded text-xs md:text-sm">{details.classification || 'N/A'}</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {details.genres.map(g => (
                <span key={g.id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm whitespace-nowrap">{g.title}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          {details.type === 'movie' && details.sources.length > 0 && (
            <div className="my-8 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">پخش آنلاین</h2>
                {renderPlayButtons(details.sources)}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">دانلود</h2>
                {renderDownloadButtons(details.sources)}
              </div>
            </div>
          )}

          {details.type === 'serie' && seasons.length > 0 && (
            <div className="my-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">فصل‌ها و قسمت‌ها</h2>

              <div className="flex space-x-4 border-b-2 border-gray-700 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {seasons.map(season => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeasonId(season.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 font-semibold text-lg md:text-xl rounded-t-lg transition-colors duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset ${selectedSeasonId === season.id
                      ? 'bg-red-600 text-white'
                      : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    {season.title}
                  </button>
                ))}
              </div>

              {selectedSeason && (
                <div className="space-y-2">
                {selectedSeason.episodes.map(episode => (
                  <div
                    key={episode.id}
                    className="bg-gray-800 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-gray-700/80 focus-within:ring-4 focus-within:ring-red-500"
                  >
                    <div className="sm:w-1/5 flex-shrink-0 min-w-[150px]">
                      <h4 className="font-bold text-base md:text-lg text-white truncate">
                        {episode.title}
                      </h4>
                    </div>
              
                    {episode.sources && episode.sources.length > 0 && (
                      <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
                        {episode.sources.map(source => (
                          <button
                            key={`${source.id}-play`}
                            onClick={() => handlePlayClick(source, episode)}
                            className="flex-grow sm:flex-grow-0 px-3 py-2 bg-red-600 text-white font-bold rounded-lg text-sm md:text-base hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                          >
                            پخش {source.quality}
                          </button>
                        ))}
                        {episode.sources.map(source => (
                          <a
                            key={`${source.id}-download`}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex-grow sm:flex-grow-0 text-center px-3 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm md:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                          >
                            دانلود {source.quality}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>              
              )}
            </div>
          )}

          <p className="max-w-5xl text-gray-200 text-base md:text-xl leading-relaxed whitespace-pre-wrap mt-8">{details.description}</p>
        </div>
      </div>
    </div>
  );
};