import React, { Component } from "react";
import { Subscription } from "react-apollo";
import { Grid, ProgressCard } from "tabler-react";
import { SUBSCRIPTION_TOTAL_DEMANDAS } from "./DemandaQueries";

class DemandaWidget extends Component {
  render() {
    return (
      <Subscription subscription={SUBSCRIPTION_TOTAL_DEMANDAS}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Carregando...</div>;
          }
          if (error) {
            console.log(error);
            return <div>Erro ao carregar demandas</div>;
          }
          if (this.props.total === true) {
            return (
              <React.Fragment>
                <Grid.Col width={6} sm={4} lg={2}>
                  <ProgressCard
                    header="Nº de Demandas"
                    content={data.demandas_aggregate.aggregate.count}
                    progressColor="yellow"
                    //progressWidth={34}
                  />
                </Grid.Col>
              </React.Fragment>
            );
          }
        }}
      </Subscription>
    );
  }
}

export default DemandaWidget;
