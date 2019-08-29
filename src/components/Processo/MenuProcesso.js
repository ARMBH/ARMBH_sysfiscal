import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button, Page, Grid, List, Badge } from "tabler-react";
import {
  QUERY_TOTAL_HISTORICOS,
  QUERY_TOTAL_DOCUMENTOS
} from "./ProcessoQueries";
import { toast } from "react-toastify";

class MenuProcesso extends Component {
  constructor(props) {
    super();
    this.state = {
      total_historicos: 0,
      total_documentos: 0
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
        }
      );
    } else {
      this.props.history.push("/listaprocessos");
      toast.error(
        "Processo não encontrado ou você não possui permissão para visualizar este processo."
      );
    }
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
        }
      }
    });
  }

  render() {
    const { match } = this.props;
    const { id, total_historicos, total_documentos } = this.state;
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
              active={match.path.includes("processo")}
            >
              Informações básicas
            </List.GroupItem>
            <List.GroupItem
              className="d-flex align-items-center"
              to={"/interessados/" + id}
              icon="users"
              RootComponent={NavLink}
              active={match.path.includes("interessados")}
            >
              Interessados
            </List.GroupItem>
            <List.GroupItem
              to={"/documentos/" + id}
              className="d-flex align-items-center"
              icon="file"
              RootComponent={NavLink}
              active={match.path.includes("documentos")}
            >
              Documentos{" "}
              <Badge className="ml-auto badge badge-primary">
                {total_documentos}
              </Badge>
            </List.GroupItem>
            <List.GroupItem
              to="/email"
              className="d-flex align-items-center"
              icon="tag"
            >
              Vistorias
            </List.GroupItem>
            <List.GroupItem
              to={"/historico/" + id}
              className="d-flex align-items-center"
              icon="monitor"
              RootComponent={NavLink}
              active={match.path.includes("historico")}
            >
              Histórico{" "}
              <Badge className="ml-auto badge badge-primary">
                {total_historicos}
              </Badge>
            </List.GroupItem>
          </List.Group>
          <div className="mt-6">
            <Button
              RootComponent="a"
              href="/email"
              block={true}
              color="secondary"
            >
              Agendar Vistoria
            </Button>

            <Button
              RootComponent="a"
              href="/email"
              block={true}
              color="secondary"
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
