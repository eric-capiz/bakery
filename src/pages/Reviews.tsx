import { CakeState } from "../cakeState";

const Reviews = () => {
  // Get all reviews from all cakes and flatten them
  const allReviews = CakeState().flatMap(cake => cake.reviews);

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <p>See what our customers have to say</p>
      </div>
      <div className="reviews-grid">
        {allReviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3>{review.title}</h3>
            <p>{review.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;

