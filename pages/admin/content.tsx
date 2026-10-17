import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../src/components/AdminShell";
import type {
  SiteContent,
  HeroContent,
  FeatureItem,
  ServiceItem,
  AboutContent,
} from "../../lib/content";

/* Glyph suggestions suited to the dark-editorial voice (free text allowed). */
const GLYPH_SUGGESTIONS = ["❧", "✦", "◈", "❦", "✧", "◆", "⁂", "❋"];

type Section = "hero" | "practice" | "services" | "studio" | "notice";

const TABS: { id: Section; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "practice", label: "Practice" },
  { id: "services", label: "Services" },
  { id: "studio", label: "Studio" },
  { id: "notice", label: "Notice & Gallery" },
];

const AdminContent = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadContent();
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content/get");
      const data = await res.json();
      if (res.ok && data && data.hero) {
        setContent(data as SiteContent);
      } else {
        setError("Failed to load content.");
      }
    } catch (err) {
      setError("Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  const saveAll = async () => {
    if (!content || saving) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Content saved. The live site updates immediately.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to save content.");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  /* ---- nested updaters ---- */
  const patchHero = (patch: Partial<HeroContent>) =>
    setContent((c) => (c ? { ...c, hero: { ...c.hero, ...patch } } : c));

  const patchAbout = (patch: Partial<AboutContent>) =>
    setContent((c) => (c ? { ...c, about: { ...c.about, ...patch } } : c));

  const updateFeature = (index: number, patch: Partial<FeatureItem>) =>
    setContent((c) =>
      c
        ? {
            ...c,
            features: c.features.map((f, i) =>
              i === index ? { ...f, ...patch } : f
            ),
          }
        : c
    );

  const removeFeature = (index: number) =>
    setContent((c) =>
      c ? { ...c, features: c.features.filter((_, i) => i !== index) } : c
    );

  const addFeature = () =>
    setContent((c) =>
      c
        ? {
            ...c,
            features: [
              ...c.features,
              { icon: "✦", title: "New value", description: "" },
            ],
          }
        : c
    );

  const updateService = (index: number, patch: Partial<ServiceItem>) =>
    setContent((c) =>
      c
        ? {
            ...c,
            services: c.services.map((s, i) =>
              i === index ? { ...s, ...patch } : s
            ),
          }
        : c
    );

  const removeService = (index: number) =>
    setContent((c) =>
      c ? { ...c, services: c.services.filter((_, i) => i !== index) } : c
    );

  const addService = () =>
    setContent((c) =>
      c
        ? {
            ...c,
            services: [
              ...c.services,
              { title: "New service", description: "" },
            ],
          }
        : c
    );

  const updateHour = (index: number, patch: { day?: string; time?: string }) =>
    setContent((c) =>
      c
        ? {
            ...c,
            about: {
              ...c.about,
              hours: c.about.hours.map((h, i) =>
                i === index ? { ...h, ...patch } : h
              ),
            },
          }
        : c
    );

  const removeHour = (index: number) =>
    setContent((c) =>
      c
        ? {
            ...c,
            about: {
              ...c.about,
              hours: c.about.hours.filter((_, i) => i !== index),
            },
          }
        : c
    );

  const addHour = () =>
    setContent((c) =>
      c
        ? {
            ...c,
            about: {
              ...c.about,
              hours: [...c.about.hours, { day: "", time: "" }],
            },
          }
        : c
    );

  if (!mounted || isChecking) {
    return <AdminShell title="Content Management" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Content Management"
      subtitle="Edit the words on the site. Save writes the whole page at once — the live site updates immediately."
    >
      <div className="admin-section-tabs" role="tablist" aria-label="Content sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeSection === tab.id}
            className={activeSection === tab.id ? "is-active" : undefined}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="admin-status admin-status--error" role="alert">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="admin-status admin-status--success" role="status">
          {success}
        </div>
      ) : null}

      {loading || !content ? (
        <p style={{ color: "var(--admin-muted)", textAlign: "center" }}>
          Loading content…
        </p>
      ) : (
        <>
          {activeSection === "hero" && (
            <div className="admin-card">
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Hero</h2>
                  <p className="admin-panel-desc">
                    The opening chamber on the home page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-eyebrow">
                  Eyebrow (brand word)
                </label>
                <input
                  id="hero-eyebrow"
                  className="admin-input"
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) => patchHero({ eyebrow: e.target.value })}
                />
              </div>

              <div className="admin-row admin-row--2">
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-title">
                    Title (before accent)
                  </label>
                  <input
                    id="hero-title"
                    className="admin-input"
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => patchHero({ title: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-accent">
                    Title accent word
                  </label>
                  <input
                    id="hero-accent"
                    className="admin-input"
                    type="text"
                    value={content.hero.titleAccent}
                    onChange={(e) => patchHero({ titleAccent: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-title-end">
                  Title (after accent)
                </label>
                <input
                  id="hero-title-end"
                  className="admin-input"
                  type="text"
                  value={content.hero.titleEnd}
                  onChange={(e) => patchHero({ titleEnd: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-subtitle">
                  Subtitle
                </label>
                <textarea
                  id="hero-subtitle"
                  className="admin-textarea"
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => patchHero({ subtitle: e.target.value })}
                />
              </div>

              <div className="admin-row admin-row--2">
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-cta1">
                    Primary button label
                  </label>
                  <input
                    id="hero-cta1"
                    className="admin-input"
                    type="text"
                    value={content.hero.ctaPrimary}
                    onChange={(e) => patchHero({ ctaPrimary: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-cta1-href">
                    Primary button link
                  </label>
                  <input
                    id="hero-cta1-href"
                    className="admin-input"
                    type="text"
                    value={content.hero.ctaPrimaryHref}
                    onChange={(e) =>
                      patchHero({ ctaPrimaryHref: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-row admin-row--2">
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-cta2">
                    Secondary button label
                  </label>
                  <input
                    id="hero-cta2"
                    className="admin-input"
                    type="text"
                    value={content.hero.ctaSecondary}
                    onChange={(e) => patchHero({ ctaSecondary: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="hero-cta2-href">
                    Secondary button link
                  </label>
                  <input
                    id="hero-cta2-href"
                    className="admin-input"
                    type="text"
                    value={content.hero.ctaSecondaryHref}
                    onChange={(e) =>
                      patchHero({ ctaSecondaryHref: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-image">
                  Hero image URL
                </label>
                <input
                  id="hero-image"
                  className="admin-input"
                  type="text"
                  value={content.hero.image}
                  onChange={(e) => patchHero({ image: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-alt">
                  Image alt text
                </label>
                <input
                  id="hero-alt"
                  className="admin-input"
                  type="text"
                  value={content.hero.imageAlt}
                  onChange={(e) => patchHero({ imageAlt: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="hero-caption">
                  Image caption
                </label>
                <input
                  id="hero-caption"
                  className="admin-input"
                  type="text"
                  value={content.hero.caption}
                  onChange={(e) => patchHero({ caption: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeSection === "practice" && (
            <div className="admin-card">
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Practice values</h2>
                  <p className="admin-panel-desc">
                    The three (or more) statements on the Practice page. Add or
                    remove as needed.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              {content.features.map((feature, index) => (
                <div className="admin-item" key={index}>
                  <div className="admin-item-head">
                    <h3>Value {index + 1}</h3>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Remove “${feature.title}”? (Not saved until you press Save.)`
                          )
                        ) {
                          removeFeature(index);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="admin-field">
                    <span className="admin-label">Glyph</span>
                    <div className="admin-glyphs">
                      {GLYPH_SUGGESTIONS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={
                            "admin-glyph" +
                            (feature.icon === g ? " is-selected" : "")
                          }
                          onClick={() => updateFeature(index, { icon: g })}
                          aria-label={`Use glyph ${g}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <input
                      className="admin-input"
                      type="text"
                      value={feature.icon}
                      onChange={(e) =>
                        updateFeature(index, { icon: e.target.value })
                      }
                      placeholder="Or type any glyph or character"
                      aria-label="Feature glyph"
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Title</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={feature.title}
                      onChange={(e) =>
                        updateFeature(index, { title: e.target.value })
                      }
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={feature.description}
                      onChange={(e) =>
                        updateFeature(index, { description: e.target.value })
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={addFeature}
              >
                + Add value
              </button>
            </div>
          )}

          {activeSection === "services" && (
            <div className="admin-card">
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Services</h2>
                  <p className="admin-panel-desc">
                    The “Selected work” strip on the home page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              {content.services.map((service, index) => (
                <div className="admin-item" key={index}>
                  <div className="admin-item-head">
                    <h3>Service {index + 1}</h3>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Remove “${service.title}”? (Not saved until you press Save.)`
                          )
                        ) {
                          removeService(index);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Title</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={service.title}
                      onChange={(e) =>
                        updateService(index, { title: e.target.value })
                      }
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={service.description}
                      onChange={(e) =>
                        updateService(index, { description: e.target.value })
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={addService}
              >
                + Add service
              </button>
            </div>
          )}

          {activeSection === "studio" && (
            <div className="admin-card">
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Studio</h2>
                  <p className="admin-panel-desc">
                    Practice intro, highlights, contact details, and hours —
                    shown on the Practice and Commission pages.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="about-intro">
                  Studio intro
                </label>
                <textarea
                  id="about-intro"
                  className="admin-textarea"
                  rows={6}
                  value={content.about.intro}
                  onChange={(e) => patchAbout({ intro: e.target.value })}
                />
                <p className="admin-hint">
                  Separate paragraphs with a blank line.
                </p>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="about-highlights">
                  Highlights (one per line)
                </label>
                <textarea
                  id="about-highlights"
                  className="admin-textarea"
                  rows={4}
                  value={content.about.highlights.join("\n")}
                  onChange={(e) =>
                    patchAbout({
                      highlights: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="admin-row admin-row--2">
                <div className="admin-field">
                  <label className="admin-label" htmlFor="about-email">
                    Email
                  </label>
                  <input
                    id="about-email"
                    className="admin-input"
                    type="email"
                    value={content.about.email}
                    onChange={(e) => patchAbout({ email: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="about-phone">
                    Phone
                  </label>
                  <input
                    id="about-phone"
                    className="admin-input"
                    type="tel"
                    value={content.about.phone}
                    onChange={(e) => patchAbout({ phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="about-address">
                  Visits / address line
                </label>
                <input
                  id="about-address"
                  className="admin-input"
                  type="text"
                  value={content.about.address}
                  onChange={(e) => patchAbout({ address: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <span className="admin-label">Studio hours</span>
                {content.about.hours.map((hour, index) => (
                  <div className="admin-item" key={index}>
                    <div className="admin-item-head">
                      <h3>Row {index + 1}</h3>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={() => removeHour(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="admin-row admin-row--2">
                      <div className="admin-field">
                        <label className="admin-label">Day(s)</label>
                        <input
                          className="admin-input"
                          type="text"
                          value={hour.day}
                          onChange={(e) =>
                            updateHour(index, { day: e.target.value })
                          }
                        />
                      </div>
                      <div className="admin-field">
                        <label className="admin-label">Time</label>
                        <input
                          className="admin-input"
                          type="text"
                          value={hour.time}
                          onChange={(e) =>
                            updateHour(index, { time: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn admin-btn--add"
                  onClick={addHour}
                >
                  + Add hours row
                </button>
              </div>
            </div>
          )}

          {activeSection === "notice" && (
            <div className="admin-card">
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Notice &amp; gallery</h2>
                  <p className="admin-panel-desc">
                    The announcement banner at the top of the home page, and
                    the gallery image list.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="notice">
                  Announcement banner
                </label>
                <textarea
                  id="notice"
                  className="admin-textarea"
                  rows={3}
                  value={content.notice}
                  onChange={(e) =>
                    setContent((c) =>
                      c ? { ...c, notice: e.target.value } : c
                    )
                  }
                  placeholder="e.g. Booking late-autumn commissions now — two dates remain."
                />
                <p className="admin-hint">
                  Leave empty to hide the banner.
                </p>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="gallery">
                  Gallery image URLs (one per line)
                </label>
                <textarea
                  id="gallery"
                  className="admin-textarea"
                  rows={8}
                  value={content.gallery.join("\n")}
                  onChange={(e) =>
                    setContent((c) =>
                      c
                        ? {
                            ...c,
                            gallery: e.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : c
                    )
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
};

export default AdminContent;
