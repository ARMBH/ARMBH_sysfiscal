import React, { Component } from "react";
import { Icon, Button } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_INTERESSADOS, DELETE_DOCUMENTO } from "./InteressadoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import logar from "../Historico/HistoricoLog";

class ListaInteressados extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleDelete(id, name) {
    if (
      window.confirm("Deseja realmente excluir o interessado " + name + "?")
    ) {
      let motivo = window.prompt("Por qual motivo deseja excluir?");
      this.props.client.mutate({
        mutation: DELETE_DOCUMENTO,
        variables: { id: id },
        update: (cache, data) => {
          let message =
            "Interessado " + id + " " + name + " excluído com sucesso";
          if (motivo) message = message + ". Motivo: " + motivo;
          toast.success(message);
          logar.logar(this.props.client, this.props.id, 1, message);
        }
      });
    } else {
      toast.error("Interessado não será deletado.");
    }
  }

  render() {
    let { id, title } = this.props;
    if (!title) title = "";
    let cardTitle = "";

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    //const { auth } = this.props;
    //const userLogado = auth.getSub();

    return (
      <Query
        pollInterval={3000}
        query={QUERY_INTERESSADOS}
        variables={{ processo_id: id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          //console.log(data.processos_interessados);
          if (data.processos_interessados.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.processos_interessados.length +
              " interessado";
            if (data.processos_interessados.length > 1)
              cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
            //console.log(data.documentos);
          } else cardTitle = "Sem interessados";
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.processos_interessados.length > 0 ? (
                  <Table
                    cards={true}
                    striped={true}
                    responsive={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader />
                        <Table.ColHeader>Nome</Table.ColHeader>
                        <Table.ColHeader>CPF</Table.ColHeader>
                        <Table.ColHeader>E-mail</Table.ColHeader>
                        <Table.ColHeader>Tipo</Table.ColHeader>
                        <Table.ColHeader>Endereço</Table.ColHeader>
                        <Table.ColHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.processos_interessados.map((documento, index) => (
                        <Table.Row key={index}>
                          <Table.Col>
                            {documento.interessado.tratamento}
                          </Table.Col>
                          <Table.Col> {documento.interessado.name} </Table.Col>
                          <Table.Col>{documento.interessado.cpf}</Table.Col>
                          <Table.Col> {documento.interessado.email}</Table.Col>
                          <Table.Col>
                            {documento.interessado.origem.name}
                          </Table.Col>
                          <Table.Col>
                            {documento.interessado.endereco_id ? (
                              <React.Fragment>
                                <span
                                  data-for={documento.id + "vis"}
                                  data-tip={
                                    "Visualizar endereço do interessado."
                                  }
                                >
                                  <ReactTooltip id={documento.id + "vis"} />
                                  <Button size="sm" color="success">
                                    Visualizar
                                  </Button>
                                </span>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <span
                                  data-for={documento.id + "add"}
                                  data-tip={
                                    "Cadastrar endereço do interessado."
                                  }
                                >
                                  <ReactTooltip id={documento.id + "add"} />
                                  <Button size="sm" color="secondary">
                                    Adicionar
                                  </Button>
                                </span>
                              </React.Fragment>
                            )}
                          </Table.Col>
                          <Table.Col>
                            <Button.List>
                              <Button size="sm" color="secondary">
                                Editar
                              </Button>
                              <Button size="sm" color="danger">
                                Excluir
                              </Button>
                            </Button.List>
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum interessado cadastrado.</Card.Body>
                )}
              </Card>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaInteressados;
