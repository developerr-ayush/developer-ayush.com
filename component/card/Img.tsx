import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React from 'react';

interface ImgProps {
    src: string | StaticImport;
    alt: string;
    className?: string;
    width: number; // Add width prop
    height: number; // Add height prop
}

const Img = ({ src, alt, className, width, height }: ImgProps) => {
    return (
        <div className={`card-img ${className ? className : ''}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 600px) 320px, (max-width: 1200px) 640px, 100vw" // Responsive sizes
                priority // Ensure it's preloaded
                loading="eager" // Load lazily for performance
                placeholder="blur" // Use a placeholder if desired
                blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNksDlRDwACzQGFFBQ7xgAAAABJRU5ErkJggg==" // Placeholder image
            />
        </div>
    );
};

export default Img;
