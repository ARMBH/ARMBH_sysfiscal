import gql from "graphql-tag";

const QUERY_PROCESSOS_STATUS = gql`
  query getProcesso($startDate: timestamptz, $endDate: timestamptz) {
    processos_status(
      where: {
        due_date: { _gte: $startDate, _lte: $endDate }
        _not: { status_id: { _eq: 1 } }
      }
    ) {
      created_at
      due_date
      id
      name
      processo {
        user_id
        id
        name
        municipio {
          id
          name
        }
      }
      status {
        name
        id
        type
      }
    }
  }
`;

export { QUERY_PROCESSOS_STATUS };
