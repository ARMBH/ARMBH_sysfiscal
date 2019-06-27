import React, { Component } from "react";
//import PropTypes from 'prop-types';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import MomentPure from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_PROCESSOS } from "./ProcessoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";

class ListaProcessos extends Component {
  constructor() {
    super();
    this.state = {};
  }
  gotoProcesso(id) {
    this.props.history.push("/processo/" + id);
  }
  render() {
    const {
      id,
      title,
      origem_solicitacao,
      descricao,
      created_at,
      updated_at,
      user
    } = this.state;

    let contentTitle = "Lista de todos os processos";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Mostrando todos os processos";
    if (id) cardTitle = title + "";

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Page.Card title={cardTitle}>
            <Grid.Row cards deck>
              <Query query={QUERY_PROCESSOS} pollInterval={500}>
                {({ loading, error, data }) => {
                  if (loading) return "Carregando...";
                  if (error) return `Error! ${error.message}`;
                  return (
                    <React.Fragment>
                      <Table
                        cards={true}
                        striped={true}
                        responsive={true}
                        className="table-vcenter"
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.ColHeader>Nº</Table.ColHeader>
                            <Table.ColHeader>Descrição</Table.ColHeader>
                            <Table.ColHeader>Data</Table.ColHeader>
                            <Table.ColHeader>Últ.</Table.ColHeader>
                            <Table.ColHeader>Criado por</Table.ColHeader>
                            <Table.ColHeader />
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {data.processos.map((processo, index) => (
                            <Table.Row key={index}>
                              <Table.Col>{processo.id}</Table.Col>
                              <Table.Col>{processo.title}</Table.Col>
                              <Table.Col>
                                <DataPorExtenso data={processo.created_at} />
                              </Table.Col>
                              <Table.Col>
                                <DataPorExtenso data={processo.updated_at} />
                              </Table.Col>
                              <Table.Col>{processo.user.name}</Table.Col>
                              <Table.Col>
                                <Button
                                  onClick={() => this.gotoProcesso(processo.id)}
                                >
                                  Editar
                                </Button>
                              </Table.Col>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </React.Fragment>
                  );
                }}
              </Query>
            </Grid.Row>
          </Page.Card>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ListaProcessos;
