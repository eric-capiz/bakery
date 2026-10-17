import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../src/components/AdminShell";
import {
  mergeContent,
  type SiteContent,
  type FeatureItem,
  type ServiceItem,
  type FaqItem,
} from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type Status = { kind: "idle" | "saving" | "saved" | "error"; text: string };

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

function ListShell({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card">
      <div className="admin-list-head">
        <h2>{title}</h2>
        <button type="button" className="admin-btn-ghost" onClick={onAdd}>
          {addLabel}
        </button>
      </div>
      <div className="admin-list">{children}</div>
    </div>
  );
}

const BLANK_FEATURE: FeatureItem = { icon: "◇", title: "", description: "" };
const BLANK_SERVICE: ServiceItem = { title: "", description: "" };
const BLANK_FAQ: FaqItem = { question: "", answer: "" };

const AdminContent = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
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

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const res = await fetch("/api/content/get");
        const data = await res.json();
        setContent(mergeContent(DEFAULT_CONTENT, data));
      } catch {
        setContent(DEFAULT_CONTENT);
      }
    })();
  }, [isAuthenticated]);

  const setHero = (key: keyof SiteContent["hero"], value: string) =>
    setContent((c) => (c ? { ...c, hero: { ...c.hero, [key]: value } } : c));

  const setAbout = (key: keyof SiteContent["about"], value: string) =>
    setContent((c) => (c ? { ...c, about: { ...c.about, [key]: value } } : c));

  const save = async () => {
    if (!content) return;
    setStatus({ kind: "saving", text: "Saving…" });
    try {
      const res = await fetch("/api/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      setStatus({
        kind: "saved",
        text: `Saved ${new Date().toLocaleTimeString()}`,
      });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : "Save failed",
      });
    }
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Site Content" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Site Content"
      subtitle="Edit the copy visitors see. Save applies changes to the live site."
    >
      <div className="admin-panel-header">
        <div className="admin-panel-heading">
          <h2>Content editor</h2>
          <p className="admin-panel-desc">
            Leave “notice” empty to hide the announcement banner on the home
            page.
          </p>
        </div>
        <button
          type="button"
          className="admin-save-btn"
          onClick={save}
          disabled={!content || status.kind === "saving"}
        >
          {status.kind === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>

      {status.kind !== "idle" ? (
        <p className={`admin-status admin-status--${status.kind}`}>
          {status.text}
        </p>
      ) : null}

      {!content ? (
        <div className="admin-card">
          <p>Loading content…</p>
        </div>
      ) : (
        <>
          {/* HERO */}
          <div className="admin-card">
            <h2>Hero — home page</h2>
            <div className="admin-fields">
              <Field label="Eyebrow">
                <input
                  className="admin-input"
                  value={content.hero.eyebrow}
                  onChange={(e) => setHero("eyebrow", e.target.value)}
                />
              </Field>
              <div className="admin-row-3">
                <Field label="Title">
                  <input
                    className="admin-input"
                    value={content.hero.title}
                    onChange={(e) => setHero("title", e.target.value)}
                  />
                </Field>
                <Field label="Title accent">
                  <input
                    className="admin-input"
                    value={content.hero.titleAccent}
                    onChange={(e) => setHero("titleAccent", e.target.value)}
                  />
                </Field>
                <Field label="Title end">
                  <input
                    className="admin-input"
                    value={content.hero.titleEnd}
                    onChange={(e) => setHero("titleEnd", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Subtitle">
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setHero("subtitle", e.target.value)}
                />
              </Field>
              <div className="admin-row-2">
                <Field label="Primary button text">
                  <input
                    className="admin-input"
                    value={content.hero.ctaPrimary}
                    onChange={(e) => setHero("ctaPrimary", e.target.value)}
                  />
                </Field>
                <Field label="Primary button link">
                  <input
                    className="admin-input"
                    value={content.hero.ctaPrimaryHref}
                    onChange={(e) => setHero("ctaPrimaryHref", e.target.value)}
                  />
                </Field>
                <Field label="Secondary button text">
                  <input
                    className="admin-input"
                    value={content.hero.ctaSecondary}
                    onChange={(e) => setHero("ctaSecondary", e.target.value)}
                  />
                </Field>
                <Field label="Secondary button link">
                  <input
                    className="admin-input"
                    value={content.hero.ctaSecondaryHref}
                    onChange={(e) => setHero("ctaSecondaryHref", e.target.value)}
                  />
                </Field>
              </div>
              <Field
                label="Hero image URL"
                hint="e.g. /img/ellis/home/hero.jpg"
              >
                <input
                  className="admin-input"
                  value={content.hero.image}
                  onChange={(e) => setHero("image", e.target.value)}
                />
              </Field>
              <Field label="Hero image alt text">
                <input
                  className="admin-input"
                  value={content.hero.imageAlt}
                  onChange={(e) => setHero("imageAlt", e.target.value)}
                />
              </Field>
              <Field label="Hero caption" hint="Optional — shown under the buttons">
                <input
                  className="admin-input"
                  value={content.hero.caption}
                  onChange={(e) => setHero("caption", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* NOTICE */}
          <div className="admin-card">
            <h2>Announcement banner</h2>
            <Field label="Notice text" hint="Empty hides the banner.">
              <textarea
                className="admin-textarea"
                rows={2}
                value={content.notice}
                onChange={(e) =>
                  setContent({ ...content, notice: e.target.value })
                }
              />
            </Field>
          </div>

          {/* FEATURES */}
          <ListShell
            title="Principles — about page"
            addLabel="+ Add principle"
            onAdd={() =>
              setContent({
                ...content,
                features: [...content.features, { ...BLANK_FEATURE }],
              })
            }
          >
            {content.features.map((f, i) => (
              <div key={i} className="admin-list-item">
                <Field label="Icon">
                  <input
                    className="admin-input"
                    value={f.icon}
                    onChange={(e) => {
                      const next = [...content.features];
                      next[i] = { ...next[i], icon: e.target.value };
                      setContent({ ...content, features: next });
                    }}
                  />
                </Field>
                <Field label="Title">
                  <input
                    className="admin-input"
                    value={f.title}
                    onChange={(e) => {
                      const next = [...content.features];
                      next[i] = { ...next[i], title: e.target.value };
                      setContent({ ...content, features: next });
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={f.description}
                    onChange={(e) => {
                      const next = [...content.features];
                      next[i] = { ...next[i], description: e.target.value };
                      setContent({ ...content, features: next });
                    }}
                  />
                </Field>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() =>
                    setContent({
                      ...content,
                      features: content.features.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            {content.features.length === 0 ? (
              <p className="admin-note">No principles yet.</p>
            ) : null}
          </ListShell>

          {/* SERVICES */}
          <ListShell
            title="Services — services page"
            addLabel="+ Add service"
            onAdd={() =>
              setContent({
                ...content,
                services: [...content.services, { ...BLANK_SERVICE }],
              })
            }
          >
            {content.services.map((s, i) => (
              <div key={i} className="admin-list-item">
                <Field label="Title">
                  <input
                    className="admin-input"
                    value={s.title}
                    onChange={(e) => {
                      const next = [...content.services];
                      next[i] = { ...next[i], title: e.target.value };
                      setContent({ ...content, services: next });
                    }}
                  />
                </Field>
                <Field
                  label="Description"
                  hint="First paragraph is the intro line. Prices live in the price table on the page."
                >
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={s.description}
                    onChange={(e) => {
                      const next = [...content.services];
                      next[i] = { ...next[i], description: e.target.value };
                      setContent({ ...content, services: next });
                    }}
                  />
                </Field>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() =>
                    setContent({
                      ...content,
                      services: content.services.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            {content.services.length === 0 ? (
              <p className="admin-note">No services yet.</p>
            ) : null}
          </ListShell>

          {/* ABOUT */}
          <div className="admin-card">
            <h2>About — contact info</h2>
            <div className="admin-fields">
              <Field
                label="Intro"
                hint="Separate paragraphs with a blank line."
              >
                <textarea
                  className="admin-textarea"
                  rows={5}
                  value={content.about.intro}
                  onChange={(e) => setAbout("intro", e.target.value)}
                />
              </Field>
              <Field
                label="Highlights (one per line)"
                hint="Shown as a list on the about page."
              >
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.highlights.join("\n")}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        highlights: e.target.value
                          .split("\n")
                          .map((h) => h.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                />
              </Field>
              <div className="admin-row-3">
                <Field label="Email">
                  <input
                    className="admin-input"
                    type="email"
                    value={content.about.email}
                    onChange={(e) => setAbout("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className="admin-input"
                    value={content.about.phone}
                    onChange={(e) => setAbout("phone", e.target.value)}
                  />
                </Field>
                <Field label="Service area">
                  <input
                    className="admin-input"
                    value={content.about.address}
                    onChange={(e) => setAbout("address", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Hours" hint="One entry per line: day | time">
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={content.about.hours
                    .map((h) => `${h.day} | ${h.time}`)
                    .join("\n")}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        hours: e.target.value
                          .split("\n")
                          .map((line) => {
                            const [day = "", time = ""] = line.split("|");
                            return {
                              day: day.trim(),
                              time: time.trim(),
                            };
                          })
                          .filter((h) => h.day),
                      },
                    })
                  }
                />
              </Field>
            </div>
          </div>

          {/* FAQ */}
          <ListShell
            title="FAQ"
            addLabel="+ Add question"
            onAdd={() =>
              setContent({
                ...content,
                faq: [...content.faq, { ...BLANK_FAQ }],
              })
            }
          >
            {content.faq.map((q, i) => (
              <div key={i} className="admin-list-item">
                <Field label="Question">
                  <input
                    className="admin-input"
                    value={q.question}
                    onChange={(e) => {
                      const next = [...content.faq];
                      next[i] = { ...next[i], question: e.target.value };
                      setContent({ ...content, faq: next });
                    }}
                  />
                </Field>
                <Field label="Answer">
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={q.answer}
                    onChange={(e) => {
                      const next = [...content.faq];
                      next[i] = { ...next[i], answer: e.target.value };
                      setContent({ ...content, faq: next });
                    }}
                  />
                </Field>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() =>
                    setContent({
                      ...content,
                      faq: content.faq.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            {content.faq.length === 0 ? (
              <p className="admin-note">No questions yet.</p>
            ) : null}
          </ListShell>

          {/* GALLERY */}
          <div className="admin-card">
            <div className="admin-list-head">
              <h2>Gallery image URLs</h2>
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() =>
                  setContent({
                    ...content,
                    gallery: [...content.gallery, ""],
                  })
                }
              >
                + Add image
              </button>
            </div>
            <div className="admin-list">
              {content.gallery.map((url, i) => (
                <div key={i} className="admin-list-item admin-list-item--row">
                  <input
                    className="admin-input"
                    value={url}
                    placeholder="/img/ellis/…"
                    onChange={(e) => {
                      const next = [...content.gallery];
                      next[i] = e.target.value;
                      setContent({ ...content, gallery: next });
                    }}
                  />
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() =>
                      setContent({
                        ...content,
                        gallery: content.gallery.filter((_, j) => j !== i),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              {content.gallery.length === 0 ? (
                <p className="admin-note">No gallery images yet.</p>
              ) : null}
            </div>
          </div>

          {/* MARQUEE */}
          <div className="admin-card">
            <div className="admin-list-head">
              <h2>Marquee phrases</h2>
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() =>
                  setContent({
                    ...content,
                    marquee: [...content.marquee, ""],
                  })
                }
              >
                + Add phrase
              </button>
            </div>
            <div className="admin-list">
              {content.marquee.map((phrase, i) => (
                <div key={i} className="admin-list-item admin-list-item--row">
                  <input
                    className="admin-input"
                    value={phrase}
                    onChange={(e) => {
                      const next = [...content.marquee];
                      next[i] = e.target.value;
                      setContent({ ...content, marquee: next });
                    }}
                  />
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() =>
                      setContent({
                        ...content,
                        marquee: content.marquee.filter((_, j) => j !== i),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              {content.marquee.length === 0 ? (
                <p className="admin-note">No marquee phrases yet.</p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="admin-save-btn"
            onClick={save}
            disabled={status.kind === "saving"}
          >
            {status.kind === "saving" ? "Saving…" : "Save changes"}
          </button>
        </>
      )}
    </AdminShell>
  );
};

export default AdminContent;
