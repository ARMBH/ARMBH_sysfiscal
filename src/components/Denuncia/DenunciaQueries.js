import gql from "graphql-tag";

const QUERY_DENUNCIA = gql`
  {
    demandas {
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
      codigo
      coordenada_x
      coordenada_y
      created_at
      description
      empreendedor
      empreendedor_dados
      empreendimento
      empreendimento_dados
      justificativa
    }
  }
`;

const ADD_DENUNCIA = gql`
  mutation(
    $codigo: String!
    $coordenada_x: String!
    $coordenada_y: String!
    $description: String!
    $empreendedor: String!
    $empreendedor_dados: String!
    $empreendimento: String!
    $empreendimento_dados: String!
    $municipio_id: Int!
    $pto_de_referencia: String!
  ) {
    insert_demandas(
      objects: {
        codigo: $codigo
        coordenada_x: $coordenada_x
        coordenada_y: $coordenada_y
        description: $description
        empreendedor: $empreendedor
        empreendedor_dados: $empreendedor_dados
        empreendimento: $empreendimento
        empreendimento_dados: $empreendimento_dados
        municipio_id: $municipio_id
        pto_de_referencia: $pto_de_referencia
      }
    ) {
      affected_rows
      returning {
        codigo
      }
    }
  }
`;
export { QUERY_DENUNCIA, ADD_DENUNCIA };
