import React, { Component } from "react";
import { Icon, Button } from "tabler-react";
import { Table, Card } from "tabler-react";
import {
  QUERY_INTERESSADOS,
  DELETE_DOCUMENTO,
  QUERY_PROCESSO_INTERESSADO,
  INSERT_PROCESSO_INTERESSADO,
  DELETE_PROCESSO_INTERESSADO
} from "./InteressadoQueries";
import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import logar from "../Historico/HistoricoLog";

class BotaoInteressadoAddProcesso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "secondary",
      statusInteressado: false
    };
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
          this.setState({ statusInteressado: true });
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

  insertInteressadoProcesso(processo_id, interessado_id) {
    const query = INSERT_PROCESSO_INTERESSADO;

    this.props.client.mutate({
      mutation: query,
      variables: { processo_id: processo_id, interessado_id: interessado_id },
      update: (cache, data) => {
        if (this.mounted) {
          let interessado =
            data.data.insert_processos_interessados.returning[0];
          console.log(interessado);
          let message =
            interessado.interessado.origem.name +
            " " +
            interessado.interessado.name +
            " (" +
            interessado.interessado.cpf +
            ") adicionado com sucesso ao processo.";
          toast.success(message);
          logar.logar(this.props.client, this.props.processo_id, 1, message);
          this.setState({ statusInteressado: false });
        }
      }
    });
  }

  deleteInteressadoProcesso(processo_id, interessado_id) {
    const query = DELETE_PROCESSO_INTERESSADO;

    this.props.client.mutate({
      mutation: query,
      variables: { processo_id: processo_id, interessado_id: interessado_id },
      update: (cache, data) => {
        if (this.mounted) {
          if (data.data.delete_processos_interessados.affected_rows === 1) {
            console.log(this.state);
            let message =
              "Interessado " +
              this.state.interessado.name +
              " removido do Processo.";
            toast.success(message);
            logar.logar(this.props.client, this.props.processo_id, 1, message);
            this.setState({ statusInteressado: true });
          } else {
            toast.error("Erro ao remover interessado.");
          }
        }
      }
    });
  }

  handleClick(processo_id, interessado_id) {
    if (this.state.statusInteressado !== false) {
      this.insertInteressadoProcesso(processo_id, interessado_id);
    } else this.deleteInteressadoProcesso(processo_id, interessado_id);
  }

  getInteressadoProcesso(processo_id, interessado_id) {
    const query = QUERY_PROCESSO_INTERESSADO;
    this.props.client.mutate({
      mutation: query,
      variables: { processo_id, interessado_id },
      update: (cache, data) => {
        if (this.mounted) {
          if (data.data.processos_interessados.length === 0)
            this.setState({ statusInteressado: true });
          else
            this.setState({
              statusInteressado: false,
              ...data.data.processos_interessados[0]
            });
        }
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  componentDidMount() {
    this.mounted = true;
    let { processo_id, interessado_id } = this.props;
    this.getInteressadoProcesso(processo_id, interessado_id);
  }
  render() {
    let { processo_id, interessado_id } = this.props;
    let { color, statusInteressado } = this.state;
    let verbo = "";
    if (statusInteressado) {
      verbo = "Adicionar ao";
      color = "success";
    } else {
      color = "danger";
      verbo = "Remover do";
    }

    //sconsole.log(processo_id, interessado_id);
    return (
      <Button
        disabled={!this.mounted}
        size="sm"
        color={color}
        onClick={() => this.handleClick(processo_id, interessado_id)}
      >
        {verbo} Processo {processo_id}
      </Button>
    );
  }
}

export default BotaoInteressadoAddProcesso;
