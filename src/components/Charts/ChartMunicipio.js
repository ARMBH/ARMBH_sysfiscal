import React, { Component } from "react";
import gql from "graphql-tag";
import {
  Grid,
  Card
  //colors,
} from "tabler-react";
import C3Chart from "react-c3js";
import "c3/c3.css";
//import auth from "../Auth/Auth";

const QUERY_PROCESSOS = gql`
  {
    municipios(
      order_by: { processos_aggregate: { count: desc }, name: asc }
      where: { processos: { municipio_id: { _gt: 0 } } }
    ) {
      processos_aggregate {
        aggregate {
          count(columns: municipio_id)
        }
      }
      name
      id
    }
  }
`;

class ChartMunicipios extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  setData() {
    let dataChart = [];

    this.props.client.mutate({
      mutation: QUERY_PROCESSOS,
      update: (cache, data) => {
        if (data) {
          if (data.data.municipios.length === 0) {
            console.log("Não há processos no período.");
            return false;
          } else {
            data.data.municipios.map((item, index) => {
              let nomeColuna =
                item.name + ": " + item.processos_aggregate.aggregate.count;
              let conjuntoItems = [
                nomeColuna,
                item.processos_aggregate.aggregate.count
              ];
              return dataChart.push(conjuntoItems);
            });
            this.setState({ data: dataChart });
          }
        }
      }
    });
  }

  componentDidMount() {
    console.log("set");
    this.setData();
  }

  render() {
    return (
      <Grid.Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Processos por Municípios</Card.Title>
          </Card.Header>
          <Card.Body>
            <C3Chart
              style={{ height: "14rem" }}
              data={{
                columns: this.state.data,
                type: "donut" // default type of chart
              }}
              legend={{
                show: true, //hide legend
                position: "right"
              }}
              padding={{
                bottom: 0,
                top: 0
              }}
            />
          </Card.Body>
        </Card>
      </Grid.Col>
    );
  }
}

export default ChartMunicipios;
