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
  QUERY_MUNICIPIOS,
  QUERY_STATUS,
  QUERY_STATUS_UNICO
} from "./ProcessoQueries";
import logar from "../Historico/HistoricoLog";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import ListaDocumentos from "../Documento/ListaDocumentos";
import ListaHistoricos from "../Historico/ListaHistoricos";
import DataPorExtenso from "../Utils/DataPorExtenso";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { toast } from "react-toastify";
// Relativos à data:
import MomentPure from "moment";
import Moment from "react-moment";
import DatePicker, { registerLocale } from "react-datepicker";
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
            this.setState(data.data.processos[0]);
          }
        }
      }
    });
  }

  componentDidMount() {
    const { param } = this.props.match.params;
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
    console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (this.state.id) {
      let message = "Processo " + this.state.id + " editado com sucesso";
      toast.success(message);
      logar.logar(this.props.client, this.state.id, "Processo", message);
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
            "Processo",
            "Criação do Processo"
          );
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
      due_date,
      user,
      status_id,
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
                              variables.status_id = status_id;
                              variables.due_date = due_date;
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
                          {!id ? (
                            <React.Fragment>
                              <Form.Group label="Status">
                                <Form.Select
                                  name="status_id"
                                  value={status_id}
                                  onChange={this.handleChange}
                                >
                                  <option value=""> Selecione um status</option>
                                  <Query query={QUERY_STATUS}>
                                    {({ loading, error, data }) => {
                                      if (loading) return "Carregando...";
                                      if (error)
                                        return `Erro! ${error.message}`;
                                      return (
                                        <React.Fragment>
                                          {data.status.map((item, index) => (
                                            <option
                                              key={item.id}
                                              value={item.id}
                                            >
                                              {item.name}
                                            </option>
                                          ))}
                                        </React.Fragment>
                                      );
                                    }}
                                  </Query>
                                </Form.Select>
                              </Form.Group>
                              <Form.Group label="Defina um Prazo">
                                <DatePicker
                                  locale="pt-BR"
                                  className="form-control"
                                  selected={this.state.due_date}
                                  name="due_date"
                                  onChange={this.handleChangeData}
                                  placeholderText="Escolha um prazo..."
                                  dateFormat="dd/MM/yyyy"
                                />
                              </Form.Group>
                            </React.Fragment>
                          ) : (
                            ""
                          )}
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
                              <Form.Group label="Prazo">
                                <DataPorExtenso data={due_date} />{" "}
                                <Tag color="success">
                                  <Moment fromNow>{due_date}</Moment>
                                </Tag>
                              </Form.Group>
                              <Form.Group label="Status">
                                <Query
                                  query={QUERY_STATUS_UNICO}
                                  variables={{ id: status_id }}
                                >
                                  {({ loading, error, data }) => {
                                    if (loading) return "Carregando...";
                                    if (error) return `Erro! ${error.message}`;
                                    return (
                                      <React.Fragment>
                                        <Tag color={data.status[0].type}>
                                          {data.status[0].name}
                                        </Tag>
                                      </React.Fragment>
                                    );
                                  }}
                                </Query>
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
                        <Form.Group label="Documentos">
                          <ListaDocumentos id={id} title={name} />
                        </Form.Group>
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
