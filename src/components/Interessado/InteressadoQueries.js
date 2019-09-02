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
      description
      user {
        id
        name
      }
    }
  }
`;
const QUERY_INTERESSADOS = gql`
  query getInteressados($processo_id: Int!) {
    processos_interessados(
      where: { processo_id: { _eq: $processo_id } }
      order_by: { interessado: { name: asc } }
    ) {
      created_at
      id
      interessado {
        tratamento
        cpf
        created_at
        email
        endereco_id
        id
        name
        origem {
          id
          name
        }
      }
      interessado_id
      processo_id
    }
  }
`;

const ADD_DOCUMENTO = gql`
  mutation(
    $name: String!
    $type: String!
    $size: String!
    $description: String!
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
        description: $description
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

const DELETE_DOCUMENTO = gql`
  mutation($id: Int!) {
    delete_documentos(where: { id: { _eq: $id } }) {
      affected_rows
      returning {
        name
        processo_id
        user {
          id
          name
        }
      }
    }
  }
`;

export { QUERY_DOCUMENTO, QUERY_INTERESSADOS, ADD_DOCUMENTO, DELETE_DOCUMENTO };
