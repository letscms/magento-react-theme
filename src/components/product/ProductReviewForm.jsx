import React, { useState, useEffect } from 'react';
import { addProductReview, getProductReviewRatingsMetadata } from '../../api/review';

const ProductReviewForm = ({ productSku, onSubmitReviewSuccess }) => {
  const [ratingsMetadata, setRatingsMetadata] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState({}); // E.g., { "ratingId1": { value_id: "...", numeric_value: 3 }, ... }
  const [nickname, setNickname] = useState('');
  const [summary, setSummary] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  const [ratingsError, setRatingsError] = useState(null);

  useEffect(() => {
    const fetchRatingsMetadata = async () => {
      try {
        setIsLoadingRatings(true);
        setRatingsError(null);
        const result = await getProductReviewRatingsMetadata();
        if (result.success) {
          setRatingsMetadata(result.metadata || []);
        } else {
          setRatingsError(result.message || 'Failed to load rating options.');
          setRatingsMetadata([]);
        }
      } catch (error) {
        console.error("Error fetching rating metadata:", error);
        setRatingsError('An error occurred while loading rating options.');
        setRatingsMetadata([]);
      } finally {
        setIsLoadingRatings(false);
      }
    };

    fetchRatingsMetadata();
  }, []);

  const handleRatingChange = (ratingId, valueId, numericValue) => {
    setSelectedRatings(prevRatings => ({
      ...prevRatings,
      [ratingId]: { value_id: valueId, numeric_value: numericValue },
    }));
  };

  const validateForm = () => {
    const errors = {};
    ratingsMetadata.forEach(ratingMeta => {
      if (!selectedRatings[ratingMeta.id] || !selectedRatings[ratingMeta.id].value_id) {
        errors[`rating_${ratingMeta.id}`] = `Please select a rating for ${ratingMeta.name}.`;
      }
    });
    if (!nickname.trim()) errors.nickname = 'Nickname is required.';
    if (!summary.trim()) errors.summary = 'Summary is required.';
    if (!reviewText.trim()) errors.reviewText = 'Review text is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const ratingsForApi = ratingsMetadata.map(meta => ({
        id: meta.id,
        value_id: selectedRatings[meta.id]?.value_id,
      }));

      const reviewData = {
        sku: productSku,
        nickname,
        summary,
        text: reviewText,
        ratings: ratingsForApi,
      };

      try {
        const result = await addProductReview(reviewData);
        if (result.success) {
          alert(result.message || 'Review submitted successfully!');
          setSelectedRatings({});
          setNickname('');
          setSummary('');
          setReviewText('');
          setFormErrors({});
          if (onSubmitReviewSuccess) {
            onSubmitReviewSuccess(result.review);
          }
        } else {
          alert(`Failed to submit review: ${result.message}`);
        }
      } catch (error) {
        console.error("Error in review submission:", error);
        alert('An error occurred while submitting your review. Please try again.');
      }
    }
  };

  if (isLoadingRatings) {
    return <p>Loading rating options...</p>;
  }

  if (ratingsError) {
    return <p className="text-red-500">{ratingsError}</p>;
  }

  if (ratingsMetadata.length === 0) {
    return <p>No rating options available for this product.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
      
      {ratingsMetadata.map((ratingMeta) => (
        <div key={ratingMeta.id} className="py-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ratingMeta.name} <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            {ratingMeta.values.map((option) => {
              const selectedNumericValueForCriterion = selectedRatings[ratingMeta.id]?.numeric_value;
              const isStarActive = option.value <= selectedNumericValueForCriterion;

              return (
                <button
                  type="button"
                  key={option.value_id}
                  onClick={() => handleRatingChange(ratingMeta.id, option.value_id, option.value)}
                  className={`text-3xl transition-colors duration-150 ease-in-out
                              ${isStarActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}
                              ${selectedRatings[ratingMeta.id]?.value_id === option.value_id ? 'scale-110' : ''}`}
                  aria-label={`Rate ${option.value} for ${ratingMeta.name}`}
                  title={`${option.value} stars`}
                >
                  ★
                </button>
              );
            })}
          </div>
          {formErrors[`rating_${ratingMeta.id}`] && (
            <p className="text-red-500 text-xs mt-1">{formErrors[`rating_${ratingMeta.id}`]}</p>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          Nickname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formErrors.nickname && <p className="text-red-500 text-xs mt-1">{formErrors.nickname}</p>}
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formErrors.summary && <p className="text-red-500 text-xs mt-1">{formErrors.summary}</p>}
      </div>

      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
          Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
        {formErrors.reviewText && <p className="text-red-500 text-xs mt-1">{formErrors.reviewText}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ProductReviewForm;