import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      full_name_english
      available_regions {
        id
        code
        name
      }
    }
  }
`;