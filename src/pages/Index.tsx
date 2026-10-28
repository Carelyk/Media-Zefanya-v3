import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Home, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import StudentNameForm from "@/components/StudentNameForm";
import MultisensoryCard, { PRESET_ITEMS } from "@/components/MultisensoryCard";
import DescriptionTable from "@/components/DescriptionTable";
import FlowerBloom from "@/components/FlowerBloom";
import TextEditor from "@/components/TextEditor";
import AiExpander from "@/components/AiExpander";
import ScoreDisplay from "@/components/ScoreDisplay";
import BeeJourney from "@/components/BeeJourney";
import { DescriptionItem } from "@/types/description";
import { supabase } from "@/integrations/supabase/client";

const EMPTY_ITEM = (): DescriptionItem => ({
  id: crypto.randomUUID(), namaBarang: "", warna: "", tekstur: "", rasa: "", aroma: "", bunyi: "", manfaat: "",
});

const Index = () => {
  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemLabels, setItemLabels] = useState<Record<string, string>>({});
  const [items, setItems] = useState<DescriptionItem[]>([EMPTY_ITEM()]);
  const [mindMapCenter, setMindMapCenter] = useState("");
  const [mindMapBranches, setMindMapBranches] = useState<Record<string, string>>({});
  const [descText, setDescText] = useState("");
  const [expandedText, setExpandedText] = useState("");
  const [essayText, setEssayText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedItemName = useMemo(() => {
    if (!selectedItemId) return "";
    const label = itemLabels[selectedItemId];
    if (label && label.trim()) return label.trim();
    const preset = PRESET_ITEMS.find((p) => p.id === selectedItemId);
    return preset?.name || "";
  }, [selectedItemId, itemLabels]);

  const keywords = useMemo(() => {
    const branchKeys = ["warna", "rasa", "tekstur", "aroma", "bunyi", "manfaat"];
    return branchKeys.map((k) => mindMapBranches[k] || "").filter((v) => v.trim());
  }, [mindMapBranches]);

  const allKeywordsMatched = useMemo(() => {
    if (keywords.length === 0) return false;
    const lower = descText.toLowerCase();
    return keywords.every((kw) => lower.includes(kw.trim().toLowerCase()));
  }, [keywords, descText]);

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const label = itemLabels[id];
    const name = (label && label.trim()) ? label.trim() : (PRESET_ITEMS.find((p) => p.id === id)?.name || "");
    setItems((prev) => {
      const updated = [...prev];
      if (updated.length > 0) updated[0] = { ...updated[0], namaBarang: name };
      return updated;
    });
    setMindMapCenter(name);
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0: return !!selectedItemId && !!selectedItemName;
      case 1: return items.length > 0 && items[0].namaBarang.trim() !== "";
      case 2: return mindMapCenter.trim() !== "" && Object.values(mindMapBranches).some((v) => v.trim());
      case 3: return descText.trim() !== "" && allKeywordsMatched;
      case 4: return true; // AI step is optional
      default: return true;
    }
  };

  const goToStep = (next: number) => {
    setActiveStep(next);
    if (next > highestStep) setHighestStep(next);
  };

  const handleNext = () => {
    if (!canProceedFromStep(activeStep)) {
      const messages = [
        "Pilih dulu satu benda yang akan kamu deskripsikan!",
        "Isilah nama benda di catatan sebelum melangkah!",
        "Isi minimal satu indra agar kelopak bungamu mekar!",
        "Tuliskan teks deskripsimu dan sebutkan semua kata kunci!",
        "Halaman ini boleh dilewati, langsung lanjut saja!",
      ];
      toast.warning(messages[activeStep] || "Lengkapi halaman ini dulu!");
      return;
    }
    goToStep(activeStep + 1);
  };

  const handleStepClick = (i: number) => {
    if (i <= highestStep || i <= activeStep) {
      goToStep(i);
    } else {
      toast.warning("Selesaikan langkah sebelumnya terlebih dahulu!");
    }
  };

  const syncTableToMindMap = (updatedItems: DescriptionItem[]) => {
    if (updatedItems.length > 0) {
      const first = updatedItems[0];
      setMindMapBranches((prev) => ({
        ...prev,
        warna: first.warna || prev.warna || "",
        tekstur: first.tekstur || prev.tekstur || "",
        rasa: first.rasa || prev.rasa || "",
        aroma: first.aroma || prev.aroma || "",
        bunyi: first.bunyi || prev.bunyi || "",
        manfaat: first.manfaat || prev.manfaat || "",
      }));
    }
  };

  const handleItemsChange = (newItems: DescriptionItem[]) => {
    setItems(newItems);
    syncTableToMindMap(newItems);
  };

  const handleBranchChange = (key: string, val: string) => {
    setMindMapBranches((prev) => ({ ...prev, [key]: val }));
  };

  const handleLabelChange = (id: string, label: string) => {
    setItemLabels((prev) => ({ ...prev, [id]: label }));
    if (id === selectedItemId && label.trim()) {
      setItems((prev) => {
        const updated = [...prev];
        if (updated.length > 0) updated[0] = { ...updated[0], namaBarang: label.trim() };
        return updated;
      });
      setMindMapCenter(label.trim());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("student_submissions").insert([{
        student_name: studentName,
        table_data: items as any,
        multisensory_notes: JSON.stringify({
          selectedItemId, itemLabels, mindMapCenter, mindMapBranches, essayText, expandedText,
        }),
        description_text: descText,
        score: 0,
        total_keywords: keywords.length,
        matched_keywords: keywords.length,
      }]);
      if (error) {
        console.error("Save error:", error);
        toast.error("Gagal menyimpan. Coba lagi!");
      } else {
        setSaved(true);
        toast.success("Jawaban berhasil disimpan!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan. Coba lagi!");
    } finally {
      setSaving(false);
    }
  };

  if (!started) {
    return <StudentNameForm onSubmit={(name) => { setStudentName(name); setStarted(true); }} />;
  }

  return (
    <div className="min-h-screen pb-10">
      {/* Kepala halaman */}
      <header className="pt-5 sm:pt-7 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => { setStarted(false); setActiveStep(0); setHighestStep(0); setSaved(false); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-card border border-border font-heading font-bold text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-soft"
            title="Kembali ke halaman awal"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Awal</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl">Kebun Bunga Indra</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Halo, <span className="font-bold text-foreground">{studentName}</span>, bunga gagasanmu sedang tumbuh!
            </p>
          </div>
          <div className="w-20 sm:w-28" />
        </div>
      </header>

      {/* Jalur perjalanan */}
      <div className="mt-4 mb-2">
        <BeeJourney activeStep={activeStep} highestStep={highestStep} onStepClick={handleStepClick} />
      </div>

      {/* Halaman langkah */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="garden-card px-4 sm:px-9 pt-7 sm:pt-9 pb-7"
          >
            {activeStep === 0 && (
              <MultisensoryCard
                selectedItemId={selectedItemId}
                onSelectItem={handleSelectItem}
                itemLabels={itemLabels}
                onLabelChange={handleLabelChange}
              />
            )}
            {activeStep === 1 && <DescriptionTable items={items} onItemsChange={handleItemsChange} />}
            {activeStep === 2 && (
              <FlowerBloom
                centerLabel={mindMapCenter}
                branches={mindMapBranches}
                onBranchChange={handleBranchChange}
              />
            )}
            {activeStep === 3 && (
              <TextEditor
                text={descText}
                onTextChange={setDescText}
                keywords={keywords}
                selectedItemName={selectedItemName}
              />
            )}
            {activeStep === 4 && (
              <AiExpander
                sourceText={descText}
                expandedText={expandedText}
                onExpandedTextChange={setExpandedText}
              />
            )}
            {activeStep === 5 && (
              <ScoreDisplay
                studentName={studentName}
                essayText={essayText}
                onEssayChange={setEssayText}
                onSave={handleSave}
                saving={saving}
                saved={saved}
              />
            )}

            {/* Navigasi */}
            <div className="flex justify-between gap-3 mt-7 pt-5 border-t border-dashed border-border">
              {activeStep > 0 ? (
                <button
                  onClick={() => goToStep(activeStep - 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-muted text-foreground font-heading font-bold text-sm hover:bg-muted/70 active:translate-y-0.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </button>
              ) : (
                <span />
              )}
              {activeStep < 5 && (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.55)]"
                >
                  Lanjut
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="text-center py-5">
        <Link to="/hasil" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border-2 border-border font-heading font-bold text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-soft">
          <GraduationCap className="w-4 h-4" />
          Halaman Guru: lihat semua jawaban siswa
        </Link>
      </footer>
    </div>
  );
};

export default Index;
