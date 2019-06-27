import React, { Component } from "react";
//import PropTypes from 'prop-types';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import MomentPure from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { QUERY_PROCESSO, EDIT_PROCESSO, ADD_PROCESSO } from "./ProcessoQueries";
import Moment from "react-moment";
//import 'moment-timezone';
//import 'moment/locale/pt-br';
import { toast } from "react-toastify";
import DataPorExtenso from "../Utils/DataPorExtenso";
import DataDesdeAgora from "../Utils/DataDesdeAgora";

class ProcessoForm extends Component {
  constructor() {
    super();
    this.state = {
      //id: '',
      title: "",
      origem_solicitacao: "",
      descricao: ""
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
    const {
      id,
      title,
      origem_solicitacao,
      descricao,
      created_at,
      updated_at,
      user
    } = this.state;
    let { auth } = this.props;
    const userLogado = auth.getSub();
    let contentTitle = "Novo Processo";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Cadastro de Novo Processo";
    if (id) cardTitle = title + "";

    let mutation = ADD_PROCESSO;

    if (id) mutation = EDIT_PROCESSO;

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
                            }

                            mutationProcesso({
                              variables: variables
                            })
                              .then(res => {
                                //console.log(res);
                                if (!res.errors) {
                                  this.setState({
                                    updated_at: variables.updated_at
                                  });
                                  //onCompleted é chamado aqui
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
                              value={title}
                              name="title"
                              placeholder="Digite um título..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group label="Origem da Solicitação">
                            <Form.Input
                              value={origem_solicitacao}
                              name="origem_solicitacao"
                              placeholder="Digite a origem deste processo..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group
                            label={
                              <Form.Label aside={descricao.length + "/100"}>
                                Descrição
                              </Form.Label>
                            }
                          >
                            <Form.Textarea
                              name="descricao"
                              value={descricao}
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
                              <Form.Group label="Última atualização">
                                <DataPorExtenso data={updated_at} />{" "}
                                <Tag color="success">
                                  <Moment fromNow>{updated_at}</Moment>
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
                                {user && user.id === userLogado ? (
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
