import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  
  const [saving, setSaving] = useState<string | null>(null);

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
      setSuccess('Baker intro saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save baker intro');
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
      setSuccess('What I Bake section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save What I Bake section');
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
    return (
      <div style={{ marginTop: '80px', padding: '4rem 2rem', minHeight: '90vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8B4A3A', fontSize: '1.2rem' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-panel" style={{ marginTop: '80px', padding: '4rem 2rem', minHeight: '90vh', background: '#FFF8F0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#8B4A3A', marginBottom: '1rem', textAlign: 'center' }}>
          Content Management
        </h1>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSection('home')}
            style={{
              padding: '0.75rem 2rem',
              background: activeSection === 'home' ? '#E8A87C' : '#FFFFFF',
              color: activeSection === 'home' ? '#FFFFFF' : '#8B4A3A',
              border: '2px solid #E8A87C',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Home Page
          </button>
          <button
            onClick={() => setActiveSection('about')}
            style={{
              padding: '0.75rem 2rem',
              background: activeSection === 'about' ? '#E8A87C' : '#FFFFFF',
              color: activeSection === 'about' ? '#FFFFFF' : '#8B4A3A',
              border: '2px solid #E8A87C',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            About Page
          </button>
        </div>

        {error && (
          <div style={{ background: '#FFE5D9', color: '#A85C4A', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #FFB89A', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #81C784', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#8B4A3A' }}>Loading content...</p>
        ) : content && heroData && featuresData && specialtiesData && experienceData && hoursData && contactData && (
          <>
            {activeSection === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Hero Section */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Hero Section
                    </h2>
                    <button
                      onClick={saveHero}
                      disabled={saving === 'hero'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'hero' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'hero' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'hero' ? 'Saving...' : 'Save Hero'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Tagline (First Part)
                      </label>
                      <input
                        type="text"
                        value={heroData.tagline}
                        onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Tagline (Accent Word)
                      </label>
                      <input
                        type="text"
                        value={heroData.taglineAccent}
                        onChange={(e) => setHeroData({ ...heroData, taglineAccent: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Tagline (End Part)
                      </label>
                      <input
                        type="text"
                        value={heroData.taglineEnd}
                        onChange={(e) => setHeroData({ ...heroData, taglineEnd: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={heroData.subtitle}
                        onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Features Section
                    </h2>
                    <button
                      onClick={saveFeatures}
                      disabled={saving === 'features'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'features' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'features' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'features' ? 'Saving...' : 'Save Features'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {featuresData.map((feature, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#FFF8F0', borderRadius: '12px', border: '2px solid #FFE5D9' }}>
                        <h3 style={{ color: '#8B4A3A', marginBottom: '1rem' }}>Feature {index + 1}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                              Icon (emoji)
                            </label>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(8, 1fr)', 
                                gap: '0.5rem',
                                padding: '0.75rem',
                                background: '#FFF8F0',
                                borderRadius: '8px',
                                border: '2px solid #FFE5D9',
                                marginBottom: '0.5rem'
                              }}>
                                {['⚡', '💰', '🎨', '👨‍🍳', '⭐', '❤️', '🎂', '🍰', '🧁', '🍪', '🥧', '🍩', '🎁', '🎉', '✨', '🔥', '💎', '🏆', '🎯', '🚀', '💪', '🌟', '💫', '🎊', '🎈', '🎀', '🍓', '🍒', '🍇', '🍊', '🍋', '🍌', '🍉', '🍑', '🍍', '🥭', '🍎', '🍏', '🍐', '🍊'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...featuresData];
                                      updated[index].icon = emoji;
                                      setFeaturesData(updated);
                                    }}
                                    style={{
                                      background: feature.icon === emoji ? '#E8A87C' : '#FFFFFF',
                                      border: `2px solid ${feature.icon === emoji ? '#E8A87C' : '#FFB89A'}`,
                                      borderRadius: '6px',
                                      padding: '0.5rem',
                                      fontSize: '1.5rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    onMouseOver={(e) => {
                                      if (feature.icon !== emoji) {
                                        e.currentTarget.style.background = '#FFE5D9';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                      }
                                    }}
                                    onMouseOut={(e) => {
                                      if (feature.icon !== emoji) {
                                        e.currentTarget.style.background = '#FFFFFF';
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }
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
                                placeholder="Or type custom emoji"
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties Section */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Specialties Section
                    </h2>
                    <button
                      onClick={saveSpecialties}
                      disabled={saving === 'specialties'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'specialties' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'specialties' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'specialties' ? 'Saving...' : 'Save Specialties'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {specialtiesData.map((specialty, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#FFF8F0', borderRadius: '12px', border: '2px solid #FFE5D9' }}>
                        <h3 style={{ color: '#8B4A3A', marginBottom: '1rem' }}>Specialty {index + 1}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
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
                {/* Meet the Baker */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Meet the Baker
                    </h2>
                    <button
                      onClick={saveBakerIntro}
                      disabled={saving === 'baker-intro'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'baker-intro' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'baker-intro' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'baker-intro' ? 'Saving...' : 'Save Intro'}
                    </button>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                      Introduction Paragraph
                    </label>
                    <textarea
                      value={bakerIntro}
                      onChange={(e) => setBakerIntro(e.target.value)}
                      rows={5}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Experience & Education */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Experience & Education
                    </h2>
                    <button
                      onClick={saveExperience}
                      disabled={saving === 'experience'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'experience' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'experience' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'experience' ? 'Saving...' : 'Save Experience'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Main Experience Text
                      </label>
                      <textarea
                        value={experienceData.main}
                        onChange={(e) => setExperienceData({ ...experienceData, main: e.target.value })}
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Education
                      </label>
                      <input
                        type="text"
                        value={experienceData.education}
                        onChange={(e) => setExperienceData({ ...experienceData, education: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={experienceData.specialization}
                        onChange={(e) => setExperienceData({ ...experienceData, specialization: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={experienceData.years}
                        onChange={(e) => setExperienceData({ ...experienceData, years: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Certifications
                      </label>
                      <input
                        type="text"
                        value={experienceData.certifications}
                        onChange={(e) => setExperienceData({ ...experienceData, certifications: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* What I Bake */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      What I Bake
                    </h2>
                    <button
                      onClick={saveWhatIBake}
                      disabled={saving === 'what-i-bake'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'what-i-bake' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'what-i-bake' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'what-i-bake' ? 'Saving...' : 'Save Items'}
                    </button>
                  </div>
                  <p style={{ color: '#A85C4A', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Maximum 20 items allowed. You can add, edit, or delete items. Click "Save Items" to save changes.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {whatIBakeData.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#FFF8F0', borderRadius: '8px' }}>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...whatIBakeData];
                            updated[index] = e.target.value;
                            setWhatIBakeData(updated);
                          }}
                          style={{ flex: 1, padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
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
                            background: '#A85C4A',
                            color: '#FFFFFF',
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
                        placeholder="Enter new item name"
                        style={{ flex: 1, padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
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
                          background: '#E8A87C',
                          color: '#FFFFFF',
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
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      Working Hours & Contact
                    </h2>
                    <button
                      onClick={saveHoursAndContact}
                      disabled={saving === 'hours-contact'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'hours-contact' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'hours-contact' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'hours-contact' ? 'Saving...' : 'Save Hours & Contact'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600', textTransform: 'capitalize' }}>
                          {day}
                        </label>
                        <input
                          type="text"
                          value={hoursData[day as keyof typeof hoursData]}
                          onChange={(e) => setHoursData({ ...hoursData, [day]: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.75rem', color: '#8B4A3A' }}>
                      FAQ Section
                    </h2>
                    <button
                      onClick={saveFAQ}
                      disabled={saving === 'faq'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: saving === 'faq' ? '#A85C4A' : '#E8A87C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving === 'faq' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {saving === 'faq' ? 'Saving...' : 'Save FAQ'}
                    </button>
                  </div>
                  <p style={{ color: '#A85C4A', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Maximum 10 questions allowed. You can add, edit, or delete questions. Click "Save FAQ" to save changes.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {faqData.map((faq, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#FFF8F0', borderRadius: '12px', border: '2px solid #FFE5D9' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
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
                              style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
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
                            background: '#A85C4A',
                            color: '#FFFFFF',
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
                    <div style={{ padding: '1.5rem', background: '#FFF8F0', borderRadius: '12px', border: '2px dashed #FFB89A' }}>
                      <h3 style={{ color: '#8B4A3A', marginBottom: '1rem' }}>Add New FAQ</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                            Question
                          </label>
                          <input
                            type="text"
                            id="new-faq-question"
                            placeholder="Enter question"
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                            Answer
                          </label>
                          <textarea
                            id="new-faq-answer"
                            placeholder="Enter answer"
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
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
                            background: '#E8A87C',
                            color: '#FFFFFF',
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

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/admin" style={{ color: '#E8A87C', textDecoration: 'none', fontSize: '1.1rem', fontFamily: '"Space Grotesk", sans-serif' }}>
            ← Back to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
