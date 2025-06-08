import React from 'react';

const StarRating = ({ rating, size = "text-xl" }) => { // Expects rating on a 0-5 scale
  const totalStars = 5;
  // Ensure rating is a number and within 0-5 range for safety, though input should be pre-validated
  const numericRating = parseFloat(rating);
  const filledStars = isNaN(numericRating) ? 0 : Math.max(0, Math.min(totalStars, Math.round(numericRating)));

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, i) => (
        <span key={i} className={`${size} ${i < filledStars ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const ProductReviewItem = ({ review }) => {
  if (!review) {
    return null;
  }

  const { nickname, summary, text, created_at, average_rating, ratings_breakdown } = review;
  const reviewDate = created_at ? new Date(created_at).toLocaleDateString() : 'Date not available';

  // Convert average_rating (0-100 from Magento) to 0-5 scale for StarRating component
  const overallStars = average_rating ? Math.round(parseFloat(average_rating) / 20) : 0;

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center mb-3">
        <div className="mb-2 sm:mb-0">
          <StarRating rating={overallStars} />
        </div>
        <h4 className="text-lg font-semibold text-gray-800 sm:ml-3">{summary}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        By <span className="font-medium text-gray-700">{nickname}</span> on {reviewDate}
      </p>
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{text}</p>

      {ratings_breakdown && ratings_breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">Detailed Ratings:</h5>
          <ul className="space-y-1">
            {ratings_breakdown.map((breakdownItem, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{breakdownItem.name}:</span>
                <StarRating rating={parseFloat(breakdownItem.value)} size="text-md" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductReviewItem;