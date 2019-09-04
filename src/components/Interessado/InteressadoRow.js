import React, { Component } from "react";
import { Icon, Button } from "tabler-react";
import { Table, Card } from "tabler-react";
import { QUERY_INTERESSADOS, DELETE_DOCUMENTO } from "./InteressadoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import logar from "../Historico/HistoricoLog";
import BotaoInteressadoAddProcesso from "./BotaoInteressadoAddProcesso";

class InteressadoRow extends Component {
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
    let { documento, index, processo_id, interessado } = this.props;
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
          {documento.interessado.endereco_id ? (
            <React.Fragment>
              <span
                data-for={documento.id + "vis"}
                data-tip={"Visualizar endereço do interessado."}
              >
                <ReactTooltip id={documento.id + "vis"} />
                <Button size="sm" color="success">
                  Visualizar
                </Button>
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span
                data-for={documento.id + "add"}
                data-tip={"Cadastrar endereço do interessado."}
              >
                <ReactTooltip id={documento.id + "add"} />
                <Button size="sm" color="secondary">
                  Endereço
                </Button>
              </span>
            </React.Fragment>
          )}
        </Table.Col>
        <Table.Col>
          <Button.List>
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
            <Button size="sm" color="secondary">
              Editar
            </Button>
          </Button.List>
        </Table.Col>
      </Table.Row>
    );
  }
}

export default InteressadoRow;
