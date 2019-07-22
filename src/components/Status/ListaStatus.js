import React, { Component } from "react";
import Moment from "moment";
import MomentComponent from "react-moment";
import { Badge, Icon, Button, Tag } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_PROCESSOS_STATUS, DELETE_STATUS } from "./StatusQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";
import DocumentoDownload from "../Documento/DocumentoDownload";
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
    const { id, name, status, due_date } = documento;
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
            "Status " +
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

  render() {
    let { id, title } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    const { auth } = this.props;

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    const userLogado = auth.getSub();

    return (
      <Query
        pollInterval={3000}
        query={QUERY_PROCESSOS_STATUS}
        variables={{ processoId: id }}
      >
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
              " documento";
            if (data.processos_status.length > 1) cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
            //console.log(data.processos_status);
          } else cardTitle = "Sem processos_status";
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
                            <MomentComponent fromNow>
                              {documento.due_date}
                            </MomentComponent>
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
                            Moment().diff(documento.created_at, "hours") <
                              24 ? (
                              <React.Fragment>
                                {" "}
                                <span
                                  data-for={documento.user.id}
                                  data-tip={
                                    "Este status pode ser deletado em até 24 horas. Já se passaram " +
                                    Moment().diff(
                                      documento.created_at,
                                      "hours"
                                    ) +
                                    " horas desde sua criação."
                                  }
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
              <Button.List align="right">{this.tituloTabela()}</Button.List>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaStatus;
