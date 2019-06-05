import gql from "graphql-tag";

const QUERY_USER = gql`
  query getUser($userId: String!) {
    users(where: { id: { _eq: $userId } }) {
      id
      name
    }
  }
`;

export { QUERY_USER };
