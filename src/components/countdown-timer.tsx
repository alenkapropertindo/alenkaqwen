"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<string>("06:00:00");

  useEffect(() => {
    // Key for local storage (using 6h suffix to bypass older 2h storage)
    const STORAGE_KEY = "freelance_promo_countdown_target_6h";
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

    const getTargetTime = () => {
      if (typeof window === "undefined") return Date.now() + SIX_HOURS_MS;
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > Date.now()) {
          // Clamp if the parsed target is too far in the future
          if (parsed - Date.now() > SIX_HOURS_MS) {
            const newTarget = Date.now() + SIX_HOURS_MS;
            localStorage.setItem(STORAGE_KEY, newTarget.toString());
            return newTarget;
          }
          return parsed;
        }
      }
      
      // If not stored or expired, set new target
      const newTarget = Date.now() + SIX_HOURS_MS;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      return newTarget;
    };

    let targetTime = getTargetTime();

    const updateTimer = () => {
      const now = Date.now();
      let diff = targetTime - now;

      if (diff <= 0) {
        // Restart the timer
        targetTime = Date.now() + SIX_HOURS_MS;
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
        diff = SIX_HOURS_MS;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");

      setTimeLeft(formatted);
    };

    // Run once immediately
    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const [hours, minutes, seconds] = timeLeft.split(":");

  return (
    <div className="flex flex-col items-center gap-3 mb-6 w-full">
      <div className="flex items-center gap-2 bg-[#ff8fa3]/10 px-4 py-1.5 rounded-full border border-[#ff8fa3]/30">
        <Clock className="h-4.5 w-4.5 text-[#d64560] animate-pulse" />
        <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#d64560]">
          Sisa Waktu Promo
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg">
            <span className="font-mono text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {hours}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase text-slate-700 mt-1.5 tracking-wider">Jam</span>
        </div>

        {/* Separator */}
        <span className="text-2xl md:text-3xl font-black text-slate-900/60 pb-5">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg">
            <span className="font-mono text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {minutes}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase text-slate-700 mt-1.5 tracking-wider">Menit</span>
        </div>

        {/* Separator */}
        <span className="text-2xl md:text-3xl font-black text-slate-900/60 pb-5">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg">
            <span className="font-mono text-2xl md:text-3xl font-black text-[#d64560] tracking-tight">
              {seconds}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase text-slate-700 mt-1.5 tracking-wider">Detik</span>
        </div>
      </div>
    </div>
  );
}
