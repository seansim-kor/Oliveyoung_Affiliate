import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface GoogleAdProps {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
    slot = "8970598634", // Replace with actual ad slot ID if available, or just use auto ads
    format = "auto",
    responsive = true,
    className = ""
}) => {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className={`ad-container my-4 ${className} text-center overflow-hidden`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5365826450992646"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}></ins>
        </div>
    );
};
