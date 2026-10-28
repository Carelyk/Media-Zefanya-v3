import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { IconEye, IconPencil, IconMindMap, IconBookOpen, IconRobot, IconTarget } from "@/components/Icons";

interface Props {
  activeStep: number;
  highestStep: number;
  onStepClick: (i: number) => void;
}

/* Ikon tiap langkah: disamakan dengan konsep A (buku cerita) */
const STOPS = [
  { label: "1 Amati", icon: <IconEye className="w-4 h-4" /> },
  { label: "2 Isi Indra", icon: <IconPencil className="w-4 h-4" /> },
  { label: "3 Bunga", icon: <IconMindMap className="w-4 h-4" /> },
  { label: "4 Menulis", icon: <IconBookOpen className="w-4 h-4" /> },
  { label: "5 AI", icon: <IconRobot className="w-4 h-4" /> },
  { label: "6 Hasil", icon: <IconTarget className="w-4 h-4" /> },
];

/**
 * Jalur perjalanan langkah belajar dengan ikon tiap perhentian
 * (sama seperti konsep A). Lebah Zefa terbang ke perhentian aktif.
 */
const BeeJourney = ({ activeStep, highestStep, onStepClick }: Props) => {
  const stops = STOPS;

  return (
    <div className="max-w-3xl mx-auto px-4" aria-label="Jalur langkah belajar">
      <div className="flex gap-1.5 justify-center flex-wrap">
        {stops.map((stop, i) => {
          const isAccessible = i <= highestStep || i <= activeStep;
          const isDone = i < highestStep && i !== activeStep;
          return (
            <button
              key={i}
              onClick={() => isAccessible && onStepClick(i)}
              disabled={!isAccessible}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full font-heading font-bold text-xs transition-all shadow-blobby ${
                activeStep === i
                  ? "bg-card text-foreground scale-105 border-2 border-foreground/15"
                  : isAccessible
                    ? "bg-card/85 text-muted-foreground border border-border hover:-translate-y-0.5 cursor-pointer"
                    : "bg-muted/50 text-muted-foreground/40 border border-transparent cursor-not-allowed"
              }`}
            >
              <span className="text-sm flex items-center">
                {isDone ? <Check className="w-4 h-4 text-primary" /> : stop.icon}
              </span>
              <span className="hidden sm:inline">{stop.label}</span>
            </button>
          );
        })}
      </div>

      {/* Lebah Zefa: terbang mengikuti langkah aktif */}
      <div className="relative h-8 max-w-3xl mx-auto mt-1 hidden sm:block">
        <motion.svg
          width="40"
          height="32"
          viewBox="0 0 40 32"
          className="absolute -top-1"
          initial={false}
          animate={{
            left: `${Math.min(4 + activeStep * 15, 82)}%`,
            y: activeStep % 2 === 0 ? 0 : 4,
          }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        >
          <ellipse cx="18" cy="18" rx="12" ry="10" fill="hsl(var(--bee))" stroke="hsl(0 0% 12%)" strokeWidth="1.5" />
          <path d="M12 10 v16 M19 9 v18" stroke="hsl(0 0% 12%)" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="13" cy="5" rx="7" ry="4" fill="#fff" opacity="0.9" stroke="hsl(0 0% 12%)" strokeWidth="0.8" transform="rotate(-24 13 5)" />
          <ellipse cx="23" cy="5" rx="7" ry="4" fill="#fff" opacity="0.9" stroke="hsl(0 0% 12%)" strokeWidth="0.8" transform="rotate(24 23 5)" />
          <circle cx="28" cy="16" r="1.5" fill="hsl(0 0% 12%)" />
          <circle cx="32" cy="14" r="2.4" fill="hsl(0 0% 12%)" />
        </motion.svg>
      </div>
    </div>
  );
};

export default BeeJourney;
