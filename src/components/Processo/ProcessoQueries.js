import gql from "graphql-tag";

const ADD_PROCESSO = gql`
  mutation($title: String!, $descricao: String!, $origem_solicitacao: String!) {
    insert_processos(
      objects: {
        title: $title
        descricao: $descricao
        origem_solicitacao: $origem_solicitacao
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
      user {
        name
        id
      }
    }
  }
`;

export { QUERY_PROCESSO, EDIT_PROCESSO, ADD_PROCESSO, QUERY_PROCESSOS };
