import gql from "graphql-tag";

const ADD_HISTORICO = gql`
  mutation($name: String!, $processo_id: Int!, $historico_tipo_id: Int!) {
    insert_historicos(
      objects: {
        name: $name
        processo_id: $processo_id
        historico_tipo_id: $historico_tipo_id
      }
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
      order_by: { created_at: asc }
    ) {
      id
      processo_id
      historico_tipo_id
      historico_tipo {
        id
        name
        type
      }
      name
      created_at
      user {
        id
        name
      }
    }
  }
`;

const QUERY_HISTORICOS_TIPO = gql`
  query getHistoricos($processoId: Int!, $historico_tipo: Int!) {
    historicos(
      where: {
        processo_id: { _eq: $processoId }
        historico_tipo_id: { _eq: $historico_tipo }
      }
      order_by: { created_at: asc }
    ) {
      id
      processo_id
      historico_tipo_id
      historico_tipo {
        id
        name
        type
      }
      name
      created_at
      user {
        id
        name
      }
    }
  }
`;

export { ADD_HISTORICO, QUERY_HISTORICOS, QUERY_HISTORICOS_TIPO };
