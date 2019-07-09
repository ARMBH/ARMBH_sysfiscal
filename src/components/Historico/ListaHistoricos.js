import React, { Component } from "react";
import Moment from "moment";

import { Badge } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_HISTORICOS } from "./HistoricoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";

class ListaHistoricos extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let { id, title } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    return (
      <Query
        pollInterval={500}
        query={QUERY_HISTORICOS}
        variables={{ processoId: id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.historicos.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.historicos.length +
              " histórico";
            if (data.historicos.length > 1) cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
          } else cardTitle = "Sem históricos";
          //console.log(cardTitle);
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.historicos.length > 0 ? (
                  <Table
                    cards={true}
                    striped={true}
                    responsive={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader />
                        <Table.ColHeader>Descrição</Table.ColHeader>
                        <Table.ColHeader>Tipo</Table.ColHeader>
                        <Table.ColHeader>Responsável</Table.ColHeader>
                        <Table.ColHeader>Criado em</Table.ColHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.historicos.map((documento, index) => (
                        <Table.Row key={index}>
                          <Table.Col>{index + 1}</Table.Col>
                          <Table.Col>{documento.title}</Table.Col>
                          <Table.Col>
                            <Badge color="info">{documento.tipo}</Badge>
                          </Table.Col>
                          <Table.Col>{documento.user.name}</Table.Col>
                          <Table.Col>
                            {Moment().diff(documento.updated_at, "hours") <
                            24 ? (
                              <React.Fragment>
                                <Badge color="success">Recente</Badge>{" "}
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                            <DataPorExtenso data={documento.updated_at} />
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum documento encontrado.</Card.Body>
                )}
              </Card>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaHistoricos;
