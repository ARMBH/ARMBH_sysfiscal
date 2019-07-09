import React, { Component } from "react";
import { Mutation } from "react-apollo";
import MomentPure from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import ListaDocumentos from "../Documento/ListaDocumentos";
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { QUERY_PROCESSO, EDIT_PROCESSO, ADD_PROCESSO } from "./ProcessoQueries";
import Moment from "react-moment";
import { toast } from "react-toastify";
import DataPorExtenso from "../Utils/DataPorExtenso";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt-BR", ptBR);

class ProcessoForm extends Component {
  constructor() {
    super();
    this.state = {
      //id: '',
      title: "",
      origem_solicitacao: "",
      descricao: "",
      data_prazo: ""
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
    this.setState({ data_prazo: e });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (this.state.id) {
      let message = "Processo " + this.state.id + " editado com sucesso!";
      toast.success(message);
    } else {
      toast.success(
        data.insert_processos.returning[0].title + " criado com sucesso!"
      );
      this.setState(
        {
          ...data.insert_processos.returning[0]
        },
        () => {
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
      title,
      origem_solicitacao,
      descricao,
      created_at,
      updated_at,
      data_prazo,
      user,
      status
    } = this.state;
    let { auth } = this.props;

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    const userLogado = auth.getSub();
    let disableForm = true;

    if (!id || (user && user.id === userLogado)) disableForm = false;
    else disableForm = true;

    //Altera o título de acordo com o Edição/Adição de Processo
    let contentTitle = "Novo Processo";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Cadastro de Novo Processo";
    if (id) cardTitle = title + "";

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
                              title: title,
                              descricao: descricao,
                              origem_solicitacao: origem_solicitacao
                            };

                            if (id) {
                              variables.id = id;
                              variables.updated_at =
                                MomentPure()
                                  .utc()
                                  .format("YYYY-MM-DD[T]HH:mm:ss") +
                                ".000000+00:00";
                            } else {
                              variables.data_prazo = data_prazo;
                            }

                            mutationProcesso({
                              variables: variables
                            })
                              .then(res => {
                                //console.log(res);
                                if (!res.errors) {
                                  if (mutationType === "edit") {
                                    this.setState({
                                      updated_at: variables.updated_at
                                    });
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
                          <Form.Group label="Título">
                            <Form.Input
                              disabled={disableForm}
                              value={title}
                              name="title"
                              placeholder="Digite um título..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group label="Origem da Solicitação">
                            <Form.Input
                              disabled={disableForm}
                              value={origem_solicitacao}
                              name="origem_solicitacao"
                              placeholder="Digite a origem deste processo..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group
                            label={
                              <Form.Label
                                aside={
                                  descricao
                                    ? descricao.length + "/100"
                                    : "0/100"
                                }
                              >
                                Descrição
                              </Form.Label>
                            }
                          >
                            <Form.Textarea
                              disabled={disableForm}
                              name="descricao"
                              value={descricao}
                              placeholder="Descreva este processo (opcional)"
                              rows={6}
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          {!id ? (
                            <Form.Group label="Defina um Prazo">
                              <DatePicker
                                locale="pt-BR"
                                className="form-control"
                                selected={this.state.data_prazo}
                                name="data_prazo"
                                onChange={this.handleChangeData}
                                placeholderText="Escolha um prazo..."
                                dateFormat="dd/MM/yyyy"
                              />
                            </Form.Group>
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
                              <Form.Group label="Última atualização">
                                <DataPorExtenso data={updated_at} />{" "}
                                <Tag color="success">
                                  <Moment fromNow>{updated_at}</Moment>
                                </Tag>
                              </Form.Group>
                              <Form.Group label="Prazo">
                                <DataPorExtenso data={data_prazo} />{" "}
                                <Tag color="success">
                                  <Moment fromNow>{data_prazo}</Moment>
                                </Tag>
                              </Form.Group>
                              <Form.Group label="Status">
                                <Tag color="success">{status}</Tag>
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
                  {id ? (
                    <React.Fragment>
                      <Page.Card>
                        <Form.Group label="Documentos">
                          <ListaDocumentos id={id} title={title} />
                        </Form.Group>
                      </Page.Card>
                    </React.Fragment>
                  ) : (
                    "Não"
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
