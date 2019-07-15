import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import axios from "axios";
import { QUERY_ENDERECO, ADD_ENDERECO, EDIT_ENDERECO } from "./EnderecoQueries";
import { QUERY_PROCESSO } from "../Processo/ProcessoQueries";
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
      id: "",
      uf: "",
      processo_id: "",
      logradouro: "",
      localidade: "",
      ibge: "",
      complemento: "",
      cep: "",
      bairro: "",
      area: "",
      disableForm: false,
      processo_name: ""
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
          this.getProcesso(param);
        }
      );
    } else {
      toast.error("Processo não encontrado.");
      this.props.history.push("/listaprocessos");
    }
  }

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeArea = e => {
    //console.log(e.target.name + e.target.value);
    let valor = e.target.value;
    valor = valor.replace(",", ".");
    this.setState({ [e.target.name]: valor });
  };

  handleChangeCep = e => {
    //console.log(e.target.value.replace(/[-_+()\s]/g, '').length);
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
            console.log("Preenche endereço.");
          });
        }
        this.setState({ disableForm: false });
      });
    }
  };

  getProcesso(processoId) {
    this.props.client.mutate({
      mutation: QUERY_PROCESSO,
      variables: { processoId: processoId },
      update: (cache, data) => {
        if (data) {
          if (!data.data.processos[0]) {
            console.log(
              "Processo não encontrado ou você não possui permissão para visualizar este processo."
            );
            toast.error(
              "Processo não encontrado ou você não possui permissão para visualizar este processo."
            );
            this.setState({ processo_id: "" });
            this.props.history.push("/listaprocessos");
            return false;
          } else {
            this.setState(
              {
                processo_id: data.data.processos[0].id,
                processo_name: data.data.processos[0].name
              },
              this.getEndereco(processoId)
            );
          }
        }
      }
    });
  }

  getEndereco(processoId) {
    this.props.client.mutate({
      mutation: QUERY_ENDERECO,
      variables: { processoId: processoId },
      update: (cache, data) => {
        if (data) {
          //console.log(data.data);
          if (!data.data.enderecos[0]) {
            toast.info(
              "Endereço não encontrado, cadastre um novo endereço para este processo."
            );
            return false;
          } else {
            //console.log(data.data.enderecos[0]);
            this.setState({
              ...data.data.enderecos[0]
            });
          }
        }
      }
    });
  }

  handleCompleted = data => {
    //this.getEndereco(this.state.processo_id);
    let message =
      "Endereço do Processo " +
      this.state.processo_id +
      " alterado com sucesso";
    toast.success(message);

    logar.logar(this.props.client, this.state.processo_id, 1, message);
    this.props.history.push("/processo/" + this.state.processo_id);
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
      disableForm,
      processo_name,
      id
    } = this.state;

    let modo = "";
    //Caso haja um endereço já cadastrado, entrar no modo EDIÇÃO
    let mutation = ADD_ENDERECO;
    if (id) {
      //console.log('modo editar');
      modo = "Editar";
      mutation = EDIT_ENDERECO;
    } else {
      //console.log('modo add');
      modo = "Adicionar";
    }

    let contentTitle = modo + " endereço " + processo_id;
    let cardTitle = modo + ":" + " " + processo_name;

    return (
      <React.Fragment>
        <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
          {(mutationEndereco, { loading, error }) => {
            return (
              <SiteWrapper {...this.props}>
                <Page.Content title={contentTitle}>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();

                      let areaTratada = area;
                      if (areaTratada === "") areaTratada = null;

                      let cepTratado = cep;
                      if (cepTratado === "") {
                        toast.error("O CEP não pode ser vazio.");
                        cepTratado = null;
                        return null;
                      }

                      let variables = {
                        area: areaTratada,
                        bairro,
                        cep: cepTratado,
                        complemento,
                        ibge,
                        localidade,
                        logradouro,
                        processo_id,
                        uf
                      };

                      mutationEndereco({
                        variables: variables
                      })
                        .then(res => {
                          //console.log(res);
                          if (!res.errors) {
                            //console.log(res);
                            //onCompleted é chamado caso entre aqui
                          } else {
                            // Erros code 200
                            toast.error("Erro 200: " + res);
                            console.log("Erro 200: " + res);
                          }
                        })
                        .catch(e => {
                          //Erro de GraphQL
                          toast.error("Erro GraphQL: " + e);
                          //console.log("Erro GraphQL: " + e);
                        });
                    }}
                  >
                    <Page.Card title={cardTitle}>
                      <Grid.Row cards deck>
                        <Grid.Col>
                          <Grid.Row>
                            <Grid.Col width={3}>
                              <Form.Group label="CEP">
                                <Form.MaskedInput
                                  disabled={disableForm}
                                  value={cep}
                                  name="cep"
                                  placeholder="Digite um CEP..."
                                  onChange={this.handleChangeCep}
                                  type="text"
                                  mask={[
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    "-",
                                    /\d/,
                                    /\d/,
                                    /\d/
                                  ]}
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={9}>
                              <Form.Group label="Bairro">
                                <Form.Input
                                  disabled={disableForm}
                                  value={bairro}
                                  name="bairro"
                                  placeholder="Digite o Bairro..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={9}>
                              <Form.Group label="Logradouro">
                                <Form.Input
                                  disabled={disableForm}
                                  value={logradouro}
                                  name="logradouro"
                                  placeholder="Digite um logradouro..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={3}>
                              <Form.Group label="Núm/Complemento">
                                <Form.Input
                                  disabled={disableForm}
                                  value={complemento}
                                  name="complemento"
                                  placeholder="Digite um complemento..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={9}>
                              <Form.Group label="Município">
                                <Form.Input
                                  disabled={disableForm}
                                  value={localidade}
                                  name="localidade"
                                  placeholder="Digite um Município..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={3}>
                              <Form.Group label="UF">
                                <Form.Input
                                  disabled={disableForm}
                                  value={uf}
                                  name="uf"
                                  placeholder="Digite um UF..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={12}>
                              <Form.Group label="Área (m²)">
                                <Form.Input
                                  disabled={disableForm}
                                  value={area || ""}
                                  name="area"
                                  placeholder="Digite a Área em m²"
                                  onChange={this.handleChangeArea}
                                  type="float"
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                      </Grid.Row>
                      <Button.List align="right">
                        <Button
                          icon="edit"
                          type="submit"
                          color="primary"
                          className="ml-auto"
                          disabled={disableForm}
                        >
                          {loading ? "Carregando..." : "Salvar Endereço"}
                        </Button>
                      </Button.List>
                    </Page.Card>
                  </Form>
                  <Button
                    icon="chevrons-left"
                    onClick={() =>
                      this.props.history.push("/processo/" + processo_id)
                    }
                  >
                    Voltar para o processo {processo_id}
                  </Button>
                </Page.Content>
              </SiteWrapper>
            );
          }}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default EnderecoForm;
