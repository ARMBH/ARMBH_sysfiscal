import gql from "graphql-tag";

const QUERY_PROFILE = gql`
  query getProfile($id: String!) {
    users(where: { id: { _eq: $id } }) {
      id
      cpf
      created_at
      email
      name
      role
      telefone
    }
  }
`;

const EDIT_PROFILE = gql`
  mutation($id: String!, $cpf: String!, $name: String!, $telefone: String!) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { cpf: $cpf, name: $name, telefone: $telefone }
    ) {
      affected_rows
      returning {
        id
        email
      }
    }
  }
`;

export { QUERY_PROFILE, EDIT_PROFILE };
