import { gql } from '@apollo/client';
import apolloClient from './apolloClient';

// Updated mutation to match Magento 2.4.x GraphQL schema
const CREATE_PRODUCT_REVIEW_MUTATION = gql`
  mutation CreateProductReview(
    $sku: String!
    $nickname: String!
    $summary: String!
    $text: String!
    $ratings: [ProductReviewRatingInput!]!
  ) {
    createProductReview(
      input: {
        sku: $sku
        nickname: $nickname
        summary: $summary
        text: $text
        ratings: $ratings
      }
    ) {
      review {
        nickname
        summary
        text
        average_rating
        created_at
      }
    }
  }
`;



/**
 * Submits a product review.
 * @param {Object} reviewData - The review data, including sku, nickname, summary, text, and an array of ratings.
 * @param {Array<Object>} reviewData.ratings - Array of rating objects, e.g., [{ id: "base64RatingId", value_id: "base64RatingValueId" }]
 * @returns {Promise<Object>} The result of the mutation
 */
export const addProductReview = async (reviewData) => {
 // reviewData now expects a 'ratings' array directly
 const { sku, nickname, summary, text, ratings } = reviewData;

 if (!ratings || ratings.length === 0) {
   // Handle cases where no ratings are provided, if necessary,
   // or ensure the form always provides at least one.
   // For now, we assume 'ratings' is a valid array as per ProductReviewRatingInput.
   console.warn('No ratings provided for review.');
   // Depending on schema, ratings might be optional or required.
   // If required and empty, GraphQL will throw an error.
 }

 try {
   const { data } = await apolloClient.mutate({
     mutation: CREATE_PRODUCT_REVIEW_MUTATION,
     variables: {
       sku,
       nickname,
       summary,
       text,
       ratings, // Pass the ratings array directly
     },
   });

    if (data.createProductReview && data.createProductReview.review) {
      return {
        success: true,
        review: data.createProductReview.review,
        message: 'Review submitted successfully.'
      };
    }

    return {
      success: false,
      message: 'Failed to submit review. Please check details.'
    };

  } catch (error) {
    console.error('Error submitting product review:', error);
    
    let errorMessage = 'An unexpected error occurred while submitting your review.';
    if (error.graphQLErrors?.length > 0) {
      errorMessage = error.graphQLErrors.map(err => err.message).join(' ');
    } else if (error.networkError) {
      errorMessage = 'A network error occurred. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error
    };
  }
};

const GET_PRODUCT_REVIEW_RATINGS_METADATA_QUERY = gql`
  query GetProductReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id # This is the base64 encoded ID for the rating criteria (e.g., "Quality")
        name # e.g., "Quality", "Price"
        values { # These are the possible options for this rating criteria
          value_id # This is the base64 encoded ID for the specific rating option (e.g., "5 stars for Quality")
          value # e.g., 1, 2, 3, 4, 5 (numeric representation)
        }
      }
    }
  }
`;

/**
 * Fetches the metadata for product review ratings.
 * This provides the necessary IDs for submitting reviews.
 * @returns {Promise<Object>} The rating metadata or an error object.
 */
export const getProductReviewRatingsMetadata = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_REVIEW_RATINGS_METADATA_QUERY,
      fetchPolicy: 'cache-first', // Good candidate for caching
    });

    if (data.productReviewRatingsMetadata && data.productReviewRatingsMetadata.items) {
      return {
        success: true,
        metadata: data.productReviewRatingsMetadata.items,
      };
    }
    return { success: true, metadata: [], message: 'No rating metadata found.' };
  } catch (error) {
    console.error('Error fetching product review ratings metadata:', error);
    let errorMessage = 'An unexpected error occurred while fetching rating metadata.';
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors.map(err => err.message).join(' ');
    } else if (error.networkError) {
      errorMessage = 'A network error occurred. Please check your connection.';
    }
    return { success: false, message: errorMessage, error };
  }
};


// Updated Get reviews query
const GET_PRODUCT_REVIEWS_QUERY = gql`
  query GetProductReviews($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        sku
        name
        reviews {
          items {
            nickname
            summary
            text
            average_rating # Added average_rating
            created_at
            ratings_breakdown { # Added ratings_breakdown
              name
              value
            }
          }
          page_info {
            page_size
            current_page
            total_pages
          }
        }
      }
    }
  }
`;

/**
 * Fetches product reviews for a given SKU.
 * @param {string} sku - The product SKU.
 * @returns {Promise<Object>} The reviews data or an error object.
 */
export const getProductReviews = async (sku) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_REVIEWS_QUERY,
      variables: { sku },
      fetchPolicy: 'network-only'
    });

    if (data.products && data.products.items.length > 0) {
      return {
        success: true,
        reviews: data.products.items[0].reviews.items || [],
        page_info: data.products.items[0].reviews.page_info
      };
    }

    return { success: true, reviews: [], message: 'No reviews found or product does not exist.' };
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    let errorMessage = 'An unexpected error occurred while fetching reviews.';
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors.map(err => err.message).join(' ');
    } else if (error.networkError) {
      errorMessage = 'A network error occurred. Please check your connection.';
    }
    return { success: false, message: errorMessage, error };
  }
};
