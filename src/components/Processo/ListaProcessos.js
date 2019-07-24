import React, { Component } from "react";
import Moment from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Button, Page, Grid, Badge } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_PROCESSOS_STATUS } from "./ProcessoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";
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

  atualizaLength(valor) {
    this.setState({ data_length: valor });
  }

  render() {
    const { id, name, data_length } = this.state;
    let { auth } = this.props;
    const userLogado = auth.getSub();

    let contentTitle = "Lista de todos os processos";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Nenhum processo encontrado";
    if (id) cardTitle = name + "";

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <Query query={QUERY_PROCESSOS_STATUS} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return "Carregando...";
                if (error) return `Erro! ${error.message}`;
                console.log(data);
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
