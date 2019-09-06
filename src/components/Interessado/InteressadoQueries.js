import gql from "graphql-tag";

const QUERY_PROCESSO_INTERESSADO = gql`
  query getProcesso_Interessado($processo_id: Int!, $interessado_id: Int!) {
    processos_interessados(
      where: {
        processo_id: { _eq: $processo_id }
        interessado_id: { _eq: $interessado_id }
      }
    ) {
      id
      processo_id
      interessado_id
      interessado {
        cpf
        id
        name
        origem {
          id
          name
        }
      }
    }
  }
`;
const INSERT_PROCESSO_INTERESSADO = gql`
  mutation insertProcesso_Interessado(
    $processo_id: Int!
    $interessado_id: Int!
  ) {
    insert_processos_interessados(
      objects: { interessado_id: $interessado_id, processo_id: $processo_id }
    ) {
      affected_rows
      returning {
        id
        interessado_id
        processo_id
        interessado {
          cpf
          id
          name
          origem {
            id
            name
          }
        }
      }
    }
  }
`;

const DELETE_PROCESSO_INTERESSADO = gql`
  mutation deleteProcesso_Interessado(
    $processo_id: Int!
    $interessado_id: Int!
  ) {
    delete_processos_interessados(
      where: {
        processo_id: { _eq: $processo_id }
        interessado_id: { _eq: $interessado_id }
      }
    ) {
      affected_rows
    }
  }
`;

const QUERY_INTERESSADOS_ADMIN = gql`
  query getInteressados {
    interessados(order_by: { name: asc }) {
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
      tratamento
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

const QUERY_INTERESSADOS_CPF = gql`
  query getInteressados($cpf: String!) {
    interessados(where: { cpf: { _ilike: $cpf } }) {
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
      tratamento
    }
  }
`;

const QUERY_INTERESSADO = gql`
  query getInteressados($id: Int!) {
    interessados(where: { id: { _eq: $id } }) {
      cpf
      created_at
      criado_por {
        id
        name
      }
      email
      endereco_id
      id
      name
      origem_id
      tratamento
      updated_at
    }
  }
`;

const UPDATE_INTERESSADO = gql`
  mutation(
    $id: Int!
    $cpf: String!
    $email: String!
    $name: String!
    $tratamento: String!
    $origem_id: Int!
  ) {
    update_interessados(
      where: { id: { _eq: $id } }
      _set: {
        cpf: $cpf
        email: $email
        name: $name
        origem_id: $origem_id
        tratamento: $tratamento
      }
    ) {
      affected_rows
      returning {
        cpf
        id
      }
    }
  }
`;

const ADD_INTERESSADO = gql`
  mutation(
    $cpf: String!
    $email: String!
    $name: String!
    $tratamento: String!
    $origem_id: Int!
  ) {
    insert_interessados(
      objects: {
        cpf: $cpf
        email: $email
        name: $name
        origem_id: $origem_id
        tratamento: $tratamento
      }
    ) {
      affected_rows
      returning {
        id
        cpf
        name
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

export {
  QUERY_INTERESSADOS,
  QUERY_INTERESSADOS_CPF,
  QUERY_INTERESSADO,
  ADD_INTERESSADO,
  UPDATE_INTERESSADO,
  QUERY_PROCESSO_INTERESSADO,
  INSERT_PROCESSO_INTERESSADO,
  DELETE_PROCESSO_INTERESSADO,
  QUERY_INTERESSADOS_ADMIN,
  DELETE_DOCUMENTO
};
