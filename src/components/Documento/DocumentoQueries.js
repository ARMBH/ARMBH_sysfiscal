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

const QUERY_DOCUMENTOS = gql`
  query getDocumentos($processoId: Int!) {
    documentos(
      where: { processo_id: { _eq: $processoId } }
      order_by: { created_at: asc }
    ) {
      id
      name
      created_at
      size
      type
      user {
        name
      }
      processo {
        title
      }
    }
  }
`;

const ADD_DOCUMENTO = gql`
  mutation(
    $name: String!
    $type: String!
    $size: String!
    $base64: String!
    $user_id: String!
    $processo_id: Int!
  ) {
    insert_documentos(
      objects: {
        name: $name
        type: $type
        size: $size
        base64: $base64
        user_id: $user_id
        processo_id: $processo_id
      }
    ) {
      affected_rows
      returning {
        id
        name
        processo_id
      }
    }
  }
`;

export { QUERY_DOCUMENTO, QUERY_DOCUMENTOS, ADD_DOCUMENTO };
