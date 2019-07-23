import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import {
  QUERY_PROCESSO,
  EDIT_PROCESSO,
  ADD_PROCESSO,
  QUERY_ORIGEMS,
  QUERY_DEMANDANTES,
  QUERY_MUNICIPIOS
} from "./ProcessoQueries";
import { ADD_STATUS } from "../Status/StatusQueries";
import logar from "../Historico/HistoricoLog";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import ListaDocumentos from "../Documento/ListaDocumentos";
import ListaStatus from "../Status/ListaStatus";
import ListaHistoricos from "../Historico/ListaHistoricos";
import ListaEnderecos from "../Endereco/ListaEnderecos";
import HistoricoAdiciona from "../Historico/HistoricoAdiciona";
import DataPorExtenso from "../Utils/DataPorExtenso";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { toast } from "react-toastify";
//import { Link } from "react-router-dom";
// Relativos à data:
import Moment from "react-moment";
import MomentPure from "moment";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt-BR", ptBR);

class ProcessoForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      due_date: ""
    };
  }

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
            this.setState({ id: "" });
            this.props.history.push("/processo/todos");
            return false;
          } else {
            this.setState({
              ...data.data.processos[0],
              oldState: data.data.processos[0]
            });
          }
        }
      }
    });
  }

  setStatus(processoId) {
    const due_date =
      MomentPure()
        .utc()
        .format("YYYY-MM-DD[T]HH:mm:ss") + ".000000+00:00";
    this.props.client.mutate({
      mutation: ADD_STATUS,
      variables: {
        processo_id: processoId,
        status_id: 1,
        name: "Abertura de Processo",
        due_date: due_date
      },
      update: (cache, data) => {
        if (data) {
          console.log("Setado Status");
        }
      }
    });
  }

  componentDidMount() {
    //Parametros do Routes.js
    const { param } = this.props.match.params;
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);

    //Caso haja demanda
    const demanda = paramsUrl.get("demanda");
    if (demanda) console.log(demanda);
    if (parseInt(param, 10) > 0) {
      this.setState(
        {
          id: param
        },
        () => {
          this.getProcesso(param);
        }
      );
    }
  }

  handleChangeData = e => {
    this.setState({ due_date: e });
  };

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (this.state.id) {
      let alterado = false;
      let message = "Processo " + this.state.id + " editado:";

      if (this.state.name !== this.state.oldState.name) {
        alterado = true;
        message = message + "\n- Empreendimento alterado ";
      }

      if (this.state.origem_id !== this.state.oldState.origem_id) {
        alterado = true;
        message = message + "\n- Origem alterada ";
      }

      if (this.state.demandante_id !== this.state.oldState.demandante_id) {
        alterado = true;
        message = message + "\n- Demandante alterado ";
      }

      if (this.state.municipio_id !== this.state.oldState.municipio_id) {
        alterado = true;
        message = message + "\n- Município alterado ";
      }

      if (this.state.description !== this.state.oldState.description) {
        alterado = true;
        message = message + "\n- Descrição Alterada ";
      }

      toast.success(message.substring(0, message.length - 1));
      this.getProcesso(this.state.id);
      if (alterado) logar.logar(this.props.client, this.state.id, 1, message);
    } else {
      toast.success(
        data.insert_processos.returning[0].name + " criado com sucesso"
      );
      this.setState(
        {
          ...data.insert_processos.returning[0]
        },
        () => {
          logar.logar(
            this.props.client,
            data.insert_processos.returning[0].id,
            5,
            "Criação do Processo"
          );
          this.setStatus(data.insert_processos.returning[0].id);
          this.props.history.push(
            "/processo/" + data.insert_processos.returning[0].id
          );
        }
      );
    }
  };

  render() {
    //Declara variaveis do state/props para facilitar
    const {
      id,
      name,
      origem_id,
      description,
      created_at,
      user,
      municipio_id,
      demandante_id
    } = this.state;
    let { auth } = this.props;

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    const userLogado = auth.getSub();
    let disableForm = true;

    if (!id || (user && user.id === userLogado)) disableForm = false;
    else disableForm = true;

    //Altera o título de acordo com o Edição/Adição de Processo
    let contentTitle = "Novo Processo";
    if (id) contentTitle = "Processo nº " + id;

    let cardTitle = "Cadastro de Novo Processo";
    if (id) cardTitle = name + "";

    //Altera a mutation a ser utilizada de acordo com o Edição/Adição de Processo
    //Caso seja de criação de NOVO processo impede o setState de ser chamado após redirecionamento da edição do processo
    let mutation = ADD_PROCESSO;
    let mutationType = "add";
    if (id) {
      mutation = EDIT_PROCESSO;
      mutationType = "edit";
    }

    return (
      <React.Fragment>
        <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
          {(mutationProcesso, { loading, error }) => {
            return (
              <SiteWrapper {...this.props}>
                <Page.Content title={contentTitle}>
                  <Page.Card title={cardTitle}>
                    <Grid.Row cards deck>
                      <Grid.Col>
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            let variables = {
                              name: name,
                              description: description,
                              origem_id: origem_id,
                              demandante_id: demandante_id,
                              municipio_id: municipio_id
                            };

                            if (id) {
                              variables.id = id;
                              /**
                              $updated_at: timestamptz
                              variables.updated_at =
                                MomentPure()
                                  .utc()
                                  .format("YYYY-MM-DD[T]HH:mm:ss") +
                                ".000000+00:00";
                               */
                            } else {
                              variables.status_id = 1;
                            }

                            mutationProcesso({
                              variables: variables
                            })
                              .then(res => {
                                //console.log(res);
                                if (!res.errors) {
                                  if (mutationType === "edit") {
                                    /**
                                    this.setState({
                                      updated_at: variables.updated_at
                                    });
                                     */
                                  }
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
                          <Form.Group label="Empreendimento">
                            <Form.Input
                              disabled={disableForm}
                              value={name}
                              name="name"
                              placeholder="Digite um título..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
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
                                      {data.origems.map((origem, index) => (
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
                          <Form.Group label="Demandante">
                            <Form.Select
                              disabled={disableForm}
                              name="demandante_id"
                              value={demandante_id}
                              onChange={this.handleChange}
                            >
                              <option value="0">Selecione um demandante</option>
                              <Query query={QUERY_DEMANDANTES}>
                                {({ loading, error, data }) => {
                                  if (loading) return "Carregando...";
                                  if (error) return `Erro! ${error.message}`;
                                  return (
                                    <React.Fragment>
                                      {data.demandantes.map((item, index) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </React.Fragment>
                                  );
                                }}
                              </Query>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group label="Município">
                            <Form.Select
                              disabled={disableForm}
                              name="municipio_id"
                              value={municipio_id}
                              onChange={this.handleChange}
                            >
                              <option value="0">Selecione um município</option>
                              <Query query={QUERY_MUNICIPIOS}>
                                {({ loading, error, data }) => {
                                  if (loading) return "Carregando...";
                                  if (error) return `Erro! ${error.message}`;
                                  return (
                                    <React.Fragment>
                                      {data.municipios.map((item, index) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </React.Fragment>
                                  );
                                }}
                              </Query>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group
                            label={
                              <Form.Label
                                aside={
                                  description
                                    ? description.length + "/1000"
                                    : "0/1000"
                                }
                              >
                                Descrição
                              </Form.Label>
                            }
                          >
                            <Form.Textarea
                              disabled={disableForm}
                              name="description"
                              value={description}
                              placeholder="Descreva este processo (opcional)"
                              rows={6}
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          {id ? (
                            <React.Fragment>
                              <Form.Group label="Criado por">
                                {user ? user.name : "Carregando..."}
                              </Form.Group>
                              <Form.Group label="Criado em">
                                <DataPorExtenso data={created_at} />{" "}
                                <Tag color="info">
                                  <Moment fromNow>{created_at}</Moment>
                                </Tag>
                              </Form.Group>
                            </React.Fragment>
                          ) : (
                            ""
                          )}
                          {error && (
                            <Alert type="danger">
                              Erro ao salvar Processo.
                            </Alert>
                          )}
                          {id ? (
                            <React.Fragment>
                              <Button.List align="right">
                                {!disableForm ? (
                                  <React.Fragment>
                                    <Button
                                      outline
                                      color="warning"
                                      icon="chevrons-left"
                                      onClick={() =>
                                        this.props.history.push(
                                          "/listaprocessos/"
                                        )
                                      }
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      icon="edit"
                                      type="submit"
                                      color="primary"
                                      className="ml-auto"
                                    >
                                      {loading
                                        ? "Carregando..."
                                        : "Editar Processo"}
                                    </Button>
                                  </React.Fragment>
                                ) : (
                                  <Tag color="secondary">
                                    {loading
                                      ? "Carregando..."
                                      : "Apenas Visualização"}
                                  </Tag>
                                )}
                              </Button.List>
                            </React.Fragment>
                          ) : (
                            <Button
                              icon="check"
                              type="submit"
                              color="success"
                              className="ml-auto"
                            >
                              {loading
                                ? "Carregando..."
                                : "Adicionar Novo Processo"}
                            </Button>
                          )}
                        </Form>
                      </Grid.Col>
                    </Grid.Row>
                  </Page.Card>
                  {id ? ( //Início da parte de Baixo quando o Processo já existe
                    <React.Fragment>
                      <Page.Card>
                        <Form.Group label="Status">
                          <ListaStatus id={id} title={name} {...this.props} />
                        </Form.Group>
                      </Page.Card>
                      <Page.Card>
                        <Form.Group label="Endereço">
                          <ListaEnderecos id={id} title={name} />
                        </Form.Group>
                      </Page.Card>
                      <Page.Card>
                        <Form.Group label="Documentos">
                          <ListaDocumentos
                            id={id}
                            title={name}
                            {...this.props}
                          />
                        </Form.Group>
                      </Page.Card>
                      <Page.Card>
                        <Form.Group label="Comentários">
                          <ListaHistoricos id={id} title={name} type={3} />
                        </Form.Group>
                        <HistoricoAdiciona
                          client={this.props.client}
                          processo_id={id}
                        />
                      </Page.Card>
                      <Page.Card>
                        <Form.Group label="Histórico">
                          <ListaHistoricos id={id} title={name} />
                        </Form.Group>
                      </Page.Card>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  <Button
                    icon="chevrons-left"
                    onClick={() => this.props.history.push("/listaprocessos/")}
                  >
                    Voltar para a lista
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

export default ProcessoForm;
