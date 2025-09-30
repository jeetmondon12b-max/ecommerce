import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({ src, alt, className, eager = false }) => {
    const handleError = (e) => {
        e.target.onerror = null;
        e.target.src = "/placeholder-image.jpg"; // Fallback image in case of an error
    };

    // Use a standard <img> tag for images that need to load immediately (e.g., above the fold)
    if (eager) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                onError={handleError}
                loading="eager"
            />
        );
    }

    // Use LazyLoadImage for all other images that can be loaded as the user scrolls
    return (
        <LazyLoadImage
            alt={alt}
            src={src}
            effect="blur"
            className={className}
            width="100%"
            height="100%"
            onError={handleError}
        />
    );
};

export default LazyImage;