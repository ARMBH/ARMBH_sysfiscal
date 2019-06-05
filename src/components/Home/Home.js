import React, { Component } from "react";
import PropTypes from "prop-types";
//import moment from 'moment';

import TodoPublicWrapper from "../Todo/TodoPublicWrapper";
import TodoPrivateWrapper from "../Todo/TodoPrivateWrapper";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import { Navbar } from "react-bootstrap";

//import Loading from '../Loading/Loading';
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page } from "tabler-react";

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
        <Page.Content title="Blog Component">
          <div>
            <Navbar fluid className="removeMarBottom">
              <Navbar.Header className="navheader">
                <Navbar.Brand className="navBrand">
                  React Apollo Todo App
                </Navbar.Brand>
              </Navbar.Header>
            </Navbar>
            <div>
              <div className="col-xs-12 col-md-12 col-lg-9 col-sm-12 noPadd">
                <div>
                  <div className="col-md-6 col-sm-12">
                    <div className="wd95 addPaddTopBottom">
                      <div className="sectionHeader">Personal todos</div>
                      <TodoPrivateWrapper
                        client={this.props.client}
                        userId={auth.getSub()}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-6 col-sm-12 grayBgColor todoMainWrapper commonBorRight">
                    <div className="wd95 addPaddTopBottom">
                      <div className="sectionHeader">Public todos</div>
                      <TodoPublicWrapper
                        client={this.props.client}
                        userId={auth.getSub()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-lg-3 col-md-12 col-sm-12 noPadd">
                <OnlineUsers />
              </div>
            </div>
            <div className="footerWrapper">React Apollo Todo App</div>
          </div>
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
