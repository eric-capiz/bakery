import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ImageData {
  heroImage: string;
  galleryImages: string[];
  allImages: string[];
}

const AdminImages = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadImages();
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

  const loadImages = async () => {
    try {
      const response = await fetch('/api/images/get');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure galleryImages exists and is an array
      if (data && (!data.galleryImages || !Array.isArray(data.galleryImages))) {
        data.galleryImages = [];
      }
      setImageData(data);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('Failed to load images');
      // Set default data to prevent crashes
      setImageData({
        heroImage: 'cake1.jpg',
        galleryImages: [],
        allImages: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (!fileInput.files || fileInput.files.length === 0) {
      setError('Please select a file to upload');
      setUploading(false);
      return;
    }

    const form = new FormData();
    Array.from(fileInput.files).forEach((file) => {
      form.append('image', file);
    });

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        fileInput.value = '';
        loadImages();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSetHero = async (imageName: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/images/update-hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageName }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Hero image updated successfully');
        loadImages();
      } else {
        setError(data.error || 'Failed to update hero image');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleDelete = async (imageName: string) => {
    if (!confirm(`Are you sure you want to delete ${imageName}?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/images/delete?imageName=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Image deleted successfully');
        loadImages();
      } else {
        setError(data.error || 'Failed to delete image');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleReplace = async (imageName: string, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setReplacing(imageName);

    const fileInput = replaceInputRefs.current[imageName];
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError('Please select a file to replace with');
      setReplacing(null);
      return;
    }

    const form = new FormData();
    form.append('image', fileInput.files[0]);
    form.append('imageName', imageName);

    try {
      const response = await fetch('/api/images/replace', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Image replaced successfully');
        fileInput.value = '';
        setReplacing(null);
        loadImages();
      } else {
        setError(data.error || 'Failed to replace image');
        setReplacing(null);
      }
    } catch (err) {
      setError('An error occurred');
      setReplacing(null);
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
          Image Management
        </h1>

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
          <p style={{ textAlign: 'center', color: '#8B4A3A' }}>Loading images...</p>
        ) : imageData && (
          <>
            {/* Hero Image Section */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', color: '#8B4A3A', marginBottom: '1.5rem' }}>
                Hero Image
              </h2>
              <p style={{ color: '#A85C4A', marginBottom: '2rem', fontSize: '0.95rem' }}>
                This image appears in the hero section on the home page. There must always be a hero image (defaults to cake1.jpg if none is set).
              </p>

              {imageData.heroImage && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ maxWidth: '400px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <img 
                      src={`/img/Cakes/${imageData.heroImage}`} 
                      alt="Hero" 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '1rem', color: '#8B4A3A', fontWeight: '600' }}>
                    Current: {imageData.heroImage}
                  </p>
                </div>
              )}

              <form onSubmit={handleReplace.bind(null, imageData.heroImage || 'cake1.jpg')} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={(el) => { replaceInputRefs.current[imageData.heroImage || 'cake1.jpg'] = el; }}
                    type="file"
                    accept="image/*"
                    required
                    style={{ flex: '1', minWidth: '200px', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px' }}
                  />
                  <button
                    type="submit"
                    disabled={replacing === imageData.heroImage}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: replacing === imageData.heroImage ? '#A85C4A' : '#E8A87C',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: replacing === imageData.heroImage ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {replacing === imageData.heroImage ? 'Replacing...' : 'Replace Hero Image'}
                  </button>
                </div>
              </form>

              {imageData && imageData.allImages && imageData.allImages.filter(img => img !== imageData.heroImage).length > 0 && (
                <div>
                  <p style={{ marginBottom: '1rem', color: '#8B4A3A', fontWeight: '600' }}>Or select from existing images:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                    {imageData.allImages
                      .filter(img => img !== imageData.heroImage)
                      .map((img) => (
                        <button
                          key={img}
                          onClick={() => handleSetHero(img)}
                          style={{
                            padding: '0.5rem',
                            background: '#FFF8F0',
                            border: '2px solid #FFB89A',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#FFE5D9';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#FFF8F0';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <img 
                            src={`/img/Cakes/${img}`} 
                            alt={img}
                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                          />
                          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#8B4A3A', wordBreak: 'break-word' }}>
                            {img}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images Section */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
              <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', color: '#8B4A3A', marginBottom: '1.5rem' }}>
                Gallery Images
              </h2>
              <p style={{ color: '#A85C4A', marginBottom: '2rem', fontSize: '0.95rem' }}>
                These images appear in the Sample Cakes gallery page. You can add, replace, or delete images.
              </p>

              {/* Upload New Images */}
              <form onSubmit={handleUpload} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#FFF8F0', borderRadius: '12px', border: '2px dashed #FFB89A' }}>
                <label style={{ display: 'block', marginBottom: '1rem', color: '#8B4A3A', fontWeight: '600' }}>
                  Upload New Images:
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    style={{ flex: '1', minWidth: '200px', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px' }}
                  />
                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: uploading ? '#A85C4A' : '#E8A87C',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>

              {/* Gallery Images Grid */}
              {!imageData || !imageData.galleryImages || imageData.galleryImages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#A85C4A', padding: '2rem' }}>
                  No gallery images yet. Upload some images to get started!
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                  {imageData.galleryImages.map((img) => (
                    <div
                      key={img}
                      style={{
                        background: '#FFF8F0',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '2px solid #FFE5D9',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', background: '#FFFFFF' }}>
                        <img 
                          src={`/img/Cakes/${img}`} 
                          alt={img}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                      <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#8B4A3A', wordBreak: 'break-word', textAlign: 'center', minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {img}
                      </p>
                      
                      <div style={{ marginTop: 'auto' }}>
                        <form onSubmit={handleReplace.bind(null, img)} style={{ marginBottom: '0.5rem' }}>
                          <input
                            ref={(el) => { replaceInputRefs.current[img] = el; }}
                            type="file"
                            accept="image/*"
                            required
                            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', border: '2px solid #FFB89A', borderRadius: '6px', fontSize: '0.85rem' }}
                          />
                          <button
                            type="submit"
                            disabled={replacing === img}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              background: replacing === img ? '#A85C4A' : '#E8A87C',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: replacing === img ? 'not-allowed' : 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                            }}
                          >
                            {replacing === img ? 'Replacing...' : 'Replace'}
                          </button>
                        </form>

                        <button
                          onClick={() => handleDelete(img)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'transparent',
                            color: '#A85C4A',
                            border: '2px solid #A85C4A',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#A85C4A';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#A85C4A';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

export default AdminImages;

