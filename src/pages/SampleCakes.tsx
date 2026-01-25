import { useEffect, useState } from "react";

const SampleCakes = () => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/images/get");
        const data = await response.json();
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
          setGalleryImages(data.galleryImages);
        }
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
        // Fallback to empty array if API fails
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  return (
    <div className="sample-cakes">
      <div className="sample-cakes-header">
        <h2>Sample Cakes</h2>
        <p>Explore our collection of custom-made cakes</p>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#8B4A3A' }}>
          Loading gallery...
        </div>
      ) : galleryImages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#A85C4A' }}>
          No cakes available at the moment. Check back soon!
        </div>
      ) : (
        <div className="cakes-gallery">
          {galleryImages.map((imageName, index) => (
            <div key={index} className="cake-card">
              <div className="cake-image-wrapper">
                <img src={`/img/Cakes/${imageName}`} alt={`Custom cake ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleCakes;
