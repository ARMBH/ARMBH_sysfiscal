import gql from "graphql-tag";

const QUERY_PROCESSOS_STATUS = gql`
  query getProcessos_Status($processoId: Int!) {
    processos_status(where: { processo_id: { _eq: $processoId } }) {
      id
      status_id
      processo_id
      created_at
      due_date
      name
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

const ADD_STATUS = gql`
  mutation(
    $name: String!
    $status_id: Int!
    $processo_id: Int!
    $due_date: timestamptz
  ) {
    insert_processos_status(
      objects: {
        name: $name
        status_id: $status_id
        processo_id: $processo_id
        due_date: $due_date
      }
    ) {
      affected_rows
      returning {
        id
        processo_id
      }
    }
  }
`;

const EDIT_STATUS = gql`
  mutation(
    $name: String!
    $status_id: Int!
    $processo_id: Int!
    $due_date: timestamptz
  ) {
    update_processos_status(
      where: { processo_id: { _eq: $processo_id } }
      _set: {
        name: $name
        status_id: $status_id
        processo_id: $processo_id
        due_date: $due_date
      }
    ) {
      affected_rows
      returning {
        id
        processo_id
      }
    }
  }
`;

export { QUERY_STATUS, ADD_STATUS, EDIT_STATUS };
