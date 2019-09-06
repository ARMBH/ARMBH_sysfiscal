import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import { QUERY_PROCESSO, QUERY_ORIGEMS } from "../Processo/ProcessoQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid } from "tabler-react";
import { toast } from "react-toastify";
import {
  ADD_INTERESSADO,
  QUERY_INTERESSADO,
  UPDATE_INTERESSADO,
  INSERT_PROCESSO_INTERESSADO
} from "./InteressadoQueries";
import logar from "../Historico/HistoricoLog";
import { validateEmail } from "../Utils/Validators";

class InteressadoForm extends Component {
  constructor() {
    super();
    this.state = {
      cpf: "",
      email: "",
      name: "",
      tratamento: "",
      origem_id: "",
      id: "",
      processo_id: "",
      disableForm: false,
      processo_name: ""
    };
  }

  componentDidMount() {
    //Envia para o Topo da página

    window.scrollTo(0, 0);
    const { param } = this.props.match.params;
    if (parseInt(param, 10) > 0) {
      this.setState(
        {
          id: param
        },
        () => {
          this.getInteressado(param);
        }
      );
    } else {
      toast.success("Cadastrar novo interessado.");
      //this.props.history.push("/listaprocessos");
    }
    console.log(this.props.location.state);
    if (this.props.location.state !== undefined) {
      this.setState({ cpf: this.props.location.state.cpf.split("%").join("") });
    }
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);
    //Caso haja demanda
    const processo = paramsUrl.get("processo");

    if (processo) {
      if (parseInt(processo, 10) > 0) {
        this.setState(
          {
            processo_id: processo
          },
          () => {
            this.getProcesso(processo);
          }
        );
      } else {
        //toast.error("Processo não encontrado.");
        //this.props.history.push("/listaprocessos");
      }
    }
  }

  handleChange = e => {
    //console.log(e.target.name + ": " + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
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
            this.setState({
              processo_id: data.data.processos[0].id,
              processo_name: data.data.processos[0].name
            });
          }
        }
      }
    });
  }

  getInteressado(id) {
    this.props.client.mutate({
      mutation: QUERY_INTERESSADO,
      variables: { id: id },
      update: (cache, data) => {
        if (data) {
          if (!data.data.interessados[0]) {
            console.log(
              "Interessado não encontrado ou você não possui permissão para visualizar este interessado."
            );
            toast.error(
              "Interessado não encontrado ou você não possui permissão para visualizar este interessado."
            );
            this.setState({ id: "" });
            this.props.history.push("/interessados");
            return false;
          } else {
            console.log(data.data.interessados[0]);
            this.setState({
              ...data.data.interessados[0]
            });
          }
        }
      }
    });
  }

  insertInteressadoProcesso(processo_id, interessado_id) {
    const query = INSERT_PROCESSO_INTERESSADO;

    this.props.client.mutate({
      mutation: query,
      variables: { processo_id: processo_id, interessado_id: interessado_id },
      update: (cache, data) => {
        if (true) {
          let interessado =
            data.data.insert_processos_interessados.returning[0];
          //console.log(interessado);
          let message =
            interessado.interessado.origem.name +
            " " +
            interessado.interessado.name +
            " (" +
            interessado.interessado.cpf +
            ") adicionado com sucesso ao processo.";
          toast.success(message);
          logar.logar(this.props.client, processo_id, 1, message);
        }
      }
    });
  }

  handleCompleted = data => {
    //this.getEndereco(this.state.processo_id);
    let message = "";
    if (data.insert_interessados) {
      message =
        "Interessado de CPF " +
        data.insert_interessados.returning[0].cpf +
        " cadastrado com sucesso!";
      this.setState({ id: data.insert_interessados.returning[0].id }, () => {
        toast.success(message);
        if (this.state.processo_id !== "") {
          this.insertInteressadoProcesso(
            this.state.processo_id,
            data.insert_interessados.returning[0].id
          );
          this.props.history.goBack();
        }
      });
    }

    if (data.update_interessados) {
      message =
        "Interessado de CPF " +
        data.update_interessados.returning[0].cpf +
        " alterado com sucesso!";
      this.setState({ id: data.update_interessados.returning[0].id });
      toast.success(message);
    }
    if (this.state.processo_id === "") this.props.history.goBack();
    //this.props.history.push("/processo/" + this.state.processo_id);
  };

  render() {
    const {
      cpf,
      email,
      name,
      tratamento,
      origem_id,
      processo_id,
      disableForm,
      processo_name,
      id
    } = this.state;

    let modo = "";
    //Caso haja um endereço já cadastrado, entrar no modo EDIÇÃO
    let mutation = ADD_INTERESSADO;
    //console.log(id);
    if (id) {
      //console.log('modo editar');
      modo = "Editar";
      mutation = UPDATE_INTERESSADO;
    } else {
      //console.log('modo add');
      modo = "Adicionar";
    }

    let contentTitle = modo + " interessado " + cpf;
    let cardTitle = modo + " interessado " + cpf;

    if (processo_id !== "") {
      cardTitle = cardTitle + ": " + processo_name;
      contentTitle = contentTitle + " ao processo " + processo_id;
    }
    return (
      <SiteWrapper {...this.props}>
        <React.Fragment>
          <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
            {(mutationInteressado, { loading, error }) => {
              return (
                <Page.Content title={contentTitle}>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();

                      let variables = {
                        cpf,
                        name: name,
                        tratamento,
                        email,
                        origem_id
                      };
                      //console.log(variables);
                      //if (modo === "Adicionar") variables.processo_id = processo_id;
                      if (modo === "Editar") variables.id = id;
                      if (!validateEmail(variables.email)) {
                        toast.error("Email inválido.");
                        return false;
                      }

                      mutationInteressado({
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
                          if (
                            e
                              .toString()
                              .includes(
                                'duplicate key value violates unique constraint "interessados_cpf_key"'
                              )
                          )
                            toast.error(
                              "Este CPF já está cadastrado na base de interessados."
                            );
                          else toast.error("Erro GraphQL: " + e);
                          //console.log("Erro GraphQL: " + e);
                        });
                    }}
                  >
                    <Page.Card title={cardTitle}>
                      <Grid.Row cards deck>
                        <Grid.Col>
                          <Grid.Row>
                            <Grid.Col width={3}>
                              <Form.Group label="Tratamento">
                                <Form.Input
                                  disabled={disableForm}
                                  value={tratamento}
                                  name="tratamento"
                                  placeholder="Digite um tratamento..."
                                  onChange={this.handleChange}
                                  type="text"
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={9}>
                              <Form.Group label="name">
                                <Form.Input
                                  disabled={disableForm}
                                  value={name}
                                  name="name"
                                  placeholder="Digite o name..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={9}>
                              <Form.Group label="E-mail">
                                <Form.Input
                                  disabled={disableForm}
                                  value={email}
                                  name="email"
                                  placeholder="Digite um email..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={3}>
                              <Form.Group label="CPF">
                                <Form.MaskedInput
                                  disabled={disableForm}
                                  value={cpf}
                                  name="cpf"
                                  placeholder="Digite um cpf..."
                                  onChange={this.handleChange}
                                  type="text"
                                  mask={[
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ".",
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ".",
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    "-",
                                    /\d/,
                                    /\d/
                                  ]}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col>
                          <Form.Group label="Origem">
                            <Form.Select
                              disabled={disableForm}
                              name="origem_id"
                              value={origem_id}
                              onChange={this.handleChange}
                            >
                              <option value="0">Selecione uma origem</option>
                              <Query query={QUERY_ORIGEMS}>
                                {({ loading, error, data }) => {
                                  if (loading) return "Carregando...";
                                  if (error) return `Erro! ${error.message}`;
                                  return (
                                    <React.Fragment>
                                      {data.origems.map(origem => (
                                        <option
                                          key={origem.id}
                                          value={origem.id}
                                        >
                                          {origem.name}
                                        </option>
                                      ))}
                                    </React.Fragment>
                                  );
                                }}
                              </Query>
                            </Form.Select>
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                      <Button.List align="right">
                        <Button
                          icon="edit"
                          type="submit"
                          color="primary"
                          className="ml-auto"
                          disabled={
                            cpf.length === 14 && cpf.slice(-1) !== "_"
                              ? false
                              : true
                          }
                        >
                          {loading ? "Carregando..." : modo + " Interessado"}
                        </Button>
                      </Button.List>
                    </Page.Card>
                  </Form>
                  {processo_id !== "" ? (
                    <React.Fragment>
                      <Button
                        icon="chevrons-left"
                        onClick={() =>
                          this.props.history.push(
                            "/processo/interessados/" + processo_id
                          )
                        }
                      >
                        Voltar para o processo {processo_id}
                      </Button>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </Page.Content>
              );
            }}
          </Mutation>
        </React.Fragment>
      </SiteWrapper>
    );
  }
}

export default InteressadoForm;
