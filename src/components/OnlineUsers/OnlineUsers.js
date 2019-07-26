import React, { Component } from "react";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";
import { Grid, StampCard, ProgressCard } from "tabler-react";
import auth from "../Auth/Auth";

const SUBSCRIPTION_ONLINE_USERS = gql`
  subscription getOnlineUsers {
    online_users(order_by: { user: { name: asc } }) {
      id
      user {
        name
      }
    }
  }
`;

class OnlineUsers extends Component {
  render() {
    return (
      <Subscription subscription={SUBSCRIPTION_ONLINE_USERS}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Carregando...</div>;
          }
          if (error) {
            return <div>Error loading users</div>;
          }
          if (this.props.total === true) {
            return (
              <React.Fragment>
                <Grid.Col width={6} sm={4} lg={2}>
                  <ProgressCard
                    header="Usuários Online"
                    content={data.online_users.length}
                    progressColor="yellow"
                    //progressWidth={34}
                  />
                </Grid.Col>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                {data.online_users.map((user, index) => {
                  return (
                    <Grid.Col sm={6} lg={3} key={index}>
                      <StampCard
                        color="blue"
                        icon="user-plus"
                        header={<span>{user.user.name}</span>}
                        footer={<span>Ordem: {index + 1}</span>}
                      />
                    </Grid.Col>
                  );
                })}
              </React.Fragment>
            );
          }
        }}
      </Subscription>
    );
  }
}

export default OnlineUsers;
