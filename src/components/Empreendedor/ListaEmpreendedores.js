import React, { Component } from "react";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid } from "tabler-react";
import { QUERY_PROCESSOS_STATUS } from "./ProcessoQueries";
import { Query } from "react-apollo";
import TabelaProcessos from "./TabelaProcessos";

class ListaProcessos extends Component {
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

    let contentTitle = "Lista de todos os processos";

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <Query query={QUERY_PROCESSOS_STATUS} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return "Carregando...";
                if (error) return `Erro! ${error.message}`;
                return (
                  <React.Fragment>
                    <TabelaProcessos
                      {...this.props}
                      size={data.processos_status.length}
                      data={data.processos_status}
                      userLogado={userLogado}
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

export default ListaProcessos;
