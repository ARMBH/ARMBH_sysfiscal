import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button, Page, Grid, List, Badge } from "tabler-react";
import { QUERY_TOTAL_HISTORICOS } from "./ProcessoQueries";

class MenuProcesso extends Component {
  constructor(props) {
    super();
    this.state = {
      total_historicos: 0
    };
  }
  componentDidMount() {}

  componentWillReceiveProps() {
    this.setState({ id: this.props.id }, () =>
      this.getHistoricos(this.props.id)
    );
  }

  getHistoricos(id) {
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
    const { id, total_historicos } = this.state;
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
              Cadastro
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
              to="/email"
              className="d-flex align-items-center"
              icon="file"
            >
              Documentos
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
