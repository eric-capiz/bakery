import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MAX_BUILD_CAKE_MESSAGE_LENGTH } from "../../lib/constants";
import {
  PASTRY_LABELS,
  PASTRY_TYPES,
  type PastryType,
} from "../../lib/pastryTypes";

function isPastryType(s: string): s is PastryType {
  return (PASTRY_TYPES as readonly string[]).includes(s);
}

const CookiePreviewCanvas = dynamic(
  () => import("../components/preview/CookiePreviewCanvas"),
  {
    ssr: false,
    loading: () => <p style={{ marginTop: "1rem" }}>Loading preview…</p>,
  }
);

const PreviewPastries = () => {
  const router = useRouter();
  const [pastryType, setPastryType] = useState<PastryType>("cake");
  const [message, setMessage] = useState("Happy Birthday");

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.pastry;
    const q = Array.isArray(raw) ? raw[0] : raw;
    if (typeof q === "string" && isPastryType(q)) setPastryType(q);
  }, [router.isReady, router.query.pastry]);

  return (
    <div
      style={{
        marginTop: "6rem",
        padding: "1.25rem",
        textAlign: "center",
        background: "var(--s-ivory)",
        minHeight: "100vh",
        color: "var(--s-text)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--s-display)",
          color: "var(--s-text-strong)",
          fontWeight: 600,
        }}
      >
        Preview pastries
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--s-muted)",
          maxWidth: 520,
          margin: "0.75rem auto 0",
          lineHeight: 1.55,
        }}
      >
        Simple 3D stand-ins for cake, cookie, pie, cupcake, and brownie (same
        categories as Build). Spin and zoom the scene; optional short message on
        the icing where it fits.
      </p>
      <label
        htmlFor="preview-message"
        style={{
          display: "block",
          maxWidth: 520,
          margin: "1rem auto 0",
          textAlign: "left",
          fontSize: "0.9rem",
          color: "var(--s-text-strong)",
          fontFamily: "var(--s-sans)",
        }}
      >
        Message on frosting
        <input
          id="preview-message"
          type="text"
          value={message}
          maxLength={MAX_BUILD_CAKE_MESSAGE_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Happy 30th Alex"
          style={{
            display: "block",
            width: "100%",
            marginTop: "0.35rem",
            padding: "0.5rem 0.65rem",
            borderRadius: 10,
            border: "1px solid var(--s-line)",
            fontSize: "0.95rem",
            boxSizing: "border-box",
            background: "var(--s-surface)",
            color: "var(--s-text)",
            fontFamily: "var(--s-sans)",
          }}
        />
      </label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          maxWidth: 520,
          margin: "1.25rem auto 0",
        }}
      >
        {PASTRY_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPastryType(t)}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: 999,
              border:
                pastryType === t
                  ? "1px solid var(--s-rose-deep)"
                  : "1px solid var(--s-line)",
              background:
                pastryType === t ? "var(--s-blush)" : "var(--s-surface)",
              color: "var(--s-text-strong)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontFamily: "var(--s-sans)",
            }}
          >
            {PASTRY_LABELS[t]}
          </button>
        ))}
      </div>
      <CookiePreviewCanvas pastryType={pastryType} message={message} />
    </div>
  );
};

export default PreviewPastries;
