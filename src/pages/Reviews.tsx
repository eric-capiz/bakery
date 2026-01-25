import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    name: '',
    image: null as File | null,
  });

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    loadReviews();
    checkAdminStatus();
    
    // Listen for admin login/logout events
    const handleAdminChange = () => {
      checkAdminStatus();
    };
    
    window.addEventListener('adminLogin', handleAdminChange);
    window.addEventListener('adminLogout', handleAdminChange);
    
    // Also check periodically and on focus
    const interval = setInterval(checkAdminStatus, 2000);
    const handleFocus = () => checkAdminStatus();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('adminLogin', handleAdminChange);
      window.removeEventListener('adminLogout', handleAdminChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      setIsAdmin(data.authenticated || false);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/reviews/get');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    // Scroll to top first
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Then open modal
    setIsModalOpen(true);
    setError('');
    setSuccess(false);
    setFormData({ title: '', description: '', name: '', image: null });
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess(false);
    setFormData({ title: '', description: '', name: '', image: null });
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.name.trim()) {
      formDataToSend.append('name', formData.name.trim());
    }
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Close modal after 2-3 seconds and reload reviews
        setTimeout(() => {
          handleCloseModal();
          loadReviews();
        }, 2500);
      } else {
        setError(data.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/delete?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      alert('An error occurred while deleting the review');
    }
  };

  return (
    <div className={`reviews-page ${inView ? 'animate-in' : ''}`} ref={ref}>
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <p>See what our customers have to say</p>
        <button
          onClick={handleOpenModal}
          className="btn-add-review"
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 2rem',
            background: '#E8A87C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(232, 168, 124, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#D97757';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#E8A87C';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Add Review
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#8B4A3A' }}>
          Loading reviews...
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="review-card" 
              style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '480px',
              }}
            >
              {isAdmin && (
                <button
                  onClick={() => handleDelete(review.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#A85C4A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease',
                    zIndex: 10,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#8B4A3A';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#A85C4A';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Delete Review"
                >
                  🗑️
                </button>
              )}
              <div style={{ 
                width: '100%', 
                height: '200px', 
                marginBottom: '1rem',
                borderRadius: '12px',
                overflow: 'hidden',
                background: review.image ? 'transparent' : '#FFF8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {review.image && review.image !== 'null' && review.image.trim() !== '' ? (
                  <img
                    src={review.image.startsWith('http') ? review.image : `/img/reviews/${review.image}`}
                    alt="Review"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      // Fallback if image doesn't exist - show emoji placeholder
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.emoji-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'emoji-placeholder';
                        placeholder.style.cssText = 'width: 100%; height: 100%; background: linear-gradient(135deg, #FFE5D9 0%, #FFF8F0 100%); display: flex; align-items: center; justify-content: center; color: #E8A87C; font-size: 5rem; opacity: 0.6; font-weight: bold;';
                        placeholder.textContent = '🎂';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #FFE5D9 0%, #FFF8F0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E8A87C',
                    fontSize: '5rem',
                    opacity: 0.6,
                    fontWeight: 'bold',
                  }}>
                    🎂
                  </div>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>{review.title}</h3>
                <p style={{ flex: 1, marginBottom: '1rem' }}>{review.description}</p>
                <div style={{ marginTop: 'auto', color: '#A85C4A', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  — {review.name || 'Anonymous'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '2rem',
            overflowY: 'auto',
            paddingTop: '4rem',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem 1.5rem 1rem 1.5rem',
              maxWidth: '600px',
              width: '100%',
              marginTop: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              height: 'fit-content',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', color: '#8B4A3A', margin: 0 }}>
                Leave a Review
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#8B4A3A',
                  padding: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            {error && (
              <div style={{ background: '#FFE5D9', color: '#A85C4A', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '2px solid #FFB89A', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '2px solid #81C784', textAlign: 'center', fontSize: '0.9rem' }}>
                Thank you! Your review has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600' }}>
                    Title <span style={{ color: '#A85C4A' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600', fontSize: '0.95rem' }}>
                    Review Details <span style={{ color: '#A85C4A' }}>*</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#A85C4A', marginLeft: '0.5rem' }}>
                      (Max 500 characters)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#A85C4A', marginTop: '0.25rem' }}>
                    {formData.description.length}/500
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600', fontSize: '0.95rem' }}>
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="First name only"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B4A3A', fontWeight: '600', fontSize: '0.95rem' }}>
                    Image (Optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #FFB89A', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#A85C4A', marginTop: '0.25rem' }}>
                    Maximum file size: 10MB. Accepted formats: JPG, PNG, WebP
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem', marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#FFFFFF',
                      color: '#8B4A3A',
                      border: '2px solid #E8A87C',
                      borderRadius: '8px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: submitting ? '#A85C4A' : '#E8A87C',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
