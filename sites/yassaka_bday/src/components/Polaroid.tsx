import React, { useState } from 'react';
import { WashiTape } from './WashiTape';
import { sfx } from '../utils/audio';
import { Maximize2, X, ExternalLink } from 'lucide-react';

interface PolaroidProps {
  imageSrc: string;
  caption?: string;
  subcaption?: string;
  tapeColor?: 'peach' | 'pink' | 'mint' | 'lavender' | 'yellow' | 'vellum' | 'gold';
  rotation?: string;
  sticker?: string;
  fallbackBadge?: string;
  aspectRatio?: string;
  objectPosition?: string;
}

export const getDriveFileId = (url: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  // Raw file ID (alphanumeric, underscores, hyphens, min length 20)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  const match =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match && match[1] ? match[1] : null;
};

export const resolveImageUrl = (url: string, retryIndex = 0): string => {
  if (!url) return '';
  const fileId = getDriveFileId(url);
  if (!fileId) return url;

  // Ordered fallback strategies for Google Drive CDN & thumbnail delivery
  if (retryIndex === 0) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } else if (retryIndex === 1) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  } else if (retryIndex === 2) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
  } else {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
};

export const Polaroid: React.FC<PolaroidProps> = ({
  imageSrc,
  caption,
  subcaption,
  tapeColor = 'vellum',
  rotation = 'rotate-0',
  sticker,
  fallbackBadge = 'Yasakka Keepsake ✨',
  aspectRatio = 'aspect-[3/4]',
  objectPosition = 'object-top',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fileId = getDriveFileId(imageSrc);
  const currentSrc = resolveImageUrl(imageSrc, retryCount);

  const handleOpen = () => {
    sfx.pop();
    setIsOpen(true);
  };

  const handleClose = () => {
    sfx.tap();
    setIsOpen(false);
  };

  const handleImageError = () => {
    if (fileId && retryCount < 3) {
      setRetryCount((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const isDeg = rotation && rotation.includes('deg');
  const inlineRotationStyle = isDeg ? { transform: `rotate(${rotation})` } : undefined;
  const rotationClass = !isDeg ? rotation : '';

  const hasCaptionContent = Boolean(caption?.trim() || subcaption?.trim());

  return (
    <>
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        style={inlineRotationStyle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        className={`relative group cursor-pointer bg-white ${
          hasCaptionContent ? 'p-3 sm:p-3.5 pb-5 sm:pb-6' : 'p-2.5 sm:p-3 pb-3.5 sm:pb-4'
        } rounded-xl polaroid-editorial transition-all duration-300 hover:scale-[1.04] hover:z-20 hover:shadow-2xl ${rotationClass}`}
      >
        <WashiTape color={tapeColor} position="top-center" />

        {/* Sticker badge */}
        {sticker && (
          <div className="absolute -bottom-2 -right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center text-xs sm:text-sm shadow-sm border border-amber-900/10 rotate-6 group-hover:scale-110 transition-transform">
            {sticker}
          </div>
        )}

        {/* Image Frame: using portrait ratio and object-top to ensure the subject's face is clearly visible */}
        <div
          className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg bg-[#FAF6F0] border border-amber-900/10 flex items-center justify-center`}
        >
          {/* Subtle loading shimmer */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-purple-50/40 to-amber-50 animate-pulse" />
          )}

          {!hasError ? (
            <img
              src={currentSrc}
              alt={caption || 'Yasakka Memory'}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover ${objectPosition} transition-all duration-700 ease-out group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <span className="text-2xl mb-1 opacity-80">🌸</span>
              <span className="text-xs font-serif italic text-amber-900/80 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-900/10">
                {fallbackBadge}
              </span>
              {fileId && (
                <a
                  href={`https://drive.google.com/file/d/${fileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 text-[10px] text-purple-700 underline flex items-center gap-0.5 hover:text-purple-900"
                >
                  Open photo <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#200D30]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/95 text-[#200D30] text-xs font-sans-body font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-[#A855F7]/30 scale-95 group-hover:scale-100 transition-transform">
              <Maximize2 className="w-3 h-3 text-[#F59E0B]" /> View photo
            </span>
          </div>
        </div>

        {/* Editorial Caption - only rendered if provided */}
        {hasCaptionContent && (
          <div className="mt-3 text-center px-1">
            {caption && (
              <p className="font-serif text-base sm:text-lg text-[#2B211E] tracking-tight leading-snug">
                {caption}
              </p>
            )}
            {subcaption && (
              <p className="font-handwriting text-xs sm:text-sm text-[#6E615D] mt-0.5">
                {subcaption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#200D30]/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={handleClose}
        >
          <div
            className="relative bg-white rounded-2xl p-4 sm:p-6 max-w-xl w-full polaroid-editorial shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 w-8 h-8 bg-[#200D30] text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg z-10 border border-white/20"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="rounded-xl overflow-hidden bg-[#FAF7F2] max-h-[75vh] flex items-center justify-center border border-amber-900/10 shadow-inner">
              <img
                src={currentSrc}
                alt={caption || 'Yasakka Keepsake Photo'}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={handleImageError}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
            {hasCaptionContent && (
              <div className="mt-4 text-center">
                {caption && <h4 className="font-serif text-2xl text-[#2B211E]">{caption}</h4>}
                {subcaption && (
                  <p className="font-handwriting text-base text-[#6E615D] mt-1">{subcaption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
