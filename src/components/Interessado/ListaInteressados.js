import React, { Component } from "react";
import { Table, Card } from "tabler-react";
import { QUERY_INTERESSADOS, DELETE_DOCUMENTO } from "./InteressadoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";

import logar from "../Historico/HistoricoLog";
import InteressadoRow from "./InteressadoRow";

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
    let { id, title, cpf } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    //console.log(cpf + "processo" + id);
    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    //const { auth } = this.props;
    //const userLogado = auth.getSub();
    let variables = {};
    if (cpf) {
      variables.cpf = cpf;
    } else {
      variables.processo_id = id;
    }

    return (
      <Query
        pollInterval={3000}
        query={QUERY_INTERESSADOS}
        variables={variables}
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
                        <Table.ColHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.processos_interessados.map((documento, index) => (
                        <InteressadoRow
                          key={index + "interes" + documento.interessado.cpf}
                          index={index}
                          documento={documento}
                          processo_id={id}
                          {...this.props}
                        />
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
