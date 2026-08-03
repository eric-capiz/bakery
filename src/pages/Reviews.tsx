import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  MAX_REVIEW_DESCRIPTION_LENGTH,
  ADMIN_STATUS_POLL_INTERVAL,
  MODAL_AUTO_CLOSE_DELAY,
} from "../../lib/constants";

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const useViewportMode = () => {
  const [mode, setMode] = useState<"pending" | "mobile" | "desktop">("pending");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setMode(media.matches ? "mobile" : "desktop");
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mode;
};

const placeOnTable = (index: number, total: number) => {
  const cols = total <= 4 ? 2 : total <= 9 ? 3 : 4;
  const rows = Math.max(1, Math.ceil(total / cols));
  const col = index % cols;
  const row = Math.floor(index / cols);

  const leftMin = 2;
  const leftMax = 74;
  const topMin = 11;
  const topMax = 74;

  const leftBase =
    leftMin + (col / Math.max(cols - 1, 1)) * (leftMax - leftMin);

  const topBase =
    rows === 1
      ? (topMin + topMax) / 2
      : topMin + (row / (rows - 1)) * (topMax - topMin);

  // Offset odd rows so columns don't form rigid lines
  const stagger = row % 2 === 1 ? (leftMax - leftMin) / (cols * 2.4) : 0;

  const jitterX = ((index * 41) % 9) - 4;
  const jitterY = ((index * 29) % 9) - 4;
  const rot = ((index * 19) % 13) - 6;

  const left = Math.min(leftMax, Math.max(leftMin, leftBase + stagger + jitterX));
  const top = Math.min(topMax, Math.max(topMin, topBase + jitterY));

  return {
    left: `${left}%`,
    top: `${top}%`,
    rotate: `${rot * 0.55}deg`,
    z: 1 + (index % 5),
  };
};

