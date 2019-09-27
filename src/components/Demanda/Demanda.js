/*
Gestão de Demandas
Origens distintas:
{
  demandas_aggregate(distinct_on: origem_id) {
    nodes {
      origem_id
      origem {
        id
        name
      }
    }
  }
}
Conta quantas são:
{
  demandas_aggregate(where: {origem_id: {_eq: 3}, status_demanda: {_eq: "Nova"}}) {
    aggregate {
      count(columns: id)
    }
  }
}


*/
