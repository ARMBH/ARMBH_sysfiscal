import React, { Component } from "react";
import { Table, Card } from "tabler-react";
import { QUERY_INTERESSADOS_ADMIN } from "./InteressadoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";

import logar from "../Historico/HistoricoLog";
import InteressadoRow from "./InteressadoRow";

class ListaInteressadosAdmin extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    let cardTitle = "Lista de interessados";
    return (
      <Query pollInterval={3000} query={QUERY_INTERESSADOS_ADMIN}>
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          //console.log(data.processos_interessados);
          if (data.interessados.length > 0) {
            cardTitle = "Lista de interessados";
          } else cardTitle = "Sem interessados";
          //console.log(data.interessados);
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.interessados.length > 0 ? (
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
                      {data.interessados.map((documento, index) => (
                        <InteressadoRow
                          key={index + "interes" + documento.cpf}
                          index={index}
                          documento={documento}
                          interessado
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

export default ListaInteressadosAdmin;
