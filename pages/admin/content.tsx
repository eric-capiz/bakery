import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import AdminShell from '../../src/components/AdminShell';

const FEATURE_EMOJIS = [
  '🌿', '💐', '🌸', '🌷', '🌹', '🌺', '🌻', '🌼', '🍃', '🪴',
  '✨', '💫', '⭐', '💎', '🎁', '🎉', '🎀', '🤍', '💚', '🕊️',
  '⚡', '🎨', '🏆', '🎯', '🌟', '🎊', '🎈', '🌾', '🌱',
  '🍀', '🪻', '🌳', '🌲', '🌴', '🌵', '🍋', '🍊', '🍑',
];

interface ContentData {
  home: {
    hero: {
      tagline: string;
      taglineAccent: string;
      taglineEnd: string;
      subtitle: string;
    };
    features: Array<{ icon: string; title: string; description: string }>;
    specialties: Array<{ title: string; description: string }>;
  };
  about: {
    baker: {
      intro: string;
      experience: {
        main: string;
        education: string;
        specialization: string;
        years: string;
        certifications: string;
      };
      whatIBake: string[];
      hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
      };
      contact: {
        email: string;
        phone: string;
      };
    };
    faq: Array<{ question: string; answer: string }>;
  };
}

const AdminContent = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<'home' | 'about'>('home');
  
  // Local state for editing (not saved until button clicked)
  const [heroData, setHeroData] = useState<ContentData['home']['hero'] | null>(null);
  const [featuresData, setFeaturesData] = useState<ContentData['home']['features'] | null>(null);
  const [specialtiesData, setSpecialtiesData] = useState<ContentData['home']['specialties'] | null>(null);
  const [bakerIntro, setBakerIntro] = useState<string>('');
  const [experienceData, setExperienceData] = useState<ContentData['about']['baker']['experience'] | null>(null);
  const [hoursData, setHoursData] = useState<ContentData['about']['baker']['hours'] | null>(null);
  const [contactData, setContactData] = useState<ContentData['about']['baker']['contact'] | null>(null);
  const [whatIBakeData, setWhatIBakeData] = useState<string[]>([]);
  const [faqData, setFaqData] = useState<ContentData['about']['faq']>([]);
  const [openEmojiPicker, setOpenEmojiPicker] = useState<number | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  
  const [saving, setSaving] = useState<string | null>(null);

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
      } catch (err) {
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/content/get');
      const data = await response.json();
      setContent(data);
      // Initialize local editing state
      if (data.home) {
        setHeroData({ ...data.home.hero });
        setFeaturesData([...data.home.features]);
        setSpecialtiesData([...data.home.specialties]);
      }
      if (data.about?.baker) {
        setBakerIntro(data.about.baker.intro);
        setExperienceData({ ...data.about.baker.experience });
        setHoursData({ ...data.about.baker.hours });
        setContactData({ ...data.about.baker.contact });
        setWhatIBakeData([...data.about.baker.whatIBake]);
      }
      if (data.about?.faq) {
        setFaqData([...data.about.faq]);
      }
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (
    section: string, 
    path: string, 
    value: string | number | boolean | string[]
  ) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, path, value }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Content updated successfully!');
        loadContent();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update content');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const updateArrayItem = async (
    section: string,
    path: string,
    action: 'add' | 'update' | 'delete',
    index?: number,
    item?: Record<string, unknown> | string,
    maxItems?: number
  ) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/content/update-array', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, path, action, index, item, maxItems }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Content updated successfully!');
        loadContent();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update content');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const saveHero = async () => {
    if (!heroData) return;
    setSaving('hero');
    try {
      await updateContent('home', 'hero.tagline', heroData.tagline);
      await updateContent('home', 'hero.taglineAccent', heroData.taglineAccent);
      await updateContent('home', 'hero.taglineEnd', heroData.taglineEnd);
      await updateContent('home', 'hero.subtitle', heroData.subtitle);
      setSuccess('Hero section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save hero section');
    } finally {
      setSaving(null);
    }
  };

  const saveFeatures = async () => {
    if (!featuresData) return;
    setSaving('features');
    try {
      for (let i = 0; i < featuresData.length; i++) {
        await updateArrayItem('home', 'features', 'update', i, featuresData[i]);
      }
      setSuccess('Features section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save features section');
    } finally {
      setSaving(null);
    }
  };

  const saveSpecialties = async () => {
    if (!specialtiesData) return;
    setSaving('specialties');
    try {
      for (let i = 0; i < specialtiesData.length; i++) {
        await updateArrayItem('home', 'specialties', 'update', i, specialtiesData[i]);
      }
      setSuccess('Specialties section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save specialties section');
    } finally {
      setSaving(null);
    }
  };

  const saveBakerIntro = async () => {
    setSaving('baker-intro');
    try {
      await updateContent('about', 'baker.intro', bakerIntro);
      setSuccess('Florist intro saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save florist intro');
    } finally {
      setSaving(null);
    }
  };

  const saveExperience = async () => {
    if (!experienceData) return;
    setSaving('experience');
    try {
      await updateContent('about', 'baker.experience.main', experienceData.main);
      await updateContent('about', 'baker.experience.education', experienceData.education);
      await updateContent('about', 'baker.experience.specialization', experienceData.specialization);
      await updateContent('about', 'baker.experience.years', experienceData.years);
      await updateContent('about', 'baker.experience.certifications', experienceData.certifications);
      setSuccess('Experience section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save experience section');
    } finally {
      setSaving(null);
    }
  };

  const saveHoursAndContact = async () => {
    if (!hoursData || !contactData) return;
    setSaving('hours-contact');
    try {
      await updateContent('about', 'baker.hours.monday', hoursData.monday);
      await updateContent('about', 'baker.hours.tuesday', hoursData.tuesday);
      await updateContent('about', 'baker.hours.wednesday', hoursData.wednesday);
      await updateContent('about', 'baker.hours.thursday', hoursData.thursday);
      await updateContent('about', 'baker.hours.friday', hoursData.friday);
      await updateContent('about', 'baker.hours.saturday', hoursData.saturday);
      await updateContent('about', 'baker.hours.sunday', hoursData.sunday);
      await updateContent('about', 'baker.contact.email', contactData.email);
      await updateContent('about', 'baker.contact.phone', contactData.phone);
      setSuccess('Hours & Contact saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save hours & contact');
    } finally {
      setSaving(null);
    }
  };

  const saveWhatIBake = async () => {
    setSaving('what-i-bake');
    try {
      // Replace entire array by deleting all and adding back
      const current = content?.about.baker.whatIBake || [];
      // Delete all existing
      for (let i = current.length - 1; i >= 0; i--) {
        await updateArrayItem('about', 'baker.whatIBake', 'delete', i);
      }
      // Add all new
      for (const item of whatIBakeData) {
        await updateArrayItem('about', 'baker.whatIBake', 'add', undefined, item, 20);
      }
      setSuccess('What I Create section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save What I Create section');
    } finally {
      setSaving(null);
    }
  };

  const saveFAQ = async () => {
    setSaving('faq');
    try {
      // Replace entire array
      const current = content?.about.faq || [];
      // Delete all existing
      for (let i = current.length - 1; i >= 0; i--) {
        await updateArrayItem('about', 'faq', 'delete', i);
      }
      // Add all new
      for (const item of faqData) {
        await updateArrayItem('about', 'faq', 'add', undefined, item, 10);
      }
      setSuccess('FAQ section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save FAQ section');
    } finally {
      setSaving(null);
    }
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Content Management" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Content Management"
      subtitle="Edit Brume home and practice page copy in one place."
    >

        {/* Section Tabs */}
        <div className="admin-section-tabs" role="tablist" aria-label="Content sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'home'}
            className={activeSection === 'home' ? 'is-active' : undefined}
            onClick={() => setActiveSection('home')}
          >
            Home Page
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'about'}
            className={activeSection === 'about' ? 'is-active' : undefined}
            onClick={() => setActiveSection('about')}
          >
            About Page
          </button>
        </div>

        {error && (
          <div style={{ background: '#e8cfd3', color: '#6d5c60', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #dfb6bd', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #81C784', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#3f3034' }}>Loading content...</p>
        ) : content && heroData && featuresData && specialtiesData && experienceData && hoursData && contactData && (
          <>
            {activeSection === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Hero Section */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Hero Section</h2>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveHero}
                      disabled={saving === 'hero'}
                    >
                      {saving === 'hero' ? 'Saving...' : 'Save Hero'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Tagline (First Part)
                      </label>
                      <input
                        type="text"
                        value={heroData.tagline}
                        onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Tagline (Accent Word)
                      </label>
                      <input
                        type="text"
                        value={heroData.taglineAccent}
                        onChange={(e) => setHeroData({ ...heroData, taglineAccent: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Tagline (End Part)
                      </label>
                      <input
                        type="text"
                        value={heroData.taglineEnd}
                        onChange={(e) => setHeroData({ ...heroData, taglineEnd: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={heroData.subtitle}
                        onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Features Section</h2>
                      <p className="admin-panel-desc">
                        Updates the approach / features section on the Home page.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveFeatures}
                      disabled={saving === 'features'}
                    >
                      {saving === 'features' ? 'Saving...' : 'Save Features'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {featuresData.map((feature, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#e9d6d2', borderRadius: '12px', border: '2px solid #e8cfd3' }}>
                        <h3 style={{ color: '#3f3034', marginBottom: '1rem' }}>Feature {index + 1}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Icon (emoji)
                            </label>
                            <div
                              className="admin-emoji-select"
                              ref={openEmojiPicker === index ? emojiPickerRef : undefined}
                            >
                              <button
                                type="button"
                                className={`admin-emoji-trigger${openEmojiPicker === index ? ' is-open' : ''}`}
                                onClick={() =>
                                  setOpenEmojiPicker(openEmojiPicker === index ? null : index)
                                }
                                aria-expanded={openEmojiPicker === index}
                                aria-haspopup="listbox"
                              >
                                <span className="admin-emoji-preview" aria-hidden="true">
                                  {feature.icon || '🌿'}
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
                                        className={`admin-emoji-btn${feature.icon === emoji ? ' is-selected' : ''}`}
                                        aria-selected={feature.icon === emoji}
                                        aria-label={`Select ${emoji}`}
                                        onClick={() => {
                                          const updated = [...featuresData];
                                          updated[index].icon = emoji;
                                          setFeaturesData(updated);
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
                                    onChange={(e) => {
                                      const updated = [...featuresData];
                                      updated[index].icon = e.target.value;
                                      setFeaturesData(updated);
                                    }}
                                    placeholder="Or type a custom emoji"
                                    className="admin-emoji-custom"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Title
                            </label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const updated = [...featuresData];
                                updated[index].title = e.target.value;
                                setFeaturesData(updated);
                              }}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Description
                            </label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => {
                                const updated = [...featuresData];
                                updated[index].description = e.target.value;
                                setFeaturesData(updated);
                              }}
                              rows={3}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties Section */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Specialties Section</h2>
                      <p className="admin-panel-desc">
                        Floral specialties shown on the Home page (weddings, seasonal bouquets, installations, and more).
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveSpecialties}
                      disabled={saving === 'specialties'}
                    >
                      {saving === 'specialties' ? 'Saving...' : 'Save Specialties'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {specialtiesData.map((specialty, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#e9d6d2', borderRadius: '12px', border: '2px solid #e8cfd3' }}>
                        <h3 style={{ color: '#3f3034', marginBottom: '1rem' }}>Specialty {index + 1}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Title
                            </label>
                            <input
                              type="text"
                              value={specialty.title}
                              onChange={(e) => {
                                const updated = [...specialtiesData];
                                updated[index].title = e.target.value;
                                setSpecialtiesData(updated);
                              }}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Description
                            </label>
                            <textarea
                              value={specialty.description}
                              onChange={(e) => {
                                const updated = [...specialtiesData];
                                updated[index].description = e.target.value;
                                setSpecialtiesData(updated);
                              }}
                              rows={3}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Meet the Florist (CMS key: baker) */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Meet the Florist</h2>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveBakerIntro}
                      disabled={saving === 'baker-intro'}
                    >
                      {saving === 'baker-intro' ? 'Saving...' : 'Save Intro'}
                    </button>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                      Introduction Paragraph
                    </label>
                    <textarea
                      value={bakerIntro}
                      onChange={(e) => setBakerIntro(e.target.value)}
                      rows={5}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Experience & Education */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Experience & Education</h2>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveExperience}
                      disabled={saving === 'experience'}
                    >
                      {saving === 'experience' ? 'Saving...' : 'Save Experience'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Main Experience Text
                      </label>
                      <textarea
                        value={experienceData.main}
                        onChange={(e) => setExperienceData({ ...experienceData, main: e.target.value })}
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Education
                      </label>
                      <input
                        type="text"
                        value={experienceData.education}
                        onChange={(e) => setExperienceData({ ...experienceData, education: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={experienceData.specialization}
                        onChange={(e) => setExperienceData({ ...experienceData, specialization: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={experienceData.years}
                        onChange={(e) => setExperienceData({ ...experienceData, years: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Certifications
                      </label>
                      <input
                        type="text"
                        value={experienceData.certifications}
                        onChange={(e) => setExperienceData({ ...experienceData, certifications: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* What I Create (CMS key: whatIBake) */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>What I Create</h2>
                      <p className="admin-panel-desc">
                        Arrangement and service tags (maximum 20). Add floral specialties such as bridal bouquets or event installations. Click &quot;Save Items&quot; to save changes.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveWhatIBake}
                      disabled={saving === 'what-i-bake'}
                    >
                      {saving === 'what-i-bake' ? 'Saving...' : 'Save Items'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {whatIBakeData.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#e9d6d2', borderRadius: '8px' }}>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...whatIBakeData];
                            updated[index] = e.target.value;
                            setWhatIBakeData(updated);
                          }}
                          style={{ flex: 1, padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                        />
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item}"?`)) {
                              const updated = whatIBakeData.filter((_, i) => i !== index);
                              setWhatIBakeData(updated);
                            }
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#6d5c60',
                            color: '#f4e8e5',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {whatIBakeData.length < 20 && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input
                        type="text"
                        id="new-bake-item"
                        placeholder="Enter arrangement or service name"
                        style={{ flex: 1, padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.currentTarget;
                            if (input.value.trim() && whatIBakeData.length < 20) {
                              setWhatIBakeData([...whatIBakeData, input.value.trim()]);
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('new-bake-item') as HTMLInputElement;
                          if (input && input.value.trim() && whatIBakeData.length < 20) {
                            setWhatIBakeData([...whatIBakeData, input.value.trim()]);
                            input.value = '';
                          }
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#b56f7c',
                          color: '#f4e8e5',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        Add Item
                      </button>
                    </div>
                  )}
                </div>

                {/* Working Hours & Contact */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>Working Hours & Contact</h2>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveHoursAndContact}
                      disabled={saving === 'hours-contact'}
                    >
                      {saving === 'hours-contact' ? 'Saving...' : 'Save Hours & Contact'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600', textTransform: 'capitalize' }}>
                          {day}
                        </label>
                        <input
                          type="text"
                          value={hoursData[day as keyof typeof hoursData]}
                          onChange={(e) => setHoursData({ ...hoursData, [day]: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
                  <div className="admin-panel-header">
                    <div className="admin-panel-heading">
                      <h2>FAQ Section</h2>
                      <p className="admin-panel-desc">
                        Maximum 10 questions allowed. You can add, edit, or delete questions. Click &quot;Save FAQ&quot; to save changes.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-save-btn"
                      onClick={saveFAQ}
                      disabled={saving === 'faq'}
                    >
                      {saving === 'faq' ? 'Saving...' : 'Save FAQ'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {faqData.map((faq, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#e9d6d2', borderRadius: '12px', border: '2px solid #e8cfd3' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const updated = [...faqData];
                                updated[index].question = e.target.value;
                                setFaqData(updated);
                              }}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                              Answer
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => {
                                const updated = [...faqData];
                                updated[index].answer = e.target.value;
                                setFaqData(updated);
                              }}
                              rows={3}
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Delete this FAQ question?`)) {
                              const updated = faqData.filter((_, i) => i !== index);
                              setFaqData(updated);
                            }
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#6d5c60',
                            color: '#f4e8e5',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          Delete Question
                        </button>
                      </div>
                    ))}
                  </div>

                  {faqData.length < 10 && (
                    <div style={{ padding: '1.5rem', background: '#e9d6d2', borderRadius: '12px', border: '2px dashed #dfb6bd' }}>
                      <h3 style={{ color: '#3f3034', marginBottom: '1rem' }}>Add New FAQ</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                            Question
                          </label>
                          <input
                            type="text"
                            id="new-faq-question"
                            placeholder="Enter question"
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3f3034', fontWeight: '600' }}>
                            Answer
                          </label>
                          <textarea
                            id="new-faq-answer"
                            placeholder="Enter answer"
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #dfb6bd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const questionInput = document.getElementById('new-faq-question') as HTMLInputElement;
                            const answerInput = document.getElementById('new-faq-answer') as HTMLTextAreaElement;
                            if (questionInput && answerInput && questionInput.value.trim() && answerInput.value.trim() && faqData.length < 10) {
                              setFaqData([...faqData, {
                                question: questionInput.value.trim(),
                                answer: answerInput.value.trim(),
                              }]);
                              questionInput.value = '';
                              answerInput.value = '';
                            }
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#b56f7c',
                            color: '#f4e8e5',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          Add FAQ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

    </AdminShell>
  );
};

export default AdminContent;
