import gql from "graphql-tag";

const ADD_HISTORICO = gql`
  mutation($title: String!, $processo_id: Int!, $tipo: String!) {
    insert_historicos(
      objects: { title: $title, processo_id: $processo_id, tipo: $tipo }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const QUERY_HISTORICOS = gql`
  query getHistoricos($processoId: Int!) {
    historicos(
      where: { processo_id: { _eq: $processoId } }
      order_by: { updated_at: asc }
    ) {
      id
      processo_id
      tipo
      title
      updated_at
      user {
        name
      }
    }
  }
`;

export { ADD_HISTORICO, QUERY_HISTORICOS };
