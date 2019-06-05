// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Site,
  Nav,
  Grid,
  List,
  Button,
  RouterContextProvider
} from "tabler-react";
import "tabler-react/dist/Tabler.css";
import type { NotificationProps } from "tabler-react";
import auth from "../Auth/Auth";
import gql from "graphql-tag";

const authLogo = require("../../images/auth.png");
let promessa;
type Props = {|
  +children: React.Node
|};

type State = {|
  notificationsObjects: Array<NotificationProps>
|};

type subNavItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +LinkComponent?: React.ElementType,
  +useExact?: boolean
|};

type navItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +active?: boolean,
  +LinkComponent?: React.ElementType,
  +subItems?: Array<subNavItem>,
  +useExact?: boolean
|};

const navBarItems: Array<navItem> = [
  {
    value: "Home",
    to: "/home",
    icon: "home",
    LinkComponent: NavLink,
    useExact: true
  },
  {
    value: "Interface",
    icon: "box",
    subItems: [
      {
        value: "Cards Design",
        to: "/cards",
        LinkComponent: NavLink
      },
      { value: "Charts", to: "/charts", LinkComponent: NavLink },
      {
        value: "Pricing Cards",
        to: "/pricing-cards",
        LinkComponent: NavLink
      }
    ]
  },
  {
    value: "Components",
    icon: "calendar",
    subItems: [
      { value: "Maps", to: "/maps", LinkComponent: NavLink },
      { value: "Icons", to: "/icons", LinkComponent: NavLink },
      { value: "Store", to: "/store", LinkComponent: NavLink },
      { value: "Blog", to: "/blog", LinkComponent: NavLink }
    ]
  },
  {
    value: "Pages",
    icon: "file",
    subItems: [
      { value: "Profile", to: "/profile", LinkComponent: NavLink },
      { value: "Login", to: "/login", LinkComponent: NavLink },
      {
        value: "Register",
        to: "/register",
        LinkComponent: NavLink
      },
      {
        value: "Forgot password",
        to: "/forgot-password",
        LinkComponent: NavLink
      },
      { value: "400 error", to: "/400", LinkComponent: NavLink },
      { value: "401 error", to: "/401", LinkComponent: NavLink },
      { value: "403 error", to: "/403", LinkComponent: NavLink },
      { value: "404 error", to: "/404", LinkComponent: NavLink },
      { value: "500 error", to: "/500", LinkComponent: NavLink },
      { value: "503 error", to: "/503", LinkComponent: NavLink },
      { value: "Email", to: "/email", LinkComponent: NavLink },
      {
        value: "Empty page",
        to: "/empty-page",
        LinkComponent: NavLink
      },
      { value: "RTL", to: "/rtl", LinkComponent: NavLink }
    ]
  },
  {
    value: "Forms",
    to: "/form-elements",
    icon: "check-square",
    LinkComponent: NavLink
  },
  {
    value: "Gallery",
    to: "/gallery",
    icon: "image",
    LinkComponent: NavLink
  },
  {
    icon: "file-text",
    value: "Documentation",
    to:
      process.env.NODE_ENV === "production"
        ? "https://tabler.github.io/tabler-react/documentation"
        : "/documentation"
  }
];

const accountDropdownProps = {
  avatarURL: "./demo/faces/female/25.jpg",
  name: "Jane Pearson",
  description: "Administrator",
  options: [
    { icon: "user", value: "Profile" },
    { icon: "settings", value: "Settings" },
    { icon: "mail", value: "Inbox", badge: "6" },
    { icon: "send", value: "Message" },
    { isDivider: true },
    { icon: "help-circle", value: "Need help?" },
    { icon: "log-out", value: "Sign out" }
  ]
};

