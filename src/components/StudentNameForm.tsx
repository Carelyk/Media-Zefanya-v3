import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { IconFlower } from "@/components/Icons";

interface Props {
  onSubmit: (name: string) => void;
}

const StudentNameForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      {/* hiasan taman */}
      <span className="fixed top-10 left-8 sway select-none" style={{ animationDelay: "-1s" }} aria-hidden>
        <IconFlower className="w-10 h-10" style={{ color: "hsl(var(--sense-rasa))" }} />
      </span>
      <span className="fixed bottom-14 right-10 sway select-none" aria-hidden>
        <IconFlower className="w-12 h-12" style={{ color: "hsl(var(--sense-warna))" }} />
      </span>
      <span className="fixed top-24 right-16 sway select-none" style={{ animationDelay: "-2.5s" }} aria-hidden>
        <IconFlower className="w-8 h-8" style={{ color: "hsl(var(--sense-bunyi))" }} />
      </span>
      <span className="fixed bottom-24 left-14 sway select-none" style={{ animationDelay: "-3.5s" }} aria-hidden>
        <IconFlower className="w-8 h-8" style={{ color: "hsl(var(--sense-manfaat))" }} />
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="garden-card px-7 sm:px-10 pt-10 pb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
            className="mb-3 flex justify-center"
          >
            <IconFlower className="w-16 h-16 text-primary" />
          </motion.div>
          <h1 className="font-heading font-extrabold text-3xl leading-tight">
            Kebun Bunga Indra
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Tanam bunga dari enam indramu: amati benda, lalu lihat kelopaknya mekar satu per satu.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4 text-left">
            <div>
              <label className="block font-heading font-bold text-sm mb-2">
                Siapa namamu, kebun kecil?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik namamu di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-lg font-semibold"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.55)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mulai Menanam
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center mt-5">
          <Link to="/hasil" className="inline-flex items-center justify-center gap-1.5 text-primary font-heading font-bold text-sm hover:underline">
            <GraduationCap className="w-4 h-4" />
            Halaman Guru: lihat hasil jawaban siswa
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentNameForm;
