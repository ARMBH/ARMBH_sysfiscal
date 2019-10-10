import gql from "graphql-tag";

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

const EDIT_PROCESSO_DEMANDA = gql`
  mutation($id: Int!, $demanda_codigo: String!) {
    update_processos(
      where: { id: { _eq: $id } }
      _set: { demanda_codigo: $demanda_codigo }
    ) {
      affected_rows
      returning {
        id
        demanda_codigo
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

const QUERY_TOTAL_DEMANDAS = gql`
  query getdemandas_aggregate($origem_id: Int!, $status_demanda: String!) {
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

const QUERY_DEMANDA_PROCESSO = gql`
  query getDemandaProcesso($codigo: String!) {
    processos(where: { demanda: { codigo: { _eq: $codigo } } }) {
      id
      demanda_codigo
      name
    }
  }
`;

const SUBSCRIPTION_TOTAL_DEMANDAS = gql`
  subscription getDemandas {
    demandas_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export {
  QUERY_DEMANDA,
  EDIT_DEMANDA,
  QUERY_DEMANDAS,
  QUERY_ORIGEMS,
  QUERY_MUNICIPIOS,
  QUERY_TOTAL_DEMANDAS,
  QUERY_DEMANDA_PROCESSO,
  EDIT_PROCESSO_DEMANDA,
  SUBSCRIPTION_TOTAL_DEMANDAS
};
