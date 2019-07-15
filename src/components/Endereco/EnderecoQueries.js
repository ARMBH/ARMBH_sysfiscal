import gql from "graphql-tag";

const QUERY_ENDERECO = gql`
  query getEndereco($processoId: Int!) {
    enderecos(where: { processo_id: { _eq: $processoId } }) {
      id
      area
      bairro
      cep
      complemento
      ibge
      localidade
      logradouro
      processo_id
      uf
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
    insert_enderecos(
      objects: {
        area: $area
        bairro: $bairro
        cep: $cep
        complemento: $complemento
        ibge: $ibge
        localidade: $localidade
        logradouro: $logradouro
        processo_id: $processo_id
        uf: $uf
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

const EDIT_ENDERECO = gql`
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
    update_enderecos(
      where: { processo_id: { _eq: $processo_id } }
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
        processo_id
      }
    }
  }
`;

export { QUERY_ENDERECO, ADD_ENDERECO, EDIT_ENDERECO };
