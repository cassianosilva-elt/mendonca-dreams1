import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    priority?: boolean; // If true, sets loading="eager"
}

/**
 * OptimizedImage component handles lazy loading, error fallback, 
 * and prepares the architecture for future image execution (e.g. Supabase Storage transformation).
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Placeholder for future logic to generate srcSet based on storage provider
    // const srcSet = ...

    return (
        <div
            className={`relative overflow-hidden bg-gray-100 ${className}`}
            style={{
                width,
                height,
                aspectRatio: props.style?.aspectRatio || undefined // Allow override via style or future prop
            }}
        >
            {/* Blur Placeholder Effect (fades out when loaded) */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
            )}

            <img
                src={hasError ? '/placeholder-image.jpg' : src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                width={width}
                height={height}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
