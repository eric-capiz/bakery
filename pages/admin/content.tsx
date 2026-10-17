import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import AdminShell from '../../src/components/AdminShell';
import type {
  SiteContent,
  FeatureItem,
  ServiceItem,
  FaqItem,
} from '../../lib/content';

const FEATURE_EMOJIS = [
  '⚡', '💰', '🎨', '👨‍🍳', '⭐', '❤️', '🎂', '🍰', '🧁', '🍪',
  '🥧', '🍩', '🎁', '🎉', '✨', '🔥', '💎', '🏆', '🎯', '🚀',
  '💪', '🌟', '💫', '🎊', '🎈', '🎀', '🍓', '🍒', '🍇', '🍊',
  '🍋', '🍌', '🍉', '🍑', '🍍', '🥭', '🍎', '🍏', '🍐',
];

type Section =
  | 'hero'
  | 'features'
  | 'services'
  | 'about'
  | 'faq'
  | 'notice'
  | 'gallery'
  | 'marquee';

const SECTION_TABS: { id: Section; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Features' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'notice', label: 'Notice' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'marquee', label: 'Marquee' },
];

const blankFeature = (): FeatureItem => ({
  icon: '🎂',
  title: '',
  description: '',
});

const blankService = (): ServiceItem => ({ title: '', description: '' });

const blankFaq = (): FaqItem => ({ question: '', answer: '' });

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #dfb6bd',
  borderRadius: '8px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  color: '#3f3034',
  background: '#fffaf9',
} as const;

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  color: '#3f3034',
  fontWeight: '600',
} as const;

const cardStyle = {
  background: '#f4e8e5',
  padding: '2.5rem',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)',
  border: '2px solid #e8cfd3',
} as const;

const dangerBtnStyle = {
  padding: '0.75rem 1.5rem',
  background: '#6d5c60',
  color: '#f4e8e5',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
} as const;

const addBtnStyle = {
  padding: '0.75rem 1.5rem',
  background: '#b56f7c',
  color: '#f4e8e5',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
} as const;

