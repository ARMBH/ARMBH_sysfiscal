import gql from "graphql-tag";

const ADD_PROCESSO = gql`
  mutation(
    $name: String!
    $description: String!
    $origem_id: Int!
    $status_id: Int!
    $municipio_id: Int!
  ) {
    insert_processos(
      objects: {
        name: $name
        description: $description
        origem_id: $origem_id
        municipio_id: $municipio_id
        status_id: $status_id
      }
    ) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

const EDIT_PROCESSO = gql`
  mutation(
    $id: Int!
    $name: String!
    $description: String!
    $origem_id: Int!
    $municipio_id: Int!
  ) {
    update_processos(
      where: { id: { _eq: $id } }
      _set: {
        name: $name
        origem_id: $origem_id
        description: $description
        municipio_id: $municipio_id
      }
    ) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

const QUERY_PROCESSO = gql`
  query getProcesso($processoId: Int!) {
    processos(where: { id: { _eq: $processoId } }) {
      id
      name
      user {
        id
        name
      }
      origem_id
      description
      created_at
      status_id
      status {
        name
        type
      }
      municipio_id
      due_date
      demanda_codigo
    }
  }
`;

const QUERY_PROCESSOS = gql`
  {
    processos(order_by: { id: desc }) {
      created_at
      id
      name
      status_id
      status {
        name
        type
      }
      municipio {
        id
        name
      }
      due_date
      demanda_codigo
      user {
        id
        name
        id
      }
    }
  }
`;

const QUERY_PROCESSOS_STATUS = gql`
  {
    processos_status(
      distinct_on: processo_id
      order_by: { processo_id: desc, due_date: desc }
    ) {
      id
      name
      due_date
      processo {
        id
        name
        created_at
        user {
          id
          name
        }
        municipio {
          id
          name
        }
      }
      status {
        name
        type
        id
      }
    }
  }
`;

const QUERY_ORIGEMS = gql`
  {
    origems(order_by: { name: asc }) {
      id
      name
    }
  }
`;

const QUERY_MUNICIPIOS = gql`
  {
    municipios(order_by: { name: asc }) {
      id
      name
      zone
    }
  }
`;

const QUERY_STATUS = gql`
  {
    status(order_by: { name: asc }) {
      id
      name
      type
    }
  }
`;

const SUBSCRIPTION_TOTAL_PROCESSOS = gql`
  subscription getProcessos {
    processos_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const QUERY_TOTAL_HISTORICOS = gql`
  query totalHistoricos($processo_id: Int!) {
    historicos_aggregate(where: { processo_id: { _eq: $processo_id } }) {
      aggregate {
        count
      }
    }
  }
`;

const QUERY_TOTAL_DOCUMENTOS = gql`
  query totalDocumentos($processo_id: Int!) {
    documentos_aggregate(where: { processo_id: { _eq: $processo_id } }) {
      aggregate {
        count
      }
    }
  }
`;

const QUERY_TOTAL_STATUS_ID = gql`
  query getProcessos_Status($processo_id: Int!, $status_id: Int!) {
    processos_status_aggregate(
      where: {
        processo_id: { _eq: $processo_id }
        status_id: { _eq: $status_id }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const QUERY_TOTAL_INTERESSADOS = gql`
  query getProcessos_Status($processo_id: Int!) {
    processos_interessados_aggregate(
      where: { processo_id: { _eq: $processo_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const QUERY_PROCESSO_DEMANDA = gql`
  query getProcesso($processo_id: Int!) {
    processos(where: { id: { _eq: $processo_id } }) {
      id
      demanda_codigo
    }
  }
`;

export {
  QUERY_PROCESSO,
  EDIT_PROCESSO,
  ADD_PROCESSO,
  QUERY_PROCESSOS,
  QUERY_ORIGEMS,
  QUERY_MUNICIPIOS,
  QUERY_STATUS,
  SUBSCRIPTION_TOTAL_PROCESSOS,
  QUERY_PROCESSOS_STATUS,
  QUERY_TOTAL_HISTORICOS,
  QUERY_TOTAL_DOCUMENTOS,
  QUERY_TOTAL_STATUS_ID,
  QUERY_TOTAL_INTERESSADOS,
  QUERY_PROCESSO_DEMANDA
};
