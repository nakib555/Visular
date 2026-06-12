import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { RefreshCw, Plus, Sparkles } from "lucide-react";

interface LazyElementItemProps {
  name: string;
  category: "structural" | "typography" | "interactive";
  icon: React.ReactNode;
  colorTheme: "orange" | "amber" | "rose";
  onAdd: () => void;
}

export function LazyElementItem({ name, category, icon, colorTheme, onAdd }: LazyElementItemProps) {
  const [isLoaded, setIsLoaded] = useState(true);

  // Automatically load when scrolled into view
  const { ref, inView } = useInView({
    rootMargin: "40px 0px",
    triggerOnce: false,
  });

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

  const getThemeClasses = () => {
    switch (colorTheme) {
      case "orange":
        return {
          wrapperHover: "hover:border-orange-300 hover:bg-orange-50/5",
          iconBg: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
          plusColor: "text-stone-400 group-hover:text-orange-500",
          accentColor: "border-orange-200 text-orange-700 bg-orange-50/30"
        };
      case "amber":
        return {
          wrapperHover: "hover:border-amber-300 hover:bg-amber-50/5",
          iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
          plusColor: "text-stone-400 group-hover:text-amber-500",
          accentColor: "border-amber-200 text-amber-700 bg-amber-50/30"
        };
      case "rose":
      default:
        return {
          wrapperHover: "hover:border-rose-300 hover:bg-rose-50/5",
          iconBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
          plusColor: "text-stone-400 group-hover:text-rose-500",
          accentColor: "border-rose-200 text-rose-700 bg-rose-50/30"
        };
    }
  };

  const themes = getThemeClasses();

  return (
    <div ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {!isLoaded ? (
          // Offloaded Placeholder for structural components
          <div
            onClick={forceLoad}
            className="w-full p-2.5 bg-stone-50/60 hover:bg-stone-100 border border-stone-200 border-dashed rounded-xl cursor-copy flex items-center justify-between transition group relative select-none"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 px-1.5 bg-stone-100 text-stone-450 rounded-lg">
                <RefreshCw size={11} className="animate-spin text-stone-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider text-stone-400">
                  Offloaded {name.split(" ")[0]}
                </p>
                <p className="text-[8px] text-stone-400 font-sans font-light mt-0.5">
                  Click/scroll to load model definition
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 pr-1">
              <span className="text-[7.5px] font-mono bg-stone-200 border border-stone-300 px-1 py-0.2 rounded text-stone-500 uppercase">
                {category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Offloaded" />
            </div>
          </div>
        ) : (
          // Fully loaded building component item with add trigguer and dynamic offloader action too!
          <div
            onClick={onAdd}
            className={`w-full p-3 bg-white border border-stone-200/90 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:shadow-sm transition-all duration-250 group relative cursor-pointer ${themes.wrapperHover}`}
          >
            <div className="flex items-center gap-2.5 pr-2 truncate">
              {/* LED connection status and individual offload trigger */}
              <div className="relative group/off">
                <div className={`p-1 px-1.5 rounded-lg transition ${themes.iconBg}`}>
                  {icon}
                </div>
                {/* On hover show an individual unload tool */}
                <button
                  type="button"
                  onClick={toggleLoad}
                  title="Unload element description code to free heap memory"
                  className="absolute inset-0 bg-stone-900 border border-stone-850 text-amber-400 rounded-lg opacity-0 group-hover/off:opacity-100 transition duration-150 flex items-center justify-center cursor-pointer shadow z-10"
                >
                  <RefreshCw size={9} />
                </button>
              </div>

              <div className="flex flex-col text-left truncate">
                <span className="group-hover:text-stone-900 transition font-sans text-[11.5px] leading-snug">
                  {name}
                </span>
                <span className="text-[8px] font-mono font-medium text-stone-400 uppercase tracking-widest mt-0.5">
                  Type: {category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Small LED indicating hydration state */}
              <span 
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" 
                title="Hydrated & loaded inside app registry"
              />
              <div className={`p-1 rounded-full bg-stone-50 group-hover:bg-white transition ${themes.plusColor}`}>
                <Plus size={11} className="stroke-[2.5]" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
