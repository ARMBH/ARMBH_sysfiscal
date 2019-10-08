import React, { Component } from "react";
import { QUERY_TOTAL_DEMANDAS } from "./DemandaQueries";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import { Button } from "tabler-react";

class BotaoContadorDemandas extends Component {
  constructor() {
    super();
    this.state = {
      last_update: ""
    };
  }

  componentDidMount() {
    //console.log(Date());
    this.setState({ last_update: Date() });
  }

  render() {
    const variables = {
      status_demanda: this.props.status_demanda,
      origem_id: this.props.origem_id
    };

    return (
      <Query
        query={QUERY_TOTAL_DEMANDAS}
        pollInterval={10000}
        variables={variables}
      >
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.demandas_aggregate.aggregate.count < 1) return "";

          return (
            <React.Fragment>
              <Link to="/listademandas">
                <Button pill outline color="primary">
                  {data.demandas_aggregate.aggregate.count} demanda
                  {data.demandas_aggregate.aggregate.count > 1 ? "s" : ""}
                </Button>
              </Link>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default BotaoContadorDemandas;
