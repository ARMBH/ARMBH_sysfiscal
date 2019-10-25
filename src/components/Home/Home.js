import React, { Component } from "react";
import PropTypes from "prop-types";
//import moment from 'moment';
import TodoPrivateWrapper from "../Todo/TodoPrivateWrapper";

import ChartMunicipio from "../Charts/ChartMunicipio";
import ChartStatus from "../Charts/ChartStatus";
import WidgetProcessos from "../WidgetsProcessos/WidgetProcessos";
import WidgetHistoricos from "../WidgetsHistoricos/WidgetHistoricos";
//import Loading from '../Loading/Loading';
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid, Card } from "tabler-react";

//import auth from "../Auth/Auth";
//import gql from 'graphql-tag';

class App extends Component {
  logout() {
    this.props.auth.logout();
  }

  render() {
    let { auth } = this.props;
    let role = auth.getRolePayload();
    if (!role)
      setTimeout(() => {
        role = auth.getRolePayload();
        this.setState({ last_update: new Date() });
      }, 5000);

    const { param } = this.props.match.params;
    //console.log(param);
    if (param === "logout") {
      console.log(param);
      this.logout();
      alert("Sair!");
    }

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title="Página Inicial">
          {role && role[0] === "admin" ? "Perfil: Admin" : ""}
          <Grid.Row>
            <Grid.Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Próximos Prazos</Card.Title>
                </Card.Header>
                <WidgetProcessos
                  isMine={false}
                  proximosAVencer={true}
                  client={this.props.client}
                  userId={auth.getSub()}
                />
              </Card>
            </Grid.Col>
            <Grid.Col lg={6}>
              <ChartMunicipio client={this.props.client} />
              <ChartStatus client={this.props.client} />
            </Grid.Col>
          </Grid.Row>

          <Grid.Row cards={true}>
            <Grid.Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Últimos históricos</Card.Title>
                </Card.Header>
                <WidgetHistoricos
                  isMine={true}
                  client={this.props.client}
                  userId={auth.getSub()}
                />
              </Card>
            </Grid.Col>
            <Grid.Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Tarefas Pessoais</Card.Title>
                </Card.Header>
                <TodoPrivateWrapper
                  client={this.props.client}
                  userId={auth.getSub()}
                />
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default App;
