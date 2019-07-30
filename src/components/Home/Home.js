import React, { Component } from "react";
import PropTypes from "prop-types";
//import moment from 'moment';
import TodoPrivateWrapper from "../Todo/TodoPrivateWrapper";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import ProcessoWidget from "../Processo/ProcessoWidget";
import ChartMunicipio from "../Charts/ChartMunicipio";
//import Loading from '../Loading/Loading';
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid, Card, StatsCard } from "tabler-react";

//import auth from "../Auth/Auth";
//import gql from 'graphql-tag';

class App extends Component {
  logout() {
    this.props.auth.logout();
  }

  render() {
    let { auth } = this.props;

    if (auth.getRolePayload()) console.log(auth.getRolePayload());

    const { param } = this.props.match.params;
    if (param === "logout") {
      this.logout();
      alert("Sair!");
    }

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title="Página Inicial">
          {/* <!-- INICIO ADMIN PERMISSAO widget -->*/}
          <Grid.Row cards={true}>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={6}
                total="43"
                label="New Tickets"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-3}
                total="17"
                label="Closed Today"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={9}
                total="7"
                label="New Replies"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={3}
                total="27.3k"
                label="Followers"
              />
            </Grid.Col>
            <ProcessoWidget total={true} />
            <OnlineUsers total={true} />
          </Grid.Row>
          {/* <!-- ONLINE widget -->*/}
          <Grid.Row>
            <Grid.Col lg={12}>
              <h4>Usuários Online</h4>
            </Grid.Col>
            <OnlineUsers total={false} />
          </Grid.Row>
          {/* <!-- FIM ONLINE widget -->*/}
          {/* <!-- FIM ADMIN PERMISSAO widget -->*/}
          <Grid.Row>
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
            <Grid.Col lg={6}>
              <ChartMunicipio client={this.props.client} />
            </Grid.Col>
          </Grid.Row>

          <Grid.Row cards={true}>
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
