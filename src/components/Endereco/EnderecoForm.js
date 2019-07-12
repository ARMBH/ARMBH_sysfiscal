import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
//import { QUERY_ENDERECO } from './ProcessoQueries';
import logar from "../Historico/HistoricoLog";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import ListaDocumentos from "../Documento/ListaDocumentos";
import ListaHistoricos from "../Historico/ListaHistoricos";
import HistoricoAdiciona from "../Historico/HistoricoAdiciona";
import DataPorExtenso from "../Utils/DataPorExtenso";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Alert, Tag, Icon } from "tabler-react";
import { toast } from "react-toastify";
// Relativos à data:
import MomentPure from "moment";
import Moment from "react-moment";

class EnderecoForm extends Component {
  constructor() {
    super();
    this.state = {
      uf: "",
      processo_id: "",
      logradouro: "",
      localidade: "",
      ibge: "",
      complemento: "",
      cep: "",
      bairro: "",
      area: ""
    };
  }

  componentDidMount() {
    const { param } = this.props.match.params;
    if (parseInt(param, 10) > 0) {
      this.setState(
        {
          processo_id: param
        },
        () => {
          console.log("this.getEndereco(param)");
        }
      );
    }
  }

  handleChange = e => {
    console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      uf,
      processo_id,
      logradouro,
      localidade,
      ibge,
      complemento,
      cep,
      bairro,
      area
    } = this.state;
    let contentTitle = "Endereço " + processo_id;
    let cardTitle = "Endereço cardTitle";
    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Page.Card title={cardTitle}>
            <Grid.Row cards deck>
              <Grid.Col>OPA</Grid.Col>
            </Grid.Row>
          </Page.Card>
          <Button
            icon="chevrons-left"
            onClick={() => this.props.history.push("/processo/" + processo_id)}
          >
            Voltar para a lista
          </Button>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default EnderecoForm;
