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

const EDIT_DEMANDA = gql`
  mutation(
    $codigo: String!
    $status_demanda: String!
    $justificativa: String!
  ) {
    update_demandas(
      where: { codigo: { _eq: $codigo } }
      _set: { status_demanda: $status_demanda, justificativa: $justificativa }
    ) {
      affected_rows
      returning {
        status_demanda
        updated_at
        justificativa
      }
    }
  }
`;

const QUERY_DEMANDA = gql`
  query getDemanda($codigo: String!) {
    demandas(where: { codigo: { _eq: $codigo } }) {
      codigo
      coordenada_x
      coordenada_y
      created_at
      description
      empreendedor
      empreendedor_dados
      empreendimento
      empreendimento_dados
      id
      municipio {
        id
        name
      }
      origem {
        id
        name
      }
      pto_de_referencia
      status_demanda
      updated_at
      justificativa
    }
  }
`;

const QUERY_DEMANDAS = gql`
  {
    demandas(order_by: { created_at: desc }) {
      codigo
      created_at
      description
      empreendimento
      empreendedor
      id
      municipio {
        name
        id
      }
      origem {
        id
        name
      }
      status_demanda
      updated_at
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

const QUERY_TOTAL_DEMANDAS = gql`
  query getProcessos_Status($origem_id: Int!, $status_demanda: String!) {
    demandas_aggregate(
      where: {
        origem_id: { _eq: $origem_id }
        status_demanda: { _eq: $status_demanda }
      }
    ) {
      aggregate {
        count(columns: id)
      }
    }
  }
`;

export {
  QUERY_DEMANDA,
  EDIT_DEMANDA,
  ADD_PROCESSO,
  QUERY_DEMANDAS,
  QUERY_ORIGEMS,
  QUERY_MUNICIPIOS,
  QUERY_STATUS,
  SUBSCRIPTION_TOTAL_PROCESSOS,
  QUERY_TOTAL_HISTORICOS,
  QUERY_TOTAL_DOCUMENTOS,
  QUERY_TOTAL_STATUS_ID,
  QUERY_TOTAL_DEMANDAS
};
