"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  imageUrl: string;
  title: string;
}

export function DownloadButton({ imageUrl, title }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      // Clean up title for filename
      const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `brosur_${cleanTitle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image", error);
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <a
      href={imageUrl}
      onClick={handleDownload}
      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#0e3b43]/90 hover:bg-[#0e3b43] backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm transition-all ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
      <span className="hidden sm:inline">
        {isDownloading ? "Mengunduh..." : "Download"}
      </span> Brosur
    </a>
  );
}
