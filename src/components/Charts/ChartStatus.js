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
    processos_status(
      order_by: { processo_id: asc, due_date: desc }
      distinct_on: processo_id
    ) {
      status_id
      status {
        id
        name
      }
    }
  }
`;

class ChartStatus extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  setData() {
    let dataChart = [];
    let temp = [];
    this.props.client.mutate({
      mutation: QUERY_PROCESSOS,
      update: (cache, data) => {
        if (data) {
          if (data.data.processos_status.length === 0) {
            console.log("Não há processos no período.");
            return false;
          } else {
            const processos = data.data.processos_status;
            processos.map((item, index) => {
              if (!temp[item.status_id]) {
                temp[item.status_id] = [];
                temp[item.status_id]["count"] = 0;
                temp[item.status_id]["name"] = item.status.name;
              }
              return (temp[item.status_id]["count"] =
                temp[item.status_id]["count"] + 1);
            });
            temp.map((item, index) => {
              let nomeColuna = item.name + ": " + item.count;
              let conjuntoItems = [nomeColuna, item.count];
              return dataChart.push(conjuntoItems);
            });
            this.setState({ data: dataChart });
          }
        }
      }
    });
  }

  componentDidMount() {
    this.setData();
  }

  render() {
    return (
      <Grid.Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Processos por Status</Card.Title>
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

export default ChartStatus;
