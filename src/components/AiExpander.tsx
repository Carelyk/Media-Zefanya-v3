import { useState } from "react";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  sourceText: string;
  expandedText: string;
  onExpandedTextChange: (text: string) => void;
}

const AiExpander = ({ sourceText, expandedText, onExpandedTextChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!sourceText.trim()) {
      toast.warning("Salin dulu teks dari halaman sebelumnya!");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("expand-text", {
        body: { text: sourceText },
      });
      if (error) {
        console.error("AI error:", error);
        toast.error("Gagal menghubungi AI. Coba lagi!");
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.result) {
        onExpandedTextChange(data.result);
        toast.success("Teks berhasil dikembangkan!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySource = () => {
    onExpandedTextChange(sourceText);
    toast.success("Teks disalin!");
  };

  return (
    <div>
      <h2 className="font-heading font-extrabold text-xl sm:text-2xl">Kembangkan bersama Si Pintar</h2>
      <p className="text-muted-foreground text-sm mt-1 mb-5">
        Halaman ini boleh dilewati. Jika mau, teksmu bisa dibantu agar lebih rinci dan detail.
      </p>

      {sourceText.trim() && (
        <div className="mb-4 bg-card border border-border rounded-3xl p-4 shadow-soft">
          <p className="font-heading font-bold text-xs text-muted-foreground mb-1">Teks dari halaman sebelumnya:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{sourceText}</p>
          <button
            onClick={handleCopySource}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-primary font-heading font-bold text-xs hover:bg-muted/70 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Salin ke kotak bawah
          </button>
        </div>
      )}

      <div className="garden-card overflow-hidden mb-4">
        <textarea
          value={expandedText}
          onChange={(e) => onExpandedTextChange(e.target.value)}
          placeholder="Teks hasil pengembangan akan muncul di sini, dan boleh kamu perbaiki sendiri..."
          rows={7}
          className="w-full bg-transparent px-5 sm:px-7 pt-5 pb-5 text-foreground placeholder:text-muted-foreground focus:outline-none font-semibold leading-[1.9] text-base resize-none"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExpand}
          disabled={loading || !expandedText.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_hsl(var(--primary)/0.55)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sedang mengembangkan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Kembangkan dengan AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiExpander;