const Reviews = () => {
  const mode = useViewportMode();
  const isMobile = mode === "mobile";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    name: "",
    image: null as File | null,
  });

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    loadReviews();
    checkAdminStatus();

    const handleAdminChange = () => checkAdminStatus();
    window.addEventListener("adminLogin", handleAdminChange);
    window.addEventListener("adminLogout", handleAdminChange);
    const interval = setInterval(checkAdminStatus, ADMIN_STATUS_POLL_INTERVAL);
    const handleFocus = () => checkAdminStatus();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("adminLogin", handleAdminChange);
      window.removeEventListener("adminLogout", handleAdminChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const data = await response.json();
      setIsAdmin(data.authenticated || false);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews/get");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setReviews(data);
        setSelectedId(null);
        setMobileIndex(0);
        setMobileOpen(false);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsModalOpen(true);
    setError("");
    setSuccess(false);
    setFormData({ title: "", description: "", name: "", image: null });
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
    setSuccess(false);
    setFormData({ title: "", description: "", name: "", image: null });
    document.body.style.overflow = "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    if (formData.name.trim()) formDataToSend.append("name", formData.name.trim());
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          handleCloseModal();
          loadReviews();
        }, MODAL_AUTO_CLOSE_DELAY);
      } else {
        setError(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    const id = reviewToDelete;
    try {
      const response = await fetch(`/api/reviews/delete?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadReviews();
        setReviewToDelete(null);
        if (selectedId === id) setSelectedId(null);
      } else {
        setAlertMessage("Failed to delete review");
        setShowAlert(true);
        setReviewToDelete(null);
      }
    } catch (err) {
      setAlertMessage("An error occurred while deleting the review");
      setShowAlert(true);
      setReviewToDelete(null);
    }
  };

  const reviewImageSrc = (image: string) =>
    image.startsWith("http") ? image : `/img/reviews/${image}`;

  const seal = (name: string | null, title: string) =>
    ((name && name.trim()) || title || "A").trim().charAt(0).toUpperCase();

  const tableReviews = useMemo(() => reviews.slice(0, 12), [reviews]);
  const selected = reviews.find((r) => r.id === selectedId) || null;
  const mobileReview = reviews[mobileIndex] || null;
  const count = reviews.length;

  return (
    <div className={`reviews-page ${inView ? "animate-in" : ""}`} ref={ref}>
      <header className="reviews-header">
        <p className="reviews-kicker">Whisper table</p>
        <h1>Customer Reviews</h1>
        <p className="reviews-lead">
          {mode === "mobile"
            ? "Swipe through notes left for the bakery."
            : "Notes scattered across the bakery table. Pick any one up to read it."}
        </p>
        <button type="button" onClick={handleOpenModal} className="btn-add-review">
          Leave a review
        </button>
      </header>

      {loading || mode === "pending" ? (
        <p className="reviews-status">Loading reviews...</p>
      ) : count === 0 ? (
        <p className="reviews-status">
          No reviews yet. Be the first to leave one.
        </p>
      ) : isMobile ? (
        <div className="review-mobile-carousel">
          <div className={`review-mobile-card ${mobileOpen ? "is-open" : ""}`}>
            {!mobileOpen ? (
              <button
                type="button"
                className="review-mobile-seal"
                onClick={() => setMobileOpen(true)}
              >
                <span className="whisper-seal">{seal(mobileReview?.name || null, mobileReview?.title || "")}</span>
                <span>
                  <strong>{mobileReview?.title}</strong>
                  <em>{mobileReview?.name || "Anonymous"}</em>
                </span>
                <span className="review-mobile-cue">Open</span>
              </button>
            ) : (
              <div className="review-mobile-body">
                <div className="review-mobile-toolbar">
                  <strong>{mobileReview?.title}</strong>
                  <button type="button" onClick={() => setMobileOpen(false)}>
                    Seal
                  </button>
                </div>
                <div className="review-mobile-scroll">
                  <p>{mobileReview?.description}</p>
                  <cite>{mobileReview?.name || "Anonymous"}</cite>
                </div>
              </div>
            )}
          </div>
          <div className="cake-mobile-controls">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setMobileIndex((i) => (i - 1 + count) % count);
              }}
              aria-label="Previous"
            >
              ‹
            </button>
            <p>
              {mobileIndex + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setMobileIndex((i) => (i + 1) % count);
              }}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      ) : (
        <div className="whisper-table" aria-label="Reviews on the bakery table">
          <div className="whisper-table-cloth" aria-hidden="true" />
          <p className="whisper-table-hint">Pick up a note</p>

          {tableReviews.map((review, i) => {
            const spot = placeOnTable(i, tableReviews.length);
            const active = selectedId === review.id;
            return (
              <button
                type="button"
                key={review.id}
                className={`whisper-note ${active ? "is-active" : ""}`}
                style={{
                  left: spot.left,
                  top: spot.top,
                  transform: `rotate(${spot.rotate})`,
                  zIndex: active ? 20 : spot.z,
                }}
                onClick={() =>
                  setSelectedId((current) =>
                    current === review.id ? null : review.id
                  )
                }
                aria-pressed={active}
              >
                <span className="whisper-seal" aria-hidden="true">
                  {seal(review.name, review.title)}
                </span>
                <span className="whisper-note-text">
                  <strong>{review.title}</strong>
                  <em>{review.name || "Anonymous"}</em>
                </span>
              </button>
            );
          })}

          {reviews.length > tableReviews.length ? (
            <p className="whisper-table-more">
              Showing {tableReviews.length} of {reviews.length} notes on the table
            </p>
          ) : null}

          {selected ? (
            <div className="whisper-reader" role="dialog" aria-label="Opened review">
              <div className="whisper-reader-head">
                <div>
                  <p className="whisper-reader-kicker">Opened note</p>
                  <h2>{selected.title}</h2>
                </div>
                <div className="whisper-reader-actions">
                  {isAdmin ? (
                    <button
                      type="button"
                      className="is-danger-text"
                      onClick={() => setReviewToDelete(selected.id)}
                    >
                      Delete
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setSelectedId(null)}>
                    Put back
                  </button>
                </div>
              </div>
              <div className="whisper-reader-body">
                <p className="whisper-reader-greeting">Dear Sweet Dreams,</p>
                <p>{selected.description}</p>
                <cite>{selected.name || "A happy guest"}</cite>
                {selected.image &&
                selected.image !== "null" &&
                selected.image.trim() ? (
                  <img
                    src={reviewImageSrc(selected.image)}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>

              {reviewToDelete === selected.id ? (
                <div className="review-delete-overlay">
                  <h3>Delete this review?</h3>
                  <p>This cannot be undone.</p>
                  <div className="review-delete-actions">
                    <button type="button" onClick={() => setReviewToDelete(null)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {isModalOpen ? (
        <div className="reviews-modal-overlay" onClick={handleCloseModal}>
          <div
            className="reviews-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reviews-modal-head">
              <h2 id="review-modal-title">Leave a review</h2>
              <button
                type="button"
                className="reviews-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {error ? <div className="reviews-banner is-error">{error}</div> : null}
            {success ? (
              <div className="reviews-banner is-success">
                Thank you. Your review has been submitted.
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="reviews-form">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                <span className="reviews-form-label-row">
                  Review details
                  <span>
                    {formData.description.length}/{MAX_REVIEW_DESCRIPTION_LENGTH}
                  </span>
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={MAX_REVIEW_DESCRIPTION_LENGTH}
                  rows={4}
                />
              </label>
              <label>
                Your name (optional)
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="First name only"
                />
              </label>
              <label>
                Image (optional)
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
              <div className="reviews-form-actions">
                <button
                  type="button"
                  className="is-ghost"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showAlert ? (
        <div className="reviews-modal-overlay" onClick={() => setShowAlert(false)}>
          <div
            className="reviews-modal reviews-modal--alert"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reviews-modal-head">
              <h2>Something went wrong</h2>
              <button
                type="button"
                className="reviews-modal-close"
                onClick={() => setShowAlert(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="reviews-alert-copy">{alertMessage}</p>
            <div className="reviews-form-actions">
              <button type="button" onClick={() => setShowAlert(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reviews;
