import React, { Component } from "react";
import { QUERY_TOTAL_DEMANDAS } from "./DemandaQueries";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Badge } from "tabler-react";

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
      status_demanda: "Nova",
      origem_id: 3
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
                  {data.demandas_aggregate.aggregate.count} novas demandas
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
