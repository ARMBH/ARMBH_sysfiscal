import React, { Component } from "react";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid } from "tabler-react";
import { QUERY_DEMANDAS } from "./DemandaQueries";
import { Query } from "react-apollo";
import TabelaDemandas from "./TabelaDemandas";

class ListaDemandas extends Component {
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
    let { auth } = this.props;
    const userLogado = auth.getSub();

    let contentTitle = "Lista de todas as demandas";

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <Query query={QUERY_DEMANDAS} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return "Carregando...";
                if (error) return `Erro! ${error.message}`;
                //console.log(data);
                return (
                  <React.Fragment>
                    <TabelaDemandas
                      {...this.props}
                      size={data.demandas.length}
                      data={data.demandas}
                      userLogado={userLogado}
                      //categoria="Nova"
                    />
                  </React.Fragment>
                );
              }}
            </Query>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ListaDemandas;
