import gql from "graphql-tag";
const QUERY_ENDERECO = gql`
  query getEndereco($processoId: Int!) {
    processos(where: { id: { _eq: $processoId } }) {
      id
      processos_enderecos {
        id
        endereco {
          id
          area
          bairro
          cep
          complemento
          created_at
          ibge
          localidade
          logradouro
          uf
        }
      }
    }
  }
`;
const ADD_ENDERECO = gql`
  mutation(
    $area: float8
    $bairro: String!
    $cep: String!
    $complemento: String!
    $ibge: String!
    $localidade: String!
    $logradouro: String!
    $processo_id: Int!
    $uf: String!
  ) {
    insert_processos_enderecos(
      objects: {
        endereco: {
          data: {
            area: $area
            bairro: $bairro
            cep: $cep
            complemento: $complemento
            ibge: $ibge
            localidade: $localidade
            logradouro: $logradouro
            uf: $uf
          }
        }
        processo_id: $processo_id
      }
    ) {
      returning {
        id
        endereco_id
        processo_id
      }
    }
  }
`;

const EDIT_ENDERECO = gql`
  mutation(
    $area: float8
    $bairro: String!
    $cep: String!
    $complemento: String!
    $ibge: String!
    $localidade: String!
    $logradouro: String!
    $id: Int!
    $uf: String!
  ) {
    update_enderecos(
      where: { id: { _eq: $id } }
      _set: {
        area: $area
        bairro: $bairro
        cep: $cep
        complemento: $complemento
        ibge: $ibge
        localidade: $localidade
        logradouro: $logradouro
        uf: $uf
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export { QUERY_ENDERECO, ADD_ENDERECO, EDIT_ENDERECO };
