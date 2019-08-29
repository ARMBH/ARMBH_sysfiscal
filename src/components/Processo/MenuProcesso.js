import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button, Page, Grid, List, Badge } from "tabler-react";
import {
  QUERY_TOTAL_HISTORICOS,
  QUERY_TOTAL_DOCUMENTOS,
  QUERY_TOTAL_STATUS_ID
} from "./ProcessoQueries";
import { toast } from "react-toastify";

class MenuProcesso extends Component {
  constructor(props) {
    super();
    this.state = {
      total_historicos: this.getLocalStorageFor("historicos"),
      total_documentos: this.getLocalStorageFor("documentos"),
      total_vistorias: this.getLocalStorageFor("vistorias")
    };
  }
  componentDidMount() {
    //Parametros do Routes.js
    const { param } = this.props.match.params;
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);

    //Caso haja demanda
    const demanda = paramsUrl.get("demanda");
    if (demanda) console.log(demanda);
    if (parseInt(param, 10) > 0) {
      this.setState(
        {
          id: param
        },
        () => {
          this.getTotalHistoricos(param);
          this.getTotalDocumentos(param);
          this.getTotalVistorias(param);
        }
      );
    } else {
      this.props.history.push("/listaprocessos");
      toast.error(
        "Processo não encontrado ou você não possui permissão para visualizar este processo."
      );
    }
  }

  getTotalVistorias(id) {
    this.props.client.mutate({
      mutation: QUERY_TOTAL_STATUS_ID,
      variables: {
        processo_id: id,
        status_id: 6
      },
      update: (cache, data) => {
        if (data) {
          this.setState({
            total_vistorias:
              data.data.processos_status_aggregate.aggregate.count
          });
          this.setLocalStorageFor("vistorias", this.state.total_vistorias);
        }
      }
    });
  }

  getTotalDocumentos(id) {
    this.props.client.mutate({
      mutation: QUERY_TOTAL_DOCUMENTOS,
      variables: {
        processo_id: id
      },
      update: (cache, data) => {
        if (data) {
          this.setState({
            total_documentos: data.data.documentos_aggregate.aggregate.count
          });
          this.setLocalStorageFor("documentos", this.state.total_documentos);
        }
      }
    });
  }

  getTotalHistoricos(id) {
    this.props.client.mutate({
      mutation: QUERY_TOTAL_HISTORICOS,
      variables: {
        processo_id: id
      },
      update: (cache, data) => {
        if (data) {
          this.setState({
            total_historicos: data.data.historicos_aggregate.aggregate.count
          });
          this.setLocalStorageFor("historicos", this.state.total_historicos);
        }
      }
    });
  }

  getLocalStorageFor(nome) {
    return localStorage.getItem(nome);
  }

  setLocalStorageFor(nome, valor) {
    localStorage.setItem(nome, valor);
  }

  render() {
    //const { match } = this.props;
    const {
      id,
      total_historicos,
      total_documentos,
      total_vistorias
    } = this.state;
    //console.log(this.props);

    return (
      <Grid.Col md={3}>
        <Page.Title className="mb-5">Processo nº {id}</Page.Title>
        <div>
          <List.Group transparent={true}>
            <List.GroupItem
              className="d-flex align-items-center"
              to={"/processo/" + id}
              icon="inbox"
              RootComponent={NavLink}
            >
              Informações básicas
            </List.GroupItem>
            <List.GroupItem
              className="d-flex align-items-center"
              to={"/processo/" + id}
              icon="users"
              RootComponent={NavLink}
            >
              Interessados
            </List.GroupItem>
            <List.GroupItem
              to={"/documentos/" + id}
              className="d-flex align-items-center"
              icon="file"
              RootComponent={NavLink}
            >
              Documentos{" "}
              <Badge className="ml-auto badge badge-primary">
                {total_documentos}
              </Badge>
            </List.GroupItem>
            <List.GroupItem
              to={"/vistorias/" + id}
              className="d-flex align-items-center"
              icon="tag"
              RootComponent={NavLink}
            >
              Vistorias{" "}
              <Badge className="ml-auto badge badge-primary">
                {" "}
                {total_vistorias}
              </Badge>
            </List.GroupItem>
            <List.GroupItem
              to={"/historico/" + id}
              className="d-flex align-items-center"
              icon="monitor"
              RootComponent={NavLink}
            >
              Histórico{" "}
              <Badge className="ml-auto badge badge-primary">
                {total_historicos}
              </Badge>
            </List.GroupItem>
          </List.Group>
          <div className="mt-6">
            <Button
              RootComponent={NavLink}
              to={"/adicionarvistoria/" + id}
              block={true}
              color="success"
            >
              Agendar Vistoria
            </Button>

            <Button
              RootComponent={NavLink}
              to={"/encerrarprocesso/" + id}
              block={true}
              color="danger"
            >
              Encerrar Processo
            </Button>
          </div>
        </div>
      </Grid.Col>
    );
  }
}

export default MenuProcesso;
