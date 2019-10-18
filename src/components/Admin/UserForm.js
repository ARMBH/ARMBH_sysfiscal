import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
//import axios from "axios";
import { QUERY_PROFILE, EDIT_PROFILE, EDIT_ROLE } from "./AdminQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import CheckBoxPerfis from "./CheckBoxPerfis";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Card, Avatar } from "tabler-react";
import { toast } from "react-toastify";
import Moment from "moment";

class UserForm extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      cpf: "",
      name: "",
      telefone: "",
      email: "",
      role: "",
      picture: "",
      created_at: ""
    };
  }

  getUser(id) {
    if (!this.state.name) {
      this.props.client.mutate({
        mutation: QUERY_PROFILE,
        variables: { id: id },
        update: (cache, data) => {
          if (data) {
            //Configurar o preenchimento do AvatarURL
            let picture = require("../../images/user-icon.png");
            if (!data.data.users[0].name) toast.info("Usuário SEM NOME.");
            this.setState({
              id: id,
              name: data.data.users[0].name,
              cpf: data.data.users[0].cpf,
              telefone: data.data.users[0].telefone,
              email: data.data.users[0].email,
              role: data.data.users[0].role,
              created_at: data.data.users[0].created_at,
              picture: picture
            });
          }
        }
      });
    }
  }

  componentDidMount() {
    if (!localStorage.getItem("roles").includes("admin")) {
      toast.error("Área reservada aos Admins.");
      this.props.history.push("/home");
    }
    //Parametros do Routes.js
    const { param } = this.props.match.params;
    this.getUser(param);
  }

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (data.update_users.affected_rows) {
      let message = "Usuário " + this.state.email + " alterado com sucesso";
      toast.success(message);
      this.props.history.push("/admin/users");
    } else {
      toast.error("Erro ao editar usuário.");
    }
  };

  callbackFunction = childData => {
    const { id } = this.state;

    this.props.client
      .mutate({
        mutation: EDIT_ROLE,
        context: {
          headers: {
            "x-hasura-role": "admin"
          }
        },
        variables: {
          id: id,
          role: childData
        },
        update: (cache, data) => {
          //console.log(data);
          if (data.data.update_users.returning) {
            //console.log(data.data.update_users.affected_rows);
            this.setState({ role: childData });
            return true;
          } else {
            toast.error("Erro ao alterar perfil.");
            return false;
          }
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
        return false;
      });
  };

  render() {
    const {
      id,
      cpf,
      name,
      telefone,
      email,
      role,
      created_at,
      picture
    } = this.state;

    let contentTitle = "Editar usuário " + email;
    let cardTitle = name;
    let context = {
      headers: {
        "x-hasura-role": "admin"
      }
    };
    return (
      <React.Fragment>
        <Mutation
          mutation={EDIT_PROFILE}
          onCompleted={this.handleCompleted}
          context={context}
        >
          {(mutationProfile, { loading, error }) => {
            return (
              <SiteWrapper {...this.props}>
                <Page.Content title={contentTitle}>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();

                      let variables = {
                        id: id,
                        cpf,
                        name,
                        telefone
                      };

                      mutationProfile({
                        variables: variables
                      })
                        .then(res => {
                          //console.log(res.data.update_users.affected_rows);
                          if (!res.errors) {
                            //console.log(res);
                            //onCompleted é chamado caso entre aqui
                          } else {
                            // Erros code 200
                            toast.error("Erro 200: " + res);
                            console.log("Erro 200: " + res);
                          }
                        })
                        .catch(e => {
                          //Erro de GraphQL
                          toast.error("Erro GraphQL: " + e);
                          //console.log("Erro GraphQL: " + e);
                        });
                    }}
                  >
                    <Page.Card title={cardTitle}>
                      <Grid.Row>
                        <Grid.Col auto>
                          <Avatar size="xl" imageURL={picture} />
                        </Grid.Col>
                        <Grid.Col>
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            {email}
                          </Form.Group>
                        </Grid.Col>
                        <Grid.Col>
                          <Form.Group>
                            <Form.Label>Perfil</Form.Label>
                            {role}
                          </Form.Group>
                        </Grid.Col>
                        <Grid.Col>
                          <Form.Group>
                            <Form.Label>Cadastro</Form.Label>
                            {Moment(created_at).format("DD/MM/YYYY")}
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                      <Card.Body />
                      <Grid.Row>
                        <Grid.Col width={12}>
                          <Form.Group label="Nome completo">
                            <Form.Input
                              value={name}
                              name="name"
                              placeholder="Digite seu nome..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>

                      <Grid.Row>
                        <Grid.Col width={6}>
                          <Form.Group label="CPF">
                            <Form.MaskedInput
                              value={cpf}
                              name="cpf"
                              placeholder="Digite seu CPF..."
                              onChange={this.handleChange}
                              type="text"
                              mask={[
                                /\d/,
                                /\d/,
                                /\d/,
                                ".",
                                /\d/,
                                /\d/,
                                /\d/,
                                ".",
                                /\d/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/
                              ]}
                            />
                          </Form.Group>
                        </Grid.Col>
                        <Grid.Col width={6}>
                          <Form.Group label="Telefone">
                            <Form.Input
                              value={telefone}
                              name="telefone"
                              placeholder="Digite um telefone..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                      <Form.Footer>
                        <Button color="primary" block>
                          Salvar
                        </Button>
                      </Form.Footer>
                    </Page.Card>
                    {id ? (
                      <CheckBoxPerfis
                        parentCallback={this.callbackFunction}
                        id={id}
                        perfil={role}
                      />
                    ) : (
                      "Carregando Perfis..."
                    )}
                  </Form>
                  <Button
                    icon="chevrons-left"
                    onClick={() => this.props.history.push("/admin/users")}
                  >
                    Voltar
                  </Button>
                </Page.Content>
              </SiteWrapper>
            );
          }}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default UserForm;
