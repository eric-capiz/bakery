import { useEffect, useState } from "react";
import AdminShell from "../../src/components/AdminShell";
import { useAdminAuth } from "../../src/components/useAdminAuth";
import type {
  SiteContent,
  HeroContent,
  FeatureItem,
  ServiceItem,
  AboutContent,
  FaqItem,
} from "../../lib/content";

type Section =
  | "hero"
  | "features"
  | "services"
  | "about"
  | "faq"
  | "extras";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "services", label: "Services" },
  { id: "about", label: "About + contact" },
  { id: "faq", label: "FAQ" },
  { id: "extras", label: "Notice, gallery, ticker" },
];

const PIT_EMOJIS = [
  "🔧",
  "🚐",
  "📋",
  "⏱️",
  "🛞",
  "🔋",
  "🛢️",
  "🚗",
  "⚙️",
  "🧰",
  "💡",
  "❄️",
  "⭐",
  "✅",
  "📞",
  "📍",
  "💰",
  "🚨",
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input
        type="text"
        className="admin-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <textarea
        className="admin-input admin-textarea"
        rows={rows ?? 4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

const AdminContent = () => {
  const { ready, mounted, isChecking } = useAdminAuth();
  const [section, setSection] = useState<Section>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const res = await fetch("/api/content/get");
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as SiteContent;
        setContent(data);
      } catch {
        setLoadError("Could not load site content. Try reloading.");
      }
    })();
  }, [ready]);

  if (loadError) {
    return (
      <AdminShell
        title="Site content"
        subtitle="Edit the Pit site copy."
      >
        <div className="admin-card">
          <p className="admin-note">{loadError}</p>
          <button
            type="button"
            className="admin-add-btn"
            style={{ marginTop: "1rem" }}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </AdminShell>
    );
  }

  if (!mounted || isChecking || !content) {
    return <AdminShell title="Site content" loading />;
  }

  if (!ready) {
    return null;
  }

  const setHero = (patch: Partial<HeroContent>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } });
  const setAbout = (patch: Partial<AboutContent>) =>
    setContent({ ...content, about: { ...content.about, ...patch } });

  const save = async () => {
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("save failed");
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setSaveError("Save failed — check your connection and try again.");
    }
  };

  const { hero, about, features, services, faq } = content;

  return (
    <AdminShell
      title="Site content"
      subtitle="Edits go live on the next page load. Hit Save when done."
    >
      <div className="admin-panel-header">
        <div className="admin-panel-heading">
          <h2>Pit site copy</h2>
          <p className="admin-panel-desc">
            Everything visitors see on the home, services, about, and booking
            pages.
          </p>
        </div>
        <button
          type="button"
          className="admin-save-btn"
          onClick={save}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? "Saving…" : "Save all"}
        </button>
      </div>

      {saveState === "saved" ? (
        <div className="admin-status admin-status--ok">Saved.</div>
      ) : null}
      {saveState === "error" ? (
        <div className="admin-status admin-status--bad">{saveError}</div>
      ) : null}

      <div className="admin-section-tabs" role="tablist" aria-label="Content sections">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            className={section === s.id ? "is-active" : ""}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "hero" ? (
        <div className="admin-card">
          <h2>Hero</h2>
          <div className="admin-fields">
            <Field label="Eyebrow (small kicker above the title)" value={hero.eyebrow} onChange={(v) => setHero({ eyebrow: v })} />
            <div className="admin-grid-3">
              <Field label="Title" value={hero.title} onChange={(v) => setHero({ title: v })} />
              <Field label="Title accent" value={hero.titleAccent} onChange={(v) => setHero({ titleAccent: v })} hint="Extra words after the title, same line." />
              <Field label="Title end" value={hero.titleEnd} onChange={(v) => setHero({ titleEnd: v })} />
            </div>
            <Field label="Headline line (under the big title)" value={hero.subtitle} onChange={(v) => setHero({ subtitle: v })} />
            <TextAreaField label="Sub line (smaller text under the headline)" value={hero.caption} onChange={(v) => setHero({ caption: v })} rows={2} />
            <div className="admin-grid-2">
              <Field label="Primary button text" value={hero.ctaPrimary} onChange={(v) => setHero({ ctaPrimary: v })} />
              <Field label="Primary button link" value={hero.ctaPrimaryHref} onChange={(v) => setHero({ ctaPrimaryHref: v })} placeholder="/book" />
              <Field label="Secondary button text" value={hero.ctaSecondary} onChange={(v) => setHero({ ctaSecondary: v })} />
              <Field label="Secondary button link" value={hero.ctaSecondaryHref} onChange={(v) => setHero({ ctaSecondaryHref: v })} placeholder="/services" />
            </div>
            <Field label="Hero image URL" value={hero.image} onChange={(v) => setHero({ image: v })} placeholder="/img/pit/home/hero.jpg" />
            <Field label="Hero image alt text" value={hero.imageAlt} onChange={(v) => setHero({ imageAlt: v })} />
          </div>
        </div>
      ) : null}

      {section === "features" ? (
        <div className="admin-card">
          <h2>Features</h2>
          <p className="admin-note">
            Shown as the three numbered pillars on the About page.
          </p>
          <div className="admin-fields">
            {features.map((f, i) => (
              <div key={i} className="admin-list-row">
                <div className="admin-list-fields">
                  <label className="admin-field">
                    <span className="admin-field-label">Icon (emoji)</span>
                    <div className="admin-emoji-row">
                      <span className="admin-emoji-current">{f.icon}</span>
                      <div className="admin-emoji-choices">
                        {PIT_EMOJIS.map((e) => (
                          <button
                            key={e}
                            type="button"
                            className={
                              f.icon === e
                                ? "admin-emoji-choice is-selected"
                                : "admin-emoji-choice"
                            }
                            onClick={() =>
                              setContent({
                                ...content,
                                features: features.map((x, xi) =>
                                  xi === i ? { ...x, icon: e } : x
                                ),
                              })
                            }
                            aria-label={`Use ${e}`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </label>
                  <Field
                    label="Title"
                    value={f.title}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        features: features.map((x, xi) =>
                          xi === i ? { ...x, title: v } : x
                        ),
                      })
                    }
                  />
                  <Field
                    label="Description"
                    value={f.description}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        features: features.map((x, xi) =>
                          xi === i ? { ...x, description: v } : x
                        ),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  className="admin-remove-btn"
                  onClick={() =>
                    setContent({
                      ...content,
                      features: features.filter((_, xi) => xi !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-add-btn"
              onClick={() =>
                setContent({
                  ...content,
                  features: [
                    ...features,
                    { icon: "🔧", title: "", description: "" } as FeatureItem,
                  ],
                })
              }
            >
              + Add feature
            </button>
          </div>
        </div>
      ) : null}

      {section === "services" ? (
        <div className="admin-card">
          <h2>Services</h2>
          <p className="admin-note">
            Names and blurbs for the price board rows. Prices stay on the page
            itself — edit them there or ask the developer.
          </p>
          <div className="admin-fields">
            {services.map((s, i) => (
              <div key={i} className="admin-list-row">
                <div className="admin-list-fields">
                  <Field
                    label={`Service ${i + 1} name`}
                    value={s.title}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        services: services.map((x, xi) =>
                          xi === i ? { ...x, title: v } : x
                        ),
                      })
                    }
                  />
                  <Field
                    label="Blurb"
                    value={s.description}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        services: services.map((x, xi) =>
                          xi === i ? { ...x, description: v } : x
                        ),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  className="admin-remove-btn"
                  onClick={() =>
                    setContent({
                      ...content,
                      services: services.filter((_, xi) => xi !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-add-btn"
              onClick={() =>
                setContent({
                  ...content,
                  services: [
                    ...services,
                    { title: "", description: "" } as ServiceItem,
                  ],
                })
              }
            >
              + Add service
            </button>
          </div>
        </div>
      ) : null}

      {section === "about" ? (
        <div className="admin-card">
          <h2>About + contact</h2>
          <div className="admin-fields">
            <TextAreaField
              label="Intro"
              value={about.intro}
              onChange={(v) => setAbout({ intro: v })}
              rows={5}
              hint="Blank line = new paragraph on the About page."
            />
            <div className="admin-field">
              <span className="admin-field-label">Highlights</span>
              {about.highlights.map((h, i) => (
                <div key={i} className="admin-inline-row">
                  <input
                    type="text"
                    className="admin-input"
                    value={h}
                    onChange={(e) =>
                      setAbout({
                        highlights: about.highlights.map((x, xi) =>
                          xi === i ? e.target.value : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() =>
                      setAbout({
                        highlights: about.highlights.filter(
                          (_, xi) => xi !== i
                        ),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-add-btn"
                onClick={() =>
                  setAbout({ highlights: [...about.highlights, ""] })
                }
              >
                + Add highlight
              </button>
            </div>
            <div className="admin-callout">
              <strong>Owner to-do:</strong> the phone, shop address, and email
              below are placeholders. Replace them with the real shop details.
            </div>
            <div className="admin-grid-2">
              <Field label="Phone" value={about.phone} onChange={(v) => setAbout({ phone: v })} placeholder="(555) 014-4820" />
              <Field label="Email" value={about.email} onChange={(v) => setAbout({ email: v })} placeholder="hello@pitgarage.com" />
            </div>
            <Field label="Shop address" value={about.address} onChange={(v) => setAbout({ address: v })} placeholder="418 Ironworks Ave" />
            <div className="admin-field">
              <span className="admin-field-label">Hours</span>
              {about.hours.map((h, i) => (
                <div key={i} className="admin-inline-row admin-hours-row">
                  <input
                    type="text"
                    className="admin-input"
                    value={h.day}
                    aria-label="Days"
                    onChange={(e) =>
                      setAbout({
                        hours: about.hours.map((x, xi) =>
                          xi === i ? { ...x, day: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={h.time}
                    aria-label="Time"
                    onChange={(e) =>
                      setAbout({
                        hours: about.hours.map((x, xi) =>
                          xi === i ? { ...x, time: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() =>
                      setAbout({
                        hours: about.hours.filter((_, xi) => xi !== i),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-add-btn"
                onClick={() =>
                  setAbout({
                    hours: [...about.hours, { day: "", time: "" }],
                  })
                }
              >
                + Add hours row
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {section === "faq" ? (
        <div className="admin-card">
          <h2>FAQ</h2>
          <p className="admin-note">Shown on the booking page.</p>
          <div className="admin-fields">
            {faq.map((f, i) => (
              <div key={i} className="admin-list-row">
                <div className="admin-list-fields">
                  <Field
                    label={`Question ${i + 1}`}
                    value={f.question}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        faq: faq.map((x, xi) =>
                          xi === i ? { ...x, question: v } : x
                        ),
                      })
                    }
                  />
                  <TextAreaField
                    label="Answer"
                    value={f.answer}
                    rows={2}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        faq: faq.map((x, xi) =>
                          xi === i ? { ...x, answer: v } : x
                        ),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  className="admin-remove-btn"
                  onClick={() =>
                    setContent({
                      ...content,
                      faq: faq.filter((_, xi) => xi !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-add-btn"
              onClick={() =>
                setContent({
                  ...content,
                  faq: [...faq, { question: "", answer: "" } as FaqItem],
                })
              }
            >
              + Add question
            </button>
          </div>
        </div>
      ) : null}

      {section === "extras" ? (
        <div className="admin-card">
          <h2>Notice, gallery, ticker</h2>
          <div className="admin-fields">
            <TextAreaField
              label="Shop notice banner (empty = hidden)"
              value={content.notice}
              onChange={(v) => setContent({ ...content, notice: v })}
              rows={2}
              hint="Shows at the top of the home page. Good for holiday hours or promos."
            />
            <div className="admin-field">
              <span className="admin-field-label">Ticker items</span>
              <span className="admin-field-hint">
                The scrolling tape on the home page.
              </span>
              {content.marquee.map((m, i) => (
                <div key={i} className="admin-inline-row">
                  <input
                    type="text"
                    className="admin-input"
                    value={m}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        marquee: content.marquee.map((x, xi) =>
                          xi === i ? e.target.value : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() =>
                      setContent({
                        ...content,
                        marquee: content.marquee.filter((_, xi) => xi !== i),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-add-btn"
                onClick={() =>
                  setContent({ ...content, marquee: [...content.marquee, ""] })
                }
              >
                + Add ticker item
              </button>
            </div>
            <div className="admin-field">
              <span className="admin-field-label">Gallery image URLs</span>
              <span className="admin-field-hint">
                Reference image paths used across the site (for record keeping
                and future gallery use).
              </span>
              {content.gallery.map((g, i) => (
                <div key={i} className="admin-inline-row">
                  <input
                    type="text"
                    className="admin-input"
                    value={g}
                    placeholder="/img/pit/…"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        gallery: content.gallery.map((x, xi) =>
                          xi === i ? e.target.value : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() =>
                      setContent({
                        ...content,
                        gallery: content.gallery.filter((_, xi) => xi !== i),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-add-btn"
                onClick={() =>
                  setContent({ ...content, gallery: [...content.gallery, ""] })
                }
              >
                + Add image URL
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="admin-panel-footer">
        <button
          type="button"
          className="admin-save-btn"
          onClick={save}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? "Saving…" : "Save all"}
        </button>
      </div>
    </AdminShell>
  );
};

export default AdminContent;
