import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { QUERY_STATUS, ADD_STATUS, EDIT_STATUS } from "./StatusQueries";
import { QUERY_PROCESSO } from "../Processo/ProcessoQueries";
import { Query } from "react-apollo";
import logar from "../Historico/HistoricoLog";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid } from "tabler-react";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "moment";
registerLocale("pt-BR", ptBR);

class StatusForm extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      status_id: "",
      processo_id: "",
      processo_name: "",
      //created_at: '',
      due_date: "",
      name: ""
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

  handleChangeData = e => {
    this.setState({ due_date: e });
  };

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
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

  handleCompleted = data => {
    let message =
      "Status do Processo " +
      this.state.processo_id +
      " adicionado com sucesso: " +
      this.state.name;
    toast.success(message);
    this.props.history.push("/processo/" + this.state.processo_id);
  };

  render() {
    const {
      id,
      status_id,
      processo_id,
      created_at,
      due_date,
      name,
      processo_name
    } = this.state;

    let modo = "";
    //Caso haja um status já cadastrado, entrar no modo EDIÇÃO
    let mutation = ADD_STATUS;
    if (id) {
      //console.log('modo editar');
      modo = "Editar";
      mutation = EDIT_STATUS;
    } else {
      //console.log('modo add');
      modo = "Adicionar";
    }

    let contentTitle = modo + " status " + processo_id;
    let cardTitle = modo + " novo status ao processo " + processo_name;

    return (
      <SiteWrapper {...this.props}>
        <React.Fragment>
          <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
            {(mutationProcesso_Status, { loading, error }) => {
              return (
                <Page.Content title={contentTitle}>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();

                      let variables = {
                        status_id,
                        processo_id,
                        due_date,
                        name
                      };

                      mutationProcesso_Status({
                        variables: variables
                      })
                        .then(res => {
                          if (!res.errors) {
                            const {
                              name: name_processo,
                              status: status_processo,
                              due_date
                            } = res.data.insert_processos_status.returning[0];
                            //console.log(res);
                            //onCompleted é chamado caso entre aqui
                            let message =
                              "Novo status do Processo " +
                              processo_id +
                              ": " +
                              status_processo.name +
                              ". " +
                              name_processo +
                              ". Prazo: " +
                              Moment(due_date).format("DD/MM/YYYY");
                            //console.log(message);
                            logar.logar(
                              this.props.client,
                              this.state.processo_id,
                              5,
                              message
                            );
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
                            <Grid.Col width={6}>
                              <React.Fragment>
                                <Form.Group label="Status">
                                  <Form.Select
                                    name="status_id"
                                    value={status_id}
                                    onChange={this.handleChange}
                                  >
                                    <Query query={QUERY_STATUS}>
                                      {({ loading, error, data }) => {
                                        if (loading) return "Carregando...";
                                        if (error)
                                          return `Erro! ${error.message}`;
                                        return (
                                          <React.Fragment>
                                            <option value="">
                                              {" "}
                                              Selecione um status
                                            </option>
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
                              </React.Fragment>
                            </Grid.Col>
                            <Grid.Col width={6}>
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
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={12}>
                              <Form.Group label="Justificativa">
                                <Form.Input
                                  //disabled={disableForm}
                                  value={name}
                                  name="name"
                                  placeholder="Digite a justificativa..."
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                      </Grid.Row>
                      <Button.List align="right">
                        <Button
                          icon="plus-circle"
                          type="submit"
                          color="primary"
                          className="ml-auto"
                          //disabled={disableForm}
                        >
                          {loading ? "Carregando..." : "Adicionar Status"}
                        </Button>
                      </Button.List>
                    </Page.Card>
                  </Form>
                </Page.Content>
              );
            }}
          </Mutation>
        </React.Fragment>
      </SiteWrapper>
    );
  }
}

export default StatusForm;
