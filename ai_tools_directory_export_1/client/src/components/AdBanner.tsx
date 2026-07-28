import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// Reads the AdSense publisher/slot IDs from env so the same component works
// across environments without code changes. See `.env.example`.
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let adsenseScriptPromise: Promise<void> | null = null;

function loadAdSenseScript(client: string) {
  if (adsenseScriptPromise) return adsenseScriptPromise;
  adsenseScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-adsbygoogle]");
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adsbygoogle = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load AdSense script"));
    document.head.appendChild(script);
  });
  return adsenseScriptPromise;
}

/**
 * A slim, dismissible banner ad. Non-intrusive by design: fixed low height,
 * lives inline in the page flow (never a modal/overlay), and clearly labeled
 * "Advertisement" so it never gets confused with real content.
 *
 * - If VITE_ADSENSE_CLIENT_ID / VITE_ADSENSE_SLOT_ID are set, it renders a
 *   real Google AdSense unit.
 * - Otherwise it falls back to a lightweight house placeholder that links out
 *   to Google AdSense, so the slot is still wired to an actual ad service.
 */
export default function AdBanner() {
  const [dismissed, setDismissed] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const isConfigured = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT);

  useEffect(() => {
    if (!isConfigured || dismissed || pushed.current) return;
    loadAdSenseScript(ADSENSE_CLIENT as string)
      .then(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } catch (err) {
          console.warn("[AdBanner] Failed to render AdSense unit:", err);
        }
      })
      .catch((err) => console.warn("[AdBanner] Failed to load AdSense:", err));
  }, [isConfigured, dismissed]);

  if (dismissed) return null;

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-2 relative flex items-center justify-center min-h-[70px]">
        <span className="absolute left-4 top-1 text-[10px] uppercase tracking-wide text-slate-400 select-none">
          Advertisement
        </span>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss advertisement"
          className="absolute right-2 top-2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {isConfigured ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: "block", width: "100%", maxWidth: 728, height: 90 }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={ADSENSE_SLOT}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        ) : (
          <a
            href="https://adsense.google.com/start/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center w-full max-w-[728px] h-[70px] border border-dashed border-slate-300 rounded-md text-sm text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors"
          >
            Advertise your AI tool here
          </a>
        )}
      </div>
    </div>
  );
}
