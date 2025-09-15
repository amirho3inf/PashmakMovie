import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './icons';

interface AppChoice {
  name: string;
  scheme: string;
}

const APPS: AppChoice[] = [
  { name: 'VLC Player', scheme: 'vlc://' }
];

interface OpenWithModalProps {
  sourceUrl: string;
  title: string;
  onClose: () => void;
  onSelectBrowserPlayer: () => void;
}

export const OpenWithModal = ({ sourceUrl, title, onClose, onSelectBrowserPlayer }: OpenWithModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Auto-focus the first button in the modal for accessibility
    modalRef.current?.querySelector<HTMLElement>('button[role="menuitem"]')?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAppClick = (app: AppChoice) => {
    let appUrl = '';
    // IINA uses a different URL structure than most other players
    if (app.name === 'VLC Player') {
        appUrl = `${app.scheme}${sourceUrl.replace('https://', '').replace('http://', '')}`;
    } else {
        appUrl = `${app.scheme}${sourceUrl}`;
    }
    
    // This attempts to open the custom URL scheme. It will only work if the user has the corresponding application installed.
    window.open(appUrl, '_self');
    onClose();
  };
  
  const handleCopyLink = async () => {
    try {
        await navigator.clipboard.writeText(sourceUrl);
        alert('لینک کپی شد!');
    } catch (err) {
        console.error('Failed to copy link: ', err);
        alert('خطا در کپی کردن لینک.');
    } finally {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 animate-fade-in p-4" role="dialog" aria-modal="true" aria-labelledby="open-with-modal-title">
      <div ref={modalRef} className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col p-6 md:p-8">
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 md:top-6 md:left-6 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        <h2 id="open-with-modal-title" className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">باز کردن با ...</h2>
        <p className="text-gray-400 text-center mb-6 truncate px-4" title={title}>{title}</p>
        <ul className="overflow-y-auto space-y-3" role="menu">
            <li role="none">
              <button
                role="menuitem"
                onClick={onSelectBrowserPlayer}
                className="w-full text-center text-xl md:text-2xl font-semibold p-4 rounded-lg transition-colors duration-200 focus:outline-none focus:bg-red-600 focus:text-white hover:bg-red-500 text-gray-200 bg-red-700"
              >
                پخش در مرورگر
              </button>
              <p className="text-sm text-gray-400 text-center mt-1 px-4">(امکانات محدود، بدون پشتیبانی از زیرنویس)</p>
            </li>
          {APPS.map((app) => (
            <li key={app.name} role="none">
              <button
                role="menuitem"
                onClick={() => handleAppClick(app)}
                className="w-full text-center text-xl md:text-2xl font-semibold p-4 rounded-lg transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-white hover:bg-gray-600 text-gray-200 bg-gray-900"
              >
                {app.name}
              </button>
            </li>
          ))}
          <li role="none">
              <button
                role="menuitem"
                onClick={handleCopyLink}
                className="w-full text-center text-xl md:text-2xl font-semibold p-4 rounded-lg transition-colors duration-200 focus:outline-none focus:bg-blue-600 focus:text-white hover:bg-blue-500 text-gray-200 bg-gray-900 mt-4"
              >
                کپی کردن لینک
              </button>
          </li>
        </ul>
      </div>
    </div>
  );
};