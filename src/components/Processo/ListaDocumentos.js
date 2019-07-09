import React, { Component } from "react";
import Moment from "moment";

import { Badge, Icon } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_DOCUMENTOS } from "./ProcessoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import DataPorExtenso from "../Utils/DataPorExtenso";
import DocumentoDownload from "../Documento/DocumentoDownload";
import { Link } from "react-router-dom";

class ListaDocumentos extends Component {
  constructor() {
    super();
    this.state = {};
  }

  tituloTabela() {
    const link = "/adicionardoc/" + this.props.id;
    return (
      <Link className="btn btn-outline-primary ml-auto" to={link}>
        <Icon name="plus-circle" />
        Adicionar Novo Documento
      </Link>
    );
  }

  render() {
    const { id } = this.props;
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
          if (data.documentos.length > 0)
            cardTitle = "Mostrando " + data.documentos.length + " documentos";
          else cardTitle = "Nenhum documento encontrado";
          //console.log(cardTitle);
          return (
            <React.Fragment>
              <Card title={this.tituloTabela()}>
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
                          <Table.Col>{documento.name}</Table.Col>
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
                            <DocumentoDownload id={documento.id} />
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

export default ListaDocumentos;
