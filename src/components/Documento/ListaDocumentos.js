import React, { Component } from "react";
import Moment from "moment";

import { Badge, Icon, Button } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_DOCUMENTOS } from "./DocumentoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";
import DocumentoDownload from "../Documento/DocumentoDownload";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

class ListaDocumentos extends Component {
  constructor() {
    super();
    this.state = {};
  }

  tituloTabela() {
    const link = "/adicionardoc/" + this.props.id;
    return (
      <Link className="btn btn-primary ml-auto" to={link}>
        <Icon name="plus-circle" />
        Adicionar Novo Documento
      </Link>
    );
  }

  render() {
    let { id, title } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    return (
      <Query
        pollInterval={500}
        query={QUERY_DOCUMENTOS}
        variables={{ processoId: id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.documentos.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.documentos.length +
              " documento";
            if (data.documentos.length > 1) cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
            console.log(data.documentos);
          } else cardTitle = "Sem documentos";
          //console.log(cardTitle);
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.documentos.length > 0 ? (
                  <Table
                    cards={true}
                    striped={true}
                    responsive={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader>ID</Table.ColHeader>
                        <Table.ColHeader>Nome</Table.ColHeader>
                        <Table.ColHeader>Tipo</Table.ColHeader>
                        <Table.ColHeader>Tam.</Table.ColHeader>
                        <Table.ColHeader>Criado por</Table.ColHeader>
                        <Table.ColHeader>Criado em</Table.ColHeader>
                        <Table.ColHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.documentos.map((documento, index) => (
                        <Table.Row key={index}>
                          <Table.Col>{documento.id}</Table.Col>
                          <Table.Col> {documento.name} </Table.Col>
                          <Table.Col>
                            <Badge color="info">{documento.type}</Badge>
                          </Table.Col>
                          <Table.Col>{documento.size}</Table.Col>
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
                          <Table.Col>
                            <DocumentoDownload id={documento.id} />{" "}
                            {documento.description ? (
                              <span data-tip={documento.description}>
                                <Button color="secondary">
                                  <Icon name="help-circle" />
                                </Button>
                              </span>
                            ) : (
                              ""
                            )}
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum documento encontrado.</Card.Body>
                )}
              </Card>
              <Button.List align="right">{this.tituloTabela()}</Button.List>
              <ReactTooltip />
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaDocumentos;
