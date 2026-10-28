import { useMemo } from "react";
import { motion } from "framer-motion";
import { IconEye, IconHand, IconTongue, IconNose, IconEar, IconBulb, IconFlower, IconStar } from "@/components/Icons";

interface Props {
  centerLabel: string;
  branches: Record<string, string>;
  onBranchChange: (key: string, val: string) => void;
}

const BRANCH_CONFIG = [
  { key: "warna", label: "Warna", Icon: IconEye, cls: "sense-warna" },
  { key: "tekstur", label: "Tekstur", Icon: IconHand, cls: "sense-tekstur" },
  { key: "rasa", label: "Rasa", Icon: IconTongue, cls: "sense-rasa" },
  { key: "aroma", label: "Aroma", Icon: IconNose, cls: "sense-aroma" },
  { key: "bunyi", label: "Bunyi", Icon: IconEar, cls: "sense-bunyi" },
  { key: "manfaat", label: "Manfaat", Icon: IconBulb, cls: "sense-manfaat" },
];

const PETAL_FILLS = [
  { fill: "hsl(var(--sense-warna))", rotate: 0 },
  { fill: "hsl(var(--sense-tekstur))", rotate: 60 },
  { fill: "hsl(var(--sense-rasa))", rotate: 120 },
  { fill: "hsl(var(--sense-aroma))", rotate: 180 },
  { fill: "hsl(var(--sense-bunyi))", rotate: 240 },
  { fill: "hsl(var(--sense-manfaat))", rotate: 300 },
];

/**
 * Bunga gagasan: enam kelopak mekar mengikuti enam indra yang sudah diisi.
 * Pusat bunga = nama barang. Menggantikan mind map statis.
 */
const FlowerBloom = ({ centerLabel, branches, onBranchChange }: Props) => {
  const filledCount = useMemo(
    () => BRANCH_CONFIG.filter((b) => (branches[b.key] || "").trim()).length,
    [branches]
  );

  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl flex items-center gap-2">
        <IconFlower className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        Tanam bunga gagasanmu
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-4">
        Setiap indra yang kamu isi membuat satu kelopak mekar. Isi keenamnya agar bungamu mekar penuh!
      </p>

      <p className="flex items-center justify-center gap-1.5 font-heading font-bold text-sm text-muted-foreground mb-1">
        {filledCount === 6 ? (
          <>
            <IconFlower className="w-4 h-4 text-primary" />
            Bunga mekar penuh!
          </>
        ) : (
          `Kelopak mekar: ${filledCount}/6`
        )}
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        {/* Bunga */}
        <svg viewBox="0 0 300 310" className="w-64 sm:w-72 flex-none" aria-label="Bunga mekar interaktif">
          {/* gagang & daun */}
          <rect x="145" y="238" width="9" height="66" rx="4.5" fill="var(--leaf)" />
          <ellipse cx="122" cy="272" rx="17" ry="8" fill="hsl(var(--sense-rasa))" transform="rotate(-18 122 272)" />
          <ellipse cx="177" cy="288" rx="15" ry="7" fill="hsl(var(--sense-rasa))" transform="rotate(14 177 288)" />

          {/* kelopak: setiap kelopak dirotasi lewat grup induk, supaya skala
              mekar dari CSS tidak menimpa posisi rotasinya */}
          {PETAL_FILLS.map((petal, i) => {
            const key = BRANCH_CONFIG[i].key;
            const isOpen = (branches[key] || "").trim().length > 0;
            return (
              <g key={key} transform={`rotate(${petal.rotate} 150 150)`}>
                <ellipse
                  className={`petal ${isOpen ? "open" : ""}`}
                  cx="150"
                  cy="88"
                  rx="34"
                  ry="52"
                  fill={petal.fill}
                  style={{ transitionDelay: `${i * 60}ms` }}
                />
              </g>
            );
          })}

          {/* pusat */}
          <circle cx="150" cy="150" r="36" fill="hsl(var(--bee))" />
          <circle cx="150" cy="150" r="36" fill="none" stroke="hsl(var(--foreground) / 0.12)" strokeWidth="2" />
          <text x="150" y="153" textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(var(--foreground) / 0.8)" fontFamily="Nunito">
            {centerLabel ? centerLabel : "Topik"}
          </text>
        </svg>

        {/* Enam kartu indra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {BRANCH_CONFIG.map((branch, i) => {
            const value = branches[branch.key] || "";
            const filled = value.trim().length > 1;
            return (
              <motion.div
                key={branch.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-3 bg-card border-[2.5px] rounded-2xl px-3.5 py-2.5 shadow-blobby transition-colors ${
                  filled ? `border-${branch.cls.replace("sense-", "sense-")}` : "border-border"
                }`}
                style={filled ? { borderColor: `hsl(var(--${branch.cls}))` } : undefined}
              >
                <span className={`w-10 h-10 rounded-xl flex-none flex items-center justify-center ${branch.cls}`}>
                  <branch.Icon className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <label className="block font-heading font-bold text-xs text-muted-foreground">
                    {branch.label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onBranchChange(branch.key, e.target.value)}
                    placeholder="tulis di sini..."
                    className="w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
                {filled && (
                  <span className="stamp text-[10px] py-0.5 px-1.5 flex-none inline-flex items-center gap-0.5">
                    <IconStar className="w-2.5 h-2.5" />
                    hebat
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { BRANCH_CONFIG };
export default FlowerBloom;
