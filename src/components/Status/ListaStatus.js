import React, { Component } from "react";
import Moment from "moment";
import MomentComponent from "react-moment";
import { Icon, Button, Tag } from "tabler-react";
import { Table, Card } from "tabler-react";
import {
  QUERY_PROCESSOS_STATUS,
  QUERY_PROCESSOS_STATUS_ESPECIFICO,
  DELETE_STATUS
} from "./StatusQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import logar from "../Historico/HistoricoLog";

class ListaStatus extends Component {
  constructor() {
    super();
    this.state = {};
  }
  /**
  <Form.Group label="Prazo">
                                <DataPorExtenso data={due_date} />{" "}
                                <Tag color="success">
                                  <Moment fromNow>{due_date}</Moment>
                                </Tag>
                              </Form.Group>
                              <Form.Group label="Status">
                                {this.state.status ? (
                                  <Tag color={this.state.status.type}>
                                    {this.state.status.name}
                                  </Tag>
                                ) : (
                                  "Carregando..."
                                )}
                              </Form.Group>
  
   */

  tituloTabela() {
    const link = "/adicionarstatus/" + this.props.id;
    return (
      <Link className="btn btn-primary ml-auto" to={link}>
        <Icon name="plus-circle" />
        Adicionar Novo Status
      </Link>
    );
  }

  handleDelete(documento) {
    const { id, status, due_date, processo_id } = documento;
    const due_date_tratado = Moment(due_date).format("DD/MM/YYYY");
    if (
      window.confirm(
        "Deseja realmente excluir o status " +
          status.name +
          " em " +
          due_date_tratado +
          "?"
      )
    ) {
      let motivo = window.prompt("Por qual motivo deseja excluir?");
      this.props.client.mutate({
        mutation: DELETE_STATUS,
        variables: { id: id },
        update: (cache, data) => {
          let message =
            "Processo " +
            processo_id +
            " Status " +
            status.name +
            " de " +
            due_date_tratado +
            " excluído com sucesso";
          if (motivo) message = message + ". Motivo: " + motivo;
          toast.success(message);
          logar.logar(this.props.client, this.props.id, 5, message);
        }
      });
    } else {
      toast.error("Status não será deletado.");
    }
  }

  isToday(due_date) {
    //Se está no futuro
    if (Moment().diff(due_date, "hours") < 24) {
      //Se falta mais de 2 dias
      if (Moment().diff(due_date, "hours") < -48) return "success";

      //Se falta menos de 2 dias
      return "danger";
    }

    if (Moment().diff(due_date, "hours") > 24) {
      //Em breve
      return "secondary";
    }

    return "secondary";
  }

  render() {
    let { id, title, status_id } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    const { auth } = this.props;

    let mutation = QUERY_PROCESSOS_STATUS;
    let variables = { processoId: id };

    if (status_id) {
      mutation = QUERY_PROCESSOS_STATUS_ESPECIFICO;
      variables.status_id = status_id;
    }

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    const userLogado = auth.getSub();

    return (
      <Query pollInterval={3000} query={mutation} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.processos_status.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.processos_status.length +
              " status";
            if (data.processos_status.length > 1) cardTitle = cardTitle + "";
            cardTitle = cardTitle + ")";
            //console.log(data.processos_status);
          } else cardTitle = "Sem status";
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.processos_status.length > 0 ? (
                  <Table
                    cards={true}
                    striped={true}
                    responsive={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader>Status</Table.ColHeader>
                        <Table.ColHeader>Prazo</Table.ColHeader>
                        <Table.ColHeader>Responsável</Table.ColHeader>
                        <Table.ColHeader>Descrição</Table.ColHeader>
                        <Table.ColHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.processos_status.map((documento, index) => (
                        <Table.Row key={index}>
                          <Table.Col>
                            <Tag color={documento.status.type}>
                              {documento.status.name}
                            </Tag>
                          </Table.Col>
                          <Table.Col>
                            {" "}
                            {Moment(documento.due_date).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            <Tag color={this.isToday(documento.due_date)}>
                              <MomentComponent fromNow>
                                {documento.due_date}
                              </MomentComponent>
                            </Tag>
                          </Table.Col>
                          <Table.Col>{documento.user.name}</Table.Col>
                          <Table.Col>{documento.name}</Table.Col>
                          <Table.Col>
                            {documento.description ? (
                              <span
                                data-for={documento.name}
                                data-tip={documento.description}
                              >
                                <ReactTooltip id={documento.name} />
                                <Button color="secondary">
                                  <Icon name="help-circle" />
                                </Button>
                              </span>
                            ) : (
                              ""
                            )}
                            {userLogado === documento.user.id &&
                            documento.status.id !== 1 ? (
                              <React.Fragment>
                                <span
                                  data-for={documento.user.id}
                                  data-tip={"Excluir status."}
                                >
                                  <ReactTooltip id={documento.user.id} />

                                  <Button
                                    onClick={() => this.handleDelete(documento)}
                                    color="danger"
                                  >
                                    <Icon name="trash-2" />
                                  </Button>
                                </span>
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum status encontrado.</Card.Body>
                )}
              </Card>
              {status_id ? (
                ""
              ) : (
                <Button.List align="right">{this.tituloTabela()}</Button.List>
              )}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaStatus;
