import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { RefreshCw, Play, Square, Layout, Type, PlusCircle } from "lucide-react";
import { ComponentPreset } from "../types";

interface LazyPresetItemProps {
  preset: ComponentPreset;
  onSelect: () => void;
  style?: React.CSSProperties;
}

export function LazyPresetItem({ preset, onSelect, style }: LazyPresetItemProps) {
  // Local load state that controls hydration of the preset rendering information
  const [isLoaded, setIsLoaded] = useState(false);

  // Intersection observer hook
  const { ref, inView } = useInView({
    rootMargin: "80px 0px",
    triggerOnce: false,
  });

  // Automatically load when visible in viewport
  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [inView, isLoaded]);

  const toggleLoad = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded((prev) => !prev);
  };

  const forceLoad = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(true);
  };

  // Combine parent virtualized positioning with our visual styles
  const combinedStyle = {
    ...style,
    paddingBottom: "8px", // spacing between virtualized items
  };

  return (
    <div ref={ref} style={combinedStyle} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full h-full"
      >
        {!isLoaded ? (
          // OFFLOADED PLACEHOLDER PANEL
          <div
            onClick={forceLoad}
            className="h-full bg-stone-50 hover:bg-stone-100/90 border border-stone-200 border-dashed rounded-2xl cursor-pointer p-3 flex flex-col justify-center items-center text-center select-none transition duration-200"
          >
            <div className="flex items-center gap-1.5 pointer-events-none mb-1">
              <RefreshCw size={10} className="animate-spin text-amber-500" />
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-500">
                Lazy-Offloaded {preset.category}
              </span>
            </div>
            <p className="text-[9.5px] text-stone-400 font-mono">
              Click or scroll near to hydrate model
            </p>
          </div>
        ) : (
          // HYDRATED PRESET CARD ITEM
          <div
            onClick={onSelect}
            className="h-full group relative p-3.5 bg-white hover:bg-gradient-to-br hover:from-white hover:to-stone-50/40 border border-stone-200/80 hover:border-rose-400 rounded-2xl cursor-pointer transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
          >
            {/* Memory control and LED indicators */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={toggleLoad}
                title="Offload this preset configuration code"
                className="p-1 text-stone-300 hover:text-amber-500 hover:bg-stone-100 rounded-lg transition active:scale-95"
              >
                <RefreshCw size={9} />
              </button>
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                title="Ready (Loaded)"
              />
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11.5px] font-bold text-stone-800 group-hover:text-stone-950 transition max-w-[80%] truncate">
                {preset.name}
              </span>
            </div>

            <p className="text-[10px] text-stone-500 font-sans leading-normal font-light line-clamp-2 max-w-[90%]">
              {preset.description}
            </p>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100/75">
              <span className="text-[8px] font-mono font-bold bg-stone-100 text-stone-400 border border-stone-150 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                {preset.category}
              </span>
              <span className="text-[8.5px] font-mono font-bold text-rose-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Instantiate Preset →
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
