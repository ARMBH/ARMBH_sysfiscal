import gql from "graphql-tag";

const QUERY_USER = gql`
  query getUser($userId: String!) {
    users(where: { id: { _eq: $userId } }) {
      id
      name
    }
  }
`;

const UPDATE_LASTSEEN_MUTATION = gql`
  mutation updateLastSeen($now: timestamptz!) {
    update_users(where: {}, _set: { last_seen: $now }) {
      affected_rows
    }
  }
`;

export { QUERY_USER, UPDATE_LASTSEEN_MUTATION };
