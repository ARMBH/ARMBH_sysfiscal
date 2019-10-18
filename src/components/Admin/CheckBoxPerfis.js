import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
//import axios from "axios";
import { QUERY_PROFILE, EDIT_PROFILE } from "./AdminQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Card, Avatar } from "tabler-react";
import { toast } from "react-toastify";
import Moment from "moment";
import axios from "axios";

class CheckBoxPerfis extends Component {
  constructor(props) {
    console.log(process.env.REACT_APP_VERSAO);
    console.log(process.env.REACT_APP_HOOK);
    super(props);
    this.state = {
      urlHook: "http://" + process.env.REACT_APP_HOOK + "/roles",
      id: props.id, //ID do usuario
      roles: [],
      info: "Carregando Perfis...",
      perfil: ""
    };
  }

  setUserRoles(roles, rolesUser) {
    let arr = roles;
    rolesUser.map(item => {
      let obj = arr.find((o, i) => {
        if (o.id === item.id) {
          arr[i] = { check: true, ...arr[i] };
          return true; // stop searching
        }
      });
    });

    //console.log(arr)
    this.setState({ roles: arr, info: "" });
  }

  setPerfilHasura() {
    const { id, roles } = this.state;
    let perfil = "";
    roles.map(item => {
      if (item["check"]) perfil = perfil + item["description"] + "/";
    });

    if (perfil === "") {
      perfil = "Inativo";
    } else {
      perfil = perfil.slice(0, -1);
    }
    this.setState({ perfil: perfil });
    this.sendData(perfil);
  }

  sendData = perfil => {
    this.props.parentCallback(perfil);
  };

  //Download de todas as roles do sistema
  getUserRoles(roles) {
    let token = localStorage.getItem("auth0:id_token");
    const { id } = this.state;
    const headers = {
      authorization: "Bearer " + token,
      jwt: token,
      "Content-Type": "application/json"
    };

    const urlApi = this.state.urlHook;
    const dataAx = '{"action": "listuser","user":"' + id + '"}';

    axios
      .post(urlApi, dataAx, {
        headers: headers
      })
      .then(response => {
        this.setUserRoles(roles, response.data);
      })
      .catch(err => {
        // handle error
        console.log(err);
      });
  }
  //Download de todas as roles do sistema
  getRoles() {
    let token = localStorage.getItem("auth0:id_token");
    const headers = {
      authorization: "Bearer " + token,
      jwt: token,
      "Content-Type": "application/json"
    };

    const urlApi = this.state.urlHook;
    const dataAx = '{"action": "listall"}';

    axios
      .post(urlApi, dataAx, {
        headers: headers
      })
      .then(response => {
        this.getUserRoles(response.data);
      })
      .catch(err => {
        // handle error
        console.log(err);
      });
  }

  addRole(role, index) {
    this.setState({ info: "Adicionando Perfil " + role["description"] });

    const role_id = role["id"];
    let token = localStorage.getItem("auth0:id_token");
    const { id } = this.state;

    const headers = {
      authorization: "Bearer " + token,
      jwt: token,
      "Content-Type": "application/json"
    };

    const urlApi = this.state.urlHook;
    const dataAx =
      '{"action": "add","user":"' + id + '","role":"' + role_id + '"}';

    axios
      .post(urlApi, dataAx, {
        headers: headers
      })
      .then(response => {
        //console.log(response.data);
        //Se sucesso:
        toast.success("Role adicionada com sucesso: " + role["description"]);
        this.alterCheckRole(index);
      })
      .catch(err => {
        // handle error
        this.setState({ info: "Erro ao alterar perfil: " + err });
        console.log(err);
      });
  }

  removeRole(role, index) {
    this.setState({ info: "Removendo Perfil " + role["description"] });

    const role_id = role["id"];
    let token = localStorage.getItem("auth0:id_token");
    const { id } = this.state;

    const headers = {
      authorization: "Bearer " + token,
      jwt: token,
      "Content-Type": "application/json"
    };

    const urlApi = this.state.urlHook;
    const dataAx =
      '{"action": "delete","user":"' + id + '","role":"' + role_id + '"}';

    axios
      .post(urlApi, dataAx, {
        headers: headers
      })
      .then(response => {
        //console.log(response.data);
        //Se sucesso:
        toast.success("Role removida com sucesso: " + role["description"]);
        this.alterCheckRole(index);
      })
      .catch(err => {
        // handle error
        this.setState({ info: "Erro ao alterar perfil: " + err });
        console.log(err);
      });
  }

  componentDidMount() {
    //Pega todas as Roles possíveis do Sistema
    this.getRoles();

    //Pega as Roles apenas do User
  }

  handleRole = e => {
    //console.log(e.target);
    let { roles } = this.state;
    if (
      window.confirm(
        "Deseja realmente alterar o perfil (" +
          roles[e.target.name]["description"] +
          ")?"
      )
    ) {
      //Aqui chama o API para alterar o perfil

      //console.log(roles[e.target.name])
      if (typeof roles[e.target.name]["check"] === undefined)
        roles[e.target.name]["check"] = false;

      if (roles[e.target.name]["check"]) {
        //RemoveROLE
        this.removeRole(roles[e.target.name], e.target.name);
      } else {
        //Adiciona ROLE
        this.addRole(roles[e.target.name], e.target.name);
      }
    } else {
      alert("O perfil não foi alterado.");
    }
  };

  alterCheckRole(index) {
    let { roles } = this.state;
    //console.log(roles[index])
    //console.log(roles[e.target.name])
    if (typeof roles[index]["check"] === undefined)
      roles[index]["check"] = false;

    roles[index]["check"] = !roles[index]["check"];
    //console.log("Novo valor: " + roles[e.target.name]['check'])
    this.setState({ roles: roles, info: "" }, () => this.setPerfilHasura());
  }

  render() {
    const { id, roles, info } = this.state;

    return (
      <Page.Card>
        <Form.Group label="Perfis">
          {info !== "" ? (
            <span>{info}</span>
          ) : (
            <React.Fragment>
              {roles ? (
                <React.Fragment>
                  {roles.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <Form.Checkbox
                        checked={item.check ? true : false}
                        onChange={this.handleRole}
                        label={item.description}
                        name={index}
                        value={item.id}
                      />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ) : (
                "Carregando Perfis do usuário..."
              )}
            </React.Fragment>
          )}
        </Form.Group>
      </Page.Card>
    );
  }
}

export default CheckBoxPerfis;
