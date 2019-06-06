import React, { Component } from "react";
import PropTypes from "prop-types";
//import moment from 'moment';

import TodoPublicWrapper from "../Todo/TodoPublicWrapper";
import TodoPrivateWrapper from "../Todo/TodoPrivateWrapper";
import OnlineUsers from "../OnlineUsers/OnlineUsers";

//import Loading from '../Loading/Loading';
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Text,
  Table,
  Alert,
  Progress,
  colors,
  Dropdown,
  Button,
  StampCard,
  StatsCard,
  ProgressCard,
  Badge
} from "tabler-react";

import auth from "../Auth/Auth";
//import gql from 'graphql-tag';

class App extends Component {
  render() {
    /*
		if (!this.state.session) {
			return (
				<div>
					<Loading color="#4286f4" type="spinningBubbles" />
				</div>
			);
		}
		*/
    return (
      <SiteWrapper {...this.props}>
        <Page.Content title="Página Inicial">
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
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-2}
                total="$95"
                label="Daily earnings"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-1}
                total="621"
                label="Products"
              />
            </Grid.Col>
            <Grid.Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Processos designados a você</Card.Title>
                </Card.Header>
                <TodoPrivateWrapper
                  client={this.props.client}
                  userId={auth.getSub()}
                />
              </Card>
            </Grid.Col>

            <Grid.Col md={6}>
              <Alert type="primary">
                <Alert.Link
                  href={
                    process.env.NODE_ENV === "production"
                      ? "https://tabler.github.io/tabler-react/documentation"
                      : "/documentation"
                  }
                >
                  Read our documentation
                </Alert.Link>{" "}
                with code samples.
              </Alert>
              <Grid.Row>
                <Grid.Col sm={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Chart title</Card.Title>
                    </Card.Header>
                    <Card.Body />
                  </Card>
                </Grid.Col>
                <Grid.Col sm={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Chart title</Card.Title>
                    </Card.Header>
                    <Card.Body />
                  </Card>
                </Grid.Col>
                <Grid.Col sm={6}>
                  <ProgressCard
                    header="New feedback"
                    content="62"
                    progressColor="red"
                    progressWidth={28}
                  />
                </Grid.Col>
                <Grid.Col sm={6}>
                  <ProgressCard
                    header="Today profit"
                    content="$652"
                    progressColor="green"
                    progressWidth={84}
                  />
                </Grid.Col>
                <Grid.Col sm={6}>
                  <ProgressCard
                    header="Users online"
                    content="76"
                    progressColor="yellow"
                    progressWidth={34}
                  />
                </Grid.Col>
              </Grid.Row>
            </Grid.Col>
            <Grid.Col sm={6} lg={3}>
              <StampCard
                color="blue"
                icon="dollar-sign"
                header={
                  <a href="#">
                    132 <small>Sales</small>
                  </a>
                }
                footer={"12 waiting payments"}
              />
            </Grid.Col>
            <Grid.Col sm={6} lg={3}>
              <StampCard
                color="green"
                icon="shopping-cart"
                header={
                  <a href="#">
                    78 <small>Orders</small>
                  </a>
                }
                footer={"32 shipped"}
              />
            </Grid.Col>
            <Grid.Col sm={6} lg={3}>
              <StampCard
                color="red"
                icon="users"
                header={
                  <a href="#">
                    1,352 <small>Members</small>
                  </a>
                }
                footer={"163 registered today"}
              />
            </Grid.Col>
            <Grid.Col sm={6} lg={3}>
              <StampCard
                color="yellow"
                icon="message-square"
                header={
                  <a href="#">
                    132 <small>Comments</small>
                  </a>
                }
                footer={"16 waiting"}
              />
            </Grid.Col>
          </Grid.Row>

          <h1>Public todos</h1>
          <TodoPublicWrapper
            client={this.props.client}
            userId={auth.getSub()}
          />
          <OnlineUsers />
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
