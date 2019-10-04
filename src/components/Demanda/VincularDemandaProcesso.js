import React, { Component } from "react";
import { EDIT_DEMANDA, EDIT_PROCESSO_DEMANDA } from "./DemandaQueries";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Badge, Grid, Form } from "tabler-react";
import { toast } from "react-toastify";
import { QUERY_PROCESSOS } from "../Processo/ProcessoQueries";
import Moment from "moment";
import logar from "../Historico/HistoricoLog";

class VincularDemandaProcesso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: props.codigo,
      processo_id: "",
      jaDemanda: true
    };
  }

  componentDidMount() {
    //console.log(Date());
  }

  componentDidUpdate() {
    //console.log(this.props);
  }

  editaProcessoDemanda(processo_id, codigo) {
    this.props.client
      .mutate({
        mutation: EDIT_PROCESSO_DEMANDA,
        variables: {
          demanda_codigo: codigo,
          id: processo_id
        },
        update: (cache, data) => {
          //console.log(data);
          if (data.data.update_processos.returning) {
            //console.log(data);
            //Aqui tem que logar
            logar.logar(
              this.props.client,
              processo_id,
              1,
              "Demanda " +
                codigo +
                " vinculada ao processo: " +
                this.props.justificativa
            );

            toast.success(
              "Sucesso ao vincular a demanda " +
                codigo +
                " ao processo " +
                processo_id
            );

            setTimeout(() => {
              window.scrollTo(0, 0);
              this.props.history.push("/processo/" + processo_id);
            }, 2000);
          } else {
            toast.error("Erro ao vincular demanda.");
            return false;
          }
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
        return false;
      });
  }

  alteraDemanda(codigo, status_novo, justificativa) {
    this.props.client
      .mutate({
        mutation: EDIT_DEMANDA,
        variables: {
          codigo: codigo,
          status_demanda: status_novo,
          justificativa: justificativa
        },
        update: (cache, data) => {
          //console.log(data);
          if (data.data.update_demandas.returning) {
            //console.log(data);
            let variables = data.data.update_demandas.returning[0];
            this.setState({
              updated_at: variables.updated_at,
              status_demanda: variables.status_demanda,
              justificativa: variables.justificativa
            });
            //toast.success(codigo + ": " + status_novo + "!");
            this.editaProcessoDemanda(this.state.processo_id, codigo);
            return true;
          } else {
            toast.error("Erro ao alterar demanda.");
            return false;
          }
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
        return false;
      });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { codigo, processo_id, jaDemanda } = this.state;
    const variables = {
      status_demanda: "Nova",
      origem_id: 3
    };
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Col width={0}>
            <Form.Group label="Selecionar">
              <Form.Switch
                name="tandcs"
                value="tandcs"
                checked={jaDemanda}
                id={processo_id}
                onChange={() => this.setState({ jaDemanda: !jaDemanda })}
              />
            </Form.Group>
          </Grid.Col>
          <Grid.Col width={8}>
            <Form.Group label="Processo">
              <Form.Select
                name="processo_id"
                value={processo_id}
                onChange={this.handleChange}
              >
                <option value="0">
                  {jaDemanda
                    ? "Selecione um processo sem demandas"
                    : "Atenção! Os processos já possuem demandas"}
                </option>
                <Query query={QUERY_PROCESSOS} pollInterval={5000}>
                  {({ loading, error, data }) => {
                    if (loading) return "Carregando...";
                    if (error) return `Erro! ${error.message}`;
                    return (
                      <React.Fragment>
                        {data.processos.map(item => (
                          <React.Fragment>
                            {item.demanda_codigo && jaDemanda ? (
                              ""
                            ) : (
                              <option key={item.id} value={item.id}>
                                {item.id} {" / "}
                                {Moment(item.created_at).format("YYYY")} -{" "}
                                {item.name} (
                                {item.demanda_codigo
                                  ? item.demanda_codigo
                                  : "N/A"}
                                )
                              </option>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    );
                  }}
                </Query>
              </Form.Select>
            </Form.Group>
          </Grid.Col>
          <Grid.Col width={3}>
            <Form.Group label="Vincular">
              <Button
                disabled={
                  this.props.justificativa === null || processo_id === ""
                }
                icon="navigation"
                onClick={() => {
                  this.alteraDemanda(
                    codigo,
                    "Em Andamento",
                    this.props.justificativa
                  );
                }}
                color="success"
              >
                Vincular {processo_id}
              </Button>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </React.Fragment>
    );
  }
}

export default VincularDemandaProcesso;
