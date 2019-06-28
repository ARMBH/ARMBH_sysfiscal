import React, { Component } from "react";
import Moment from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Button, Page, Grid, Badge } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_PROCESSOS } from "./ProcessoQueries";
//import { toast } from 'react-toastify';
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
    const { id, title } = this.state;
    let { auth } = this.props;
    const userLogado = auth.getSub();

    let contentTitle = "Lista de todos os processos";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Mostrando todos os processos";
    if (id) cardTitle = title + "";

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <Grid.Col>
              <div style={{ padding: "1rem" }}>
                <Button.List align="right">
                  <Button
                    color="success"
                    icon="file-plus"
                    onClick={() => this.props.history.push("/novoprocesso/")}
                  >
                    Adicionar Novo processo
                  </Button>
                </Button.List>
              </div>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row cards deck>
            <Card title={cardTitle}>
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
                            <Table.ColHeader>Criado por</Table.ColHeader>
                            <Table.ColHeader>Status</Table.ColHeader>
                            <Table.ColHeader>Criado em</Table.ColHeader>
                            <Table.ColHeader>Últ. atualização</Table.ColHeader>
                            <Table.ColHeader />
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {data.processos.map((processo, index) => (
                            <Table.Row key={index}>
                              <Table.Col>{processo.id}</Table.Col>
                              <Table.Col>{processo.title}</Table.Col>
                              <Table.Col>{processo.user.name}</Table.Col>
                              <Table.Col>
                                {Moment().diff(processo.created_at, "hours") <
                                24 ? (
                                  <Badge color="success">Novo</Badge>
                                ) : (
                                  ""
                                )}
                              </Table.Col>
                              <Table.Col>
                                <DataPorExtenso data={processo.created_at} />
                              </Table.Col>
                              <Table.Col>
                                <DataPorExtenso data={processo.updated_at} />
                              </Table.Col>
                              <Table.Col>
                                {userLogado === processo.user.id ? (
                                  <Button
                                    size="sm"
                                    color="primary"
                                    icon="edit"
                                    onClick={() =>
                                      this.gotoProcesso(processo.id)
                                    }
                                  />
                                ) : (
                                  <Button
                                    size="sm"
                                    color="secondary"
                                    icon="eye"
                                    onClick={() =>
                                      this.gotoProcesso(processo.id)
                                    }
                                  />
                                )}
                              </Table.Col>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </React.Fragment>
                  );
                }}
              </Query>
            </Card>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ListaProcessos;
