import gql from "graphql-tag";

const ADD_PROCESSO = gql`
  mutation(
    $title: String!
    $descricao: String!
    $origem_solicitacao: String!
    $data_prazo: timestamptz
  ) {
    insert_processos(
      objects: {
        title: $title
        descricao: $descricao
        origem_solicitacao: $origem_solicitacao
        data_prazo: $data_prazo
      }
    ) {
      affected_rows
      returning {
        id
        title
      }
    }
  }
`;

const ADD_DOCORIGEM = gql`
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

const EDIT_PROCESSO = gql`
  mutation(
    $id: Int!
    $title: String!
    $descricao: String!
    $origem_solicitacao: String!
    $updated_at: timestamptz
  ) {
    update_processos(
      where: { id: { _eq: $id } }
      _set: {
        updated_at: $updated_at
        title: $title
        origem_solicitacao: $origem_solicitacao
        descricao: $descricao
      }
    ) {
      affected_rows
      returning {
        id
        title
      }
    }
  }
`;

const QUERY_PROCESSO = gql`
  query getProcesso($processoId: Int!) {
    processos(where: { id: { _eq: $processoId } }) {
      id
      title
      updated_at
      user {
        id
        name
      }
      origem_solicitacao
      descricao
      created_at
      status
      data_prazo
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

const QUERY_PROCESSOS = gql`
  {
    processos(order_by: { id: desc }) {
      updated_at
      created_at
      id
      title
      status
      data_prazo
      user {
        name
        id
      }
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

export {
  QUERY_PROCESSO,
  EDIT_PROCESSO,
  ADD_PROCESSO,
  QUERY_PROCESSOS,
  SUBSCRIPTION_TOTAL_PROCESSOS,
  ADD_DOCORIGEM,
  QUERY_DOCUMENTOS
};
