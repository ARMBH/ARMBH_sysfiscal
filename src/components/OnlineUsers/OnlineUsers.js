import React, { Component } from "react";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";

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
            return <div>Loading. Please wait...</div>;
          }
          if (error) {
            return <div>Error loading users</div>;
          }
          return (
            <div className="sliderMenu grayBgColor">
              <div className="sliderHeader">
                Usuários Online - {data.online_users.length}
              </div>
              {data.online_users.map((user, index) => {
                return (
                  <div key={user.user.name} className="userInfo">
                    <div className="userImg">
                      <i className="far fa-user" />
                    </div>
                    <div
                      data-test={index + "_" + user.name}
                      className="userName"
                    >
                      {user.user.name}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Subscription>
    );
  }
}

export default OnlineUsers;
