import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import axios from "axios";
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
      area: "",
      disableForm: false
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
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeCep = e => {
    console.log(e.target.value.replace(/[-_+()\s]/g, "").length);
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value.replace(/[-_+()\s]/g, "").length === 8) {
      this.setState({ disableForm: true });
      toast.info("Buscando CEP " + e.target.value);
      const apiEnd = "https://viacep.com.br/ws/" + e.target.value + "/json/";
      axios.get(apiEnd).then(res => {
        let data = res.data;
        if (data.erro) {
          toast.error("Erro ao buscar CEP.");
        } else {
          //console.log(data);
          toast.success("Endereço encontrado!");
          this.setState({ ...data }, () => {
            console.log(this.state);
          });
        }
        this.setState({ disableForm: false });
      });
    }
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
      area,
      disableForm
    } = this.state;
    let contentTitle = "Endereço " + processo_id;
    let cardTitle = "Endereço cardTitle";
    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Page.Card title={cardTitle}>
            <Grid.Row cards deck>
              <Grid.Col>
                <Form.Group label="CEP">
                  <Form.MaskedInput
                    disabled={disableForm}
                    value={cep}
                    name="cep"
                    placeholder="Digite um CEP..."
                    onChange={this.handleChangeCep}
                    type="text"
                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                  />
                </Form.Group>
                <Grid.Row>
                  <Grid.Col width={9}>
                    <Form.Group label="Logradouro">
                      <Form.Input
                        disabled={disableForm}
                        value={logradouro}
                        name="logradouro"
                        placeholder="Digite um título..."
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <Form.Group label="Complemento">
                      <Form.Input
                        disabled={disableForm}
                        value={complemento}
                        name="complemento"
                        placeholder="Digite um título..."
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
              </Grid.Col>
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
