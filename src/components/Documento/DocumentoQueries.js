import gql from "graphql-tag";

const QUERY_DOCUMENTO = gql`
  query getDocumento($id: Int!) {
    documentos(where: { id: { _eq: $id } }) {
      id
      name
      created_at
      size
      type
      base64
      user {
        name
      }
    }
  }
`;

export { QUERY_DOCUMENTO };
