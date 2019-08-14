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
import "./SiteWrapper.css";
import { QUERY_USER, UPDATE_LASTSEEN_MUTATION } from "./SiteWrapperQueries";
const authLogo = require("../../images/auth.png");

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
    value: "Processos",
    icon: "box",
    subItems: [
      {
        value: "Listar Todos os Processos",
        to: "/listaprocessos/",
        LinkComponent: NavLink
      },
      {
        value: "Novo Processo",
        to: "/novoprocesso/",
        LinkComponent: NavLink
      }
    ]
  },
  {
    value: "Calendário",
    icon: "calendar",
    subItems: [
      { value: "Calendário Geral", to: "/calendario", LinkComponent: NavLink },
      { value: "Meu Calendário", to: "/meucalendario", LinkComponent: NavLink }
    ]
  },
  {
    value: "Empreendedores",
    icon: "user-check",
    subItems: [
      {
        value: "Listar Todos os Empreendedores",
        to: "/listaempreendedores/",
        LinkComponent: NavLink
      },
      {
        value: "Novo Empreendedor",
        to: "/novoempreendedor/",
        LinkComponent: NavLink
      }
    ]
  }
  /**
	{
		value: 'Documentação',
		icon: 'file-text',
		subItems: [
			{
				value: 'Documentation',
				to:
					process.env.NODE_ENV === 'production'
						? 'https://tabler.github.io/tabler-react/documentation'
						: 'https://tabler.github.io/tabler-react/documentation'
			},
			{
				value: 'Código Fonte',
				to: 'https://github.com/tabler/tabler-react'
			},
			{
				value: 'Demo',
				to: 'http://tabler-react.com/'
			}
		]
	}
   */
];
const avatarURL = require("../../images/right-img.png");

const accountDropdownProps = {
  avatarURL: avatarURL,
  name: "User",
  description: "Role",
  options: [
    { icon: "user", value: "Profile", to: "/profile", RootComponent: NavLink },
    {
      icon: "calendar",
      value: "Meu Calendário",
      to: "/meucalendario",
      RootComponent: NavLink
    },
    //{ icon: "settings", value: "Settings" },
    //{ icon: "mail", value: "Inbox", badge: "6" },
    //{ icon: "send", value: "Message" },
    { isDivider: true },
    //{ icon: "help-circle", value: "Need help?" },
    {
      icon: "log-out",
      value: "Sair",
      RootComponent: NavLink,
      to: "/home/logout"
    }
  ]
};

class SiteWrapper extends React.Component<Props, State> {
  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }

  getUser(userId) {
    if (!this.state.name) {
      this.props.client.mutate({
        mutation: QUERY_USER,
        variables: { userId: userId },
        update: (cache, data) => {
          if (data) {
            //Configurar o preenchimento do AvatarURL
            accountDropdownProps.avatarURL = require("../../images/user-icon.png");
            if (localStorage.getItem("auth0:id_token:picture"))
              accountDropdownProps.avatarURL = localStorage.getItem(
                "auth0:id_token:picture"
              );
            accountDropdownProps.name = data.data.users[0].name;
            accountDropdownProps.description = auth.getRoles();
            if (!accountDropdownProps.name) {
              this.props.history.push("/profile");
            }
            this.setState({
              name: data.data.users[0].name,
              role: data.data.users[0].role
            });
          }
        }
      });
    }
  }

  updateLastSeen() {
    this.props.client.mutate({
      mutation: UPDATE_LASTSEEN_MUTATION,
      variables: { now: new Date().toISOString() }
    });
  }

  componentWillUnmount() {
    //console.log('');
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
        if (localStorage.getItem("session") !== "true") {
          this.setState({ session: true });
        }
        localStorage.setItem("session", true);
      });
    } else {
      window.location.href = "/";
    }
  }

  state = {
    role: "user",
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
    /** 
    const notificationsObjects = this.state.notificationsObjects || [];
		const unreadCount = this.state.notificationsObjects.reduce((a, v) => a || v.unread, false);
    */

    const userId = auth.getSub();
    if (userId) this.getUser(userId);

    const { role } = this.state;
    let navBarItemsNew = [...navBarItems];

    let itemAdmin = {
      value: "Admin",
      to: "/admin",
      icon: "settings",
      LinkComponent: NavLink,
      useExact: true
    };
    //Adiciona Item de administradores ao Menu
    if (role === "admin") navBarItemsNew.push(itemAdmin);

    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "Sys Fiscal",
          imageURL: authLogo,
          navItems: (
            <Nav.Item type="div" className="d-none d-md-flex">
              {/** Local do antigo botão SOURCE CODE */}
            </Nav.Item>
          ),
          /** NOTIFICACOES
					notificationsTray: {
						notificationsObjects,
						markAllAsRead: () =>
							this.setState(
								() => ({
									notificationsObjects: this.state.notificationsObjects.map(v => ({
										...v,
										unread: false
									}))
								}),
								() =>
									setTimeout(
										() =>
											this.setState({
												notificationsObjects: this.state.notificationsObjects.map(v => ({
													...v,
													unread: true
												}))
											}),
										5000
									)
							),
						unread: unreadCount
					},
           */
          accountDropdown: accountDropdownProps
        }}
        navProps={{ itemsObjects: navBarItemsNew }}
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
          note: (
            <React.Fragment>
              Sistema de Fiscalização Digital
              {process.env.NODE_ENV === "production" ? (
                <span>
                  {" "}
                  <br /> Produção - {process.env.NODE_ENV}
                </span>
              ) : (
                <span>
                  <br />
                  Ambiente: {process.env.NODE_ENV}
                </span>
              )}
              <br />
              Versão: 1.0.3 Alpha
            </React.Fragment>
          ),
          copyright: (
            <React.Fragment>
              Copyright © 2019
              <a href="."> Sistema de Fiscalização</a>. Visite o site da
              <a
                href="http://www.agenciarmbh.mg.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                ARMBH
              </a>{" "}
              Todos os direitos reservados.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="http://tabler-react.com/documentation/"
                    >
                      Documentação
                    </a>
                  </List.Item>
                  <List.Item className="list-inline-item">
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="http://tabler-react.com/"
                    >
                      Demo
                    </a>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true}>
                {
                  <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/tabler/tabler-react"
                    size="sm"
                    outline
                    color="primary"
                    RootComponent="a"
                  >
                    Código Fonte
                  </Button>
                }
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
