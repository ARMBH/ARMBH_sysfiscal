import React, { Component } from "react";
import { Table, Card } from "tabler-react";
import { QUERY_INTERESSADOS } from "./InteressadoQueries";
import { Query } from "react-apollo";
import InteressadoRow from "./InteressadoRow";

class ListaInteressados extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let { id, title, cpf } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    let variables = {};
    if (cpf) {
      variables.cpf = cpf;
    } else {
      variables.processo_id = id;
    }

    return (
      <Query
        fetchPolicy="no-cache"
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
