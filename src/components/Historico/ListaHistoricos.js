import React, { Component } from "react";
import Moment from "moment";

import { Badge } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_HISTORICOS, QUERY_HISTORICOS_TIPO } from "./HistoricoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";

class ListaHistoricos extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let { id, title, type } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    let mutation = QUERY_HISTORICOS;
    let variables = { processoId: id };

    if (type) {
      mutation = QUERY_HISTORICOS_TIPO;
      variables.historico_tipo = type;
    }

    return (
      <Query pollInterval={500} query={mutation} variables={variables}>
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
              " registro";
            if (data.historicos.length > 1) cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
          } else cardTitle = "Sem registros";
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
                          <Table.Col>
                            {documento.name.split("\n").map((item, key) => {
                              return (
                                <span key={key}>
                                  {item}
                                  <br />
                                </span>
                              );
                            })}
                          </Table.Col>
                          <Table.Col>
                            <Badge color={documento.historico_tipo.type}>
                              {documento.historico_tipo.name}
                            </Badge>
                          </Table.Col>
                          <Table.Col>{documento.user.name}</Table.Col>
                          <Table.Col>
                            {Moment().diff(documento.created_at, "hours") <
                            24 ? (
                              <React.Fragment>
                                <Badge color="success">Recente</Badge>{" "}
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                            <DataPorExtenso data={documento.created_at} />
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum registro encontrado.</Card.Body>
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
