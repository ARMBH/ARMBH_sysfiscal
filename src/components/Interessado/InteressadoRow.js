import React, { Component } from "react";
import { Button } from "tabler-react";
import { Table } from "tabler-react";
import BotaoInteressadoAddProcesso from "./BotaoInteressadoAddProcesso";

class InteressadoRow extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let { documento, index, processo_id, interessado } = this.props;
    //console.log(this.props);
    if (interessado) {
      index = index + "interessado";
      documento.interessado = documento;
    }
    return (
      <Table.Row key={index}>
        <Table.Col>{documento.interessado.tratamento}</Table.Col>
        <Table.Col> {documento.interessado.name} </Table.Col>
        <Table.Col>{documento.interessado.cpf}</Table.Col>
        <Table.Col> {documento.interessado.email}</Table.Col>
        <Table.Col>{documento.interessado.origem.name}</Table.Col>
        <Table.Col>
          <Button.List>
            {documento.interessado.endereco_id ? (
              <Button size="sm" color="success">
                Visualizar Endereço
              </Button>
            ) : (
              ""
            )}

            {processo_id ? (
              <BotaoInteressadoAddProcesso
                key={index + documento.interessado.cpf}
                processo_id={processo_id}
                interessado_id={documento.interessado.id}
                {...this.props}
              />
            ) : (
              ""
            )}
            <Button
              size="sm"
              icon="edit"
              color="primary"
              onClick={() =>
                this.props.history.push(
                  "/interessado/" + documento.interessado.id
                )
              }
            />
          </Button.List>
        </Table.Col>
      </Table.Row>
    );
  }
}

export default InteressadoRow;