/** Full CMS editor for the SiteContent schema. */
const AdminContent = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('hero');

  // Textarea drafts (one entry per line) synced on load/save.
  const [galleryText, setGalleryText] = useState('');
  const [marqueeText, setMarqueeText] = useState('');

  const [openEmojiPicker, setOpenEmojiPicker] = useState<number | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openEmojiPicker === null) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setOpenEmojiPicker(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenEmojiPicker(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openEmojiPicker]);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadContent();
        } else {
          router.push('/');
        }
      } catch {
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadContent = async () => {
    setError('');
    try {
      const response = await fetch('/api/content/get');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as SiteContent;
      setContent(data);
      setGalleryText((data.gallery ?? []).join('\n'));
      setMarqueeText((data.marquee ?? []).join('\n'));
    } catch (err) {
      console.error('Failed to load content:', err);
      setError('Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  const setHero = (patch: Partial<SiteContent['hero']>) =>
    setContent((c) => (c ? { ...c, hero: { ...c.hero, ...patch } } : c));

  const saveAll = async () => {
    if (!content || saving) return;
    setSaving(true);
    setError('');
    setSuccess('');

    // Fold the textarea drafts back into the arrays.
    const payload: SiteContent = {
      ...content,
      gallery: galleryText.split('\n').map((s) => s.trim()).filter(Boolean),
      marquee: marqueeText.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Save failed');
      }
      setContent(payload);
      setSuccess('Content saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Save content error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  const updateListItem = <T,>(
    list: T[],
    index: number,
    patch: Partial<T>
  ): T[] => {
    const next = [...list];
    next[index] = { ...next[index], ...patch };
    return next;
  };

  const removeListItem = <T,>(list: T[], index: number): T[] =>
    list.filter((_, i) => i !== index);

  if (!mounted || isChecking) {
    return <AdminShell title="Content Management" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const hero = content?.hero;

  return (
    <AdminShell
      title="Content Management"
      subtitle="Edit every text on the site in one place. Changes go live after saving."
    >
      <div className="admin-card">
        <div className="admin-panel-header" style={{ marginBottom: 0 }}>
          <div className="admin-panel-heading">
            <h2>Site Content</h2>
            <p className="admin-panel-desc">
              Pick a section below, edit, then save. Saving writes the complete
              site content at once.
            </p>
          </div>
          <button
            type="button"
            className="admin-save-btn"
            onClick={saveAll}
            disabled={saving || loading || !content}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">{error}</div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">{success}</div>
      )}

      <div
        className="admin-section-tabs"
        role="tablist"
        aria-label="Content sections"
      >
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeSection === tab.id}
            className={activeSection === tab.id ? 'is-active' : undefined}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#3f3034' }}>
          Loading content...
        </p>
      ) : !content || !hero ? (
        <p style={{ textAlign: 'center', color: '#3f3034' }}>
          Content is unavailable.
        </p>
      ) : (
        <>
          {activeSection === 'hero' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Hero Section</h2>
                  <p className="admin-panel-desc">
                    The headline block at the top of the home page.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(
                  [
                    ['eyebrow', 'Eyebrow (small line above the headline)'],
                    ['title', 'Headline — first part'],
                    ['titleAccent', 'Headline — accent word (italic)'],
                    ['titleEnd', 'Headline — end part'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="text"
                      value={hero[key]}
                      onChange={(e) => setHero({ [key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Subtitle</label>
                  <textarea
                    value={hero.subtitle}
                    onChange={(e) => setHero({ subtitle: e.target.value })}
                    rows={3}
                    style={inputStyle}
                  />
                </div>
                {(
                  [
                    ['ctaPrimary', 'Primary button label'],
                    ['ctaPrimaryHref', 'Primary button link'],
                    ['ctaSecondary', 'Secondary button label'],
                    ['ctaSecondaryHref', 'Secondary button link'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="text"
                      value={hero[key]}
                      onChange={(e) => setHero({ [key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Hero image URL</label>
                  <input
                    type="text"
                    value={hero.image}
                    onChange={(e) => setHero({ image: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Hero image alt text</label>
                  <input
                    type="text"
                    value={hero.imageAlt}
                    onChange={(e) => setHero({ imageAlt: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Caption under hero image</label>
                  <input
                    type="text"
                    value={hero.caption}
                    onChange={(e) => setHero({ caption: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Features</h2>
                  <p className="admin-panel-desc">
                    The &quot;Why choose us&quot; list on the home page and the
                    cards on the about page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={() =>
                    setContent((c) =>
                      c ? { ...c, features: [...c.features, blankFeature()] } : c
                    )
                  }
                >
                  Add Feature
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {content.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1.5rem',
                      background: '#e9d6d2',
                      borderRadius: '12px',
                      border: '2px solid #e8cfd3',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <h3 style={{ color: '#3f3034', margin: 0 }}>
                        Feature {index + 1}
                      </h3>
                      <button
                        type="button"
                        style={dangerBtnStyle}
                        onClick={() => {
                          if (confirm(`Delete "${feature.title || 'this feature'}"?`)) {
                            setContent((c) =>
                              c
                                ? { ...c, features: removeListItem(c.features, index) }
                                : c
                            );
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Icon (emoji)</label>
                        <div
                          className="admin-emoji-select"
                          ref={openEmojiPicker === index ? emojiPickerRef : undefined}
                        >
                          <button
                            type="button"
                            className={`admin-emoji-trigger${
                              openEmojiPicker === index ? ' is-open' : ''
                            }`}
                            onClick={() =>
                              setOpenEmojiPicker(
                                openEmojiPicker === index ? null : index
                              )
                            }
                            aria-expanded={openEmojiPicker === index}
                            aria-haspopup="listbox"
                          >
                            <span className="admin-emoji-preview" aria-hidden="true">
                              {feature.icon || '🎂'}
                            </span>
                            <span className="admin-emoji-trigger-copy">
                              <span className="admin-emoji-trigger-label">
                                {feature.icon ? 'Change icon' : 'Choose icon'}
                              </span>
                              <span className="admin-emoji-trigger-value">
                                {feature.icon || 'None selected'}
                              </span>
                            </span>
                            <span className="admin-emoji-chevron" aria-hidden="true" />
                          </button>
                          {openEmojiPicker === index && (
                            <div className="admin-emoji-menu" role="listbox" aria-label="Feature icons">
                              <div className="admin-emoji-picker">
                                {FEATURE_EMOJIS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    role="option"
                                    className={`admin-emoji-btn${
                                      feature.icon === emoji ? ' is-selected' : ''
                                    }`}
                                    aria-selected={feature.icon === emoji}
                                    aria-label={`Select ${emoji}`}
                                    onClick={() => {
                                      setContent((c) =>
                                        c
                                          ? {
                                              ...c,
                                              features: updateListItem(c.features, index, {
                                                icon: emoji,
                                              }),
                                            }
                                          : c
                                      );
                                      setOpenEmojiPicker(null);
                                    }}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                value={feature.icon}
                                onChange={(e) =>
                                  setContent((c) =>
                                    c
                                      ? {
                                          ...c,
                                          features: updateListItem(c.features, index, {
                                            icon: e.target.value,
                                          }),
                                        }
                                      : c
                                  )
                                }
                                placeholder="Or type a custom emoji"
                                className="admin-emoji-custom"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    features: updateListItem(c.features, index, {
                                      title: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    features: updateListItem(c.features, index, {
                                      description: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          rows={3}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Services</h2>
                  <p className="admin-panel-desc">
                    The &quot;Made for the moment&quot; specialty cards on the
                    home page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={() =>
                    setContent((c) =>
                      c ? { ...c, services: [...c.services, blankService()] } : c
                    )
                  }
                >
                  Add Service
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {content.services.map((service, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1.5rem',
                      background: '#e9d6d2',
                      borderRadius: '12px',
                      border: '2px solid #e8cfd3',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <h3 style={{ color: '#3f3034', margin: 0 }}>
                        Service {index + 1}
                      </h3>
                      <button
                        type="button"
                        style={dangerBtnStyle}
                        onClick={() => {
                          if (confirm(`Delete "${service.title || 'this service'}"?`)) {
                            setContent((c) =>
                              c
                                ? { ...c, services: removeListItem(c.services, index) }
                                : c
                            );
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    services: updateListItem(c.services, index, {
                                      title: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    services: updateListItem(c.services, index, {
                                      description: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          rows={3}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={cardStyle}>
                <div className="admin-panel-header">
                  <div className="admin-panel-heading">
                    <h2>About the Baker</h2>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Introduction</label>
                    <textarea
                      value={content.about.intro}
                      onChange={(e) =>
                        setContent((c) =>
                          c ? { ...c, about: { ...c.about, intro: e.target.value } } : c
                        )
                      }
                      rows={5}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Highlights (what I bake)</label>
                    <p className="admin-panel-desc" style={{ marginBottom: '0.75rem' }}>
                      One highlight per line.
                    </p>
                    <textarea
                      value={content.about.highlights.join('\n')}
                      onChange={(e) =>
                        setContent((c) =>
                          c
                            ? {
                                ...c,
                                about: {
                                  ...c.about,
                                  highlights: e.target.value
                                    .split('\n')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                },
                              }
                            : c
                        )
                      }
                      rows={Math.max(4, content.about.highlights.length + 1)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <div className="admin-panel-header">
                  <div className="admin-panel-heading">
                    <h2>Contact Details</h2>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={content.about.email}
                      onChange={(e) =>
                        setContent((c) =>
                          c ? { ...c, about: { ...c.about, email: e.target.value } } : c
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      type="tel"
                      value={content.about.phone}
                      onChange={(e) =>
                        setContent((c) =>
                          c ? { ...c, about: { ...c.about, phone: e.target.value } } : c
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Address / location</label>
                    <input
                      type="text"
                      value={content.about.address}
                      onChange={(e) =>
                        setContent((c) =>
                          c
                            ? { ...c, about: { ...c.about, address: e.target.value } }
                            : c
                        )
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <div className="admin-panel-header">
                  <div className="admin-panel-heading">
                    <h2>Working Hours</h2>
                  </div>
                  <button
                    type="button"
                    className="admin-save-btn"
                    onClick={() =>
                      setContent((c) =>
                        c
                          ? {
                              ...c,
                              about: {
                                ...c.about,
                                hours: [...c.about.hours, { day: '', time: '' }],
                              },
                            }
                          : c
                      )
                    }
                  >
                    Add Day
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {content.about.hours.map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: '#e9d6d2',
                        borderRadius: '12px',
                        border: '2px solid #e8cfd3',
                      }}
                      className="admin-hours-row"
                    >
                      <input
                        type="text"
                        aria-label="Day"
                        placeholder="Day"
                        value={entry.day}
                        onChange={(e) =>
                          setContent((c) =>
                            c
                              ? {
                                  ...c,
                                  about: {
                                    ...c.about,
                                    hours: updateListItem(c.about.hours, index, {
                                      day: e.target.value,
                                    }),
                                  },
                                }
                              : c
                          )
                        }
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        aria-label="Time"
                        placeholder="Time"
                        value={entry.time}
                        onChange={(e) =>
                          setContent((c) =>
                            c
                              ? {
                                  ...c,
                                  about: {
                                    ...c.about,
                                    hours: updateListItem(c.about.hours, index, {
                                      time: e.target.value,
                                    }),
                                  },
                                }
                              : c
                          )
                        }
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        style={dangerBtnStyle}
                        onClick={() => {
                          if (confirm(`Delete "${entry.day || 'this row'}"?`)) {
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    about: {
                                      ...c.about,
                                      hours: removeListItem(c.about.hours, index),
                                    },
                                  }
                                : c
                            );
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>FAQ</h2>
                  <p className="admin-panel-desc">
                    Questions and answers on the about page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={() =>
                    setContent((c) =>
                      c ? { ...c, faq: [...c.faq, blankFaq()] } : c
                    )
                  }
                >
                  Add Question
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {content.faq.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1.5rem',
                      background: '#e9d6d2',
                      borderRadius: '12px',
                      border: '2px solid #e8cfd3',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <h3 style={{ color: '#3f3034', margin: 0 }}>
                        Question {index + 1}
                      </h3>
                      <button
                        type="button"
                        style={dangerBtnStyle}
                        onClick={() => {
                          if (confirm('Delete this question?')) {
                            setContent((c) =>
                              c ? { ...c, faq: removeListItem(c.faq, index) } : c
                            );
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      <div>
                        <label style={labelStyle}>Question</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    faq: updateListItem(c.faq, index, {
                                      question: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Answer</label>
                        <textarea
                          value={item.answer}
                          onChange={(e) =>
                            setContent((c) =>
                              c
                                ? {
                                    ...c,
                                    faq: updateListItem(c.faq, index, {
                                      answer: e.target.value,
                                    }),
                                  }
                                : c
                            )
                          }
                          rows={3}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notice' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Announcement Banner</h2>
                  <p className="admin-panel-desc">
                    Shows a banner at the top of the home page. Leave empty to
                    hide it.
                  </p>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notice text</label>
                <textarea
                  value={content.notice}
                  onChange={(e) =>
                    setContent((c) => (c ? { ...c, notice: e.target.value } : c))
                  }
                  rows={4}
                  placeholder="e.g. Now booking wedding cakes for spring — get in touch early!"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {activeSection === 'gallery' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Gallery</h2>
                  <p className="admin-panel-desc">
                    Home page gallery — one image URL per line. The first URL
                    is the featured image.
                  </p>
                </div>
              </div>
              <textarea
                aria-label="Gallery image URLs, one per line"
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                rows={8}
                style={inputStyle}
              />
            </div>
          )}

          {activeSection === 'marquee' && (
            <div style={cardStyle}>
              <div className="admin-panel-header">
                <div className="admin-panel-heading">
                  <h2>Marquee</h2>
                  <p className="admin-panel-desc">
                    The scrolling word strip on the home page — one phrase per
                    line.
                  </p>
                </div>
              </div>
              <textarea
                aria-label="Marquee phrases, one per line"
                value={marqueeText}
                onChange={(e) => setMarqueeText(e.target.value)}
                rows={10}
                style={inputStyle}
              />
            </div>
          )}

          <div className="admin-card" style={{ marginTop: '2rem' }}>
            <div className="admin-panel-header" style={{ marginBottom: 0 }}>
              <div className="admin-panel-heading">
                <p className="admin-panel-desc">
                  Saving writes the complete site content. Edits are not live
                  until saved.
                </p>
              </div>
              <button
                type="button"
                className="admin-save-btn"
                onClick={saveAll}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
};

export default AdminContent;