class SiteWrapper extends React.Component<Props, State> {
  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }

  updateLastSeen() {
    //console.log('Ping last_seen');
    // Use the apollo client to run a mutation to update the last_seen value
    const UPDATE_LASTSEEN_MUTATION = gql`
      mutation updateLastSeen($now: timestamptz!) {
        update_users(where: {}, _set: { last_seen: $now }) {
          affected_rows
        }
      }
    `;
    this.props.client.mutate({
      mutation: UPDATE_LASTSEEN_MUTATION,
      variables: { now: new Date().toISOString() }
    });
  }

  componentDidMount() {
    const { renewSession } = auth;

    if (localStorage.getItem("isLoggedIn") === "true") {
      // eslint-disable-next-line
      const lastSeenMutation = setInterval(
        this.updateLastSeen.bind(this),
        5000
      );

      renewSession().then(data => {
        this.setState({ session: true });
        console.log("Ok - sessão renovada");
      });
    } else {
      window.location.href = "/";
    }
  }
  state = {
    notificationsObjects: [
      {
        unread: true,
        avatarURL: "demo/faces/male/41.jpg",
        message: (
          <React.Fragment>
            <strong>Nathan</strong> pushed new commit: Fix page load performance
            issue.
          </React.Fragment>
        ),
        time: "10 minutes ago"
      },
      {
        unread: true,
        avatarURL: "demo/faces/female/1.jpg",
        message: (
          <React.Fragment>
            <strong>Alice</strong> started new task: Tabler UI design.
          </React.Fragment>
        ),
        time: "1 hour ago"
      },
      {
        unread: false,
        avatarURL: "demo/faces/female/18.jpg",
        message: (
          <React.Fragment>
            <strong>Rose</strong> deployed new version of NodeJS REST Api // V3
          </React.Fragment>
        ),
        time: "2 hours ago"
      }
    ]
  };

  render(): React.Node {
    const notificationsObjects = this.state.notificationsObjects || [];
    const unreadCount = this.state.notificationsObjects.reduce(
      (a, v) => a || v.unread,
      false
    );
    const { isAuthenticated } = this.props.auth;
    //if (isAuthenticated()) alert('To on');
    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "Tabler React",
          imageURL: authLogo,
          navItems: (
            <Nav.Item type="div" className="d-none d-md-flex">
              <Button
                href="https://github.com/tabler/tabler-react"
                target="_blank"
                outline
                size="sm"
                RootComponent="a"
                color="primary"
              >
                Source code
              </Button>
              {!isAuthenticated() && (
                <Button
                  id="qsLoginBtn"
                  bsStyle="primary"
                  className="btn-margin logoutBtn"
                  onClick={this.login.bind(this)}
                >
                  Log In
                </Button>
              )}
              {isAuthenticated() && (
                <Button
                  id="qsLogoutBtn"
                  bsStyle="primary"
                  className="btn-margin logoutBtn"
                  onClick={this.logout.bind(this)}
                >
                  Log Out
                </Button>
              )}
            </Nav.Item>
          ),
          notificationsTray: {
            notificationsObjects,
            markAllAsRead: () =>
              this.setState(
                () => ({
                  notificationsObjects: this.state.notificationsObjects.map(
                    v => ({
                      ...v,
                      unread: false
                    })
                  )
                }),
                () =>
                  setTimeout(
                    () =>
                      this.setState({
                        notificationsObjects: this.state.notificationsObjects.map(
                          v => ({
                            ...v,
                            unread: true
                          })
                        )
                      }),
                    5000
                  )
              ),
            unread: unreadCount
          },
          accountDropdown: accountDropdownProps
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
          links: [
            <a>First Link</a>,
            <a>Second Link</a>,
            <a>Third Link</a>,
            <a>Fourth Link</a>,
            <a>Five Link</a>,
            <a>Sixth Link</a>,
            <a>Seventh Link</a>,
            <a>Eigth Link</a>
          ],
          note:
            "Premium and Open Source dashboard template with responsive and high quality UI. For Free!",
          copyright: (
            <React.Fragment>
              Copyright © 2019
              <a href="."> Tabler-react</a>. Theme by
              <a
                href="https://codecalm.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                codecalm.net
              </a>{" "}
              All rights reserved.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a href="./docs/index.html">Documentation</a>
                  </List.Item>
                  <List.Item className="list-inline-item">
                    <a href="./faq.html">FAQ</a>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true}>
                <Button
                  href="https://github.com/tabler/tabler-react"
                  size="sm"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  Source code
                </Button>
              </Grid.Col>
            </React.Fragment>
          )
        }}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}
SiteWrapper.propTypes = {
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default SiteWrapper;
