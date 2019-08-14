import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
//import axios from "axios";
import { QUERY_PROFILE, EDIT_PROFILE } from "./ProfileQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Card, Avatar } from "tabler-react";
import { toast } from "react-toastify";
import Moment from "moment";

class ProfileForm extends Component {
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
            if (localStorage.getItem("auth0:id_token:picture"))
              picture = localStorage.getItem("auth0:id_token:picture");
            if (!data.data.users[0].name)
              toast.info("Por favor atualize seu Profile.");
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
    this.getUser(this.props.auth.getSub());
  }

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (data.update_users.affected_rows) {
      let message = "Usuário " + this.state.email + " alterado com sucesso";
      toast.success(message);
    } else {
      toast.error("Erro ao editar usuário.");
    }
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

    return (
      <React.Fragment>
        <Mutation mutation={EDIT_PROFILE} onCompleted={this.handleCompleted}>
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
                            <Form.Label>Role</Form.Label>
                            {role.charAt(0).toUpperCase()}
                            {role.slice(1)}
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
                  </Form>
                  <Button
                    icon="chevrons-left"
                    onClick={() => this.props.history.push("/")}
                  >
                    Voltar para a página Inicial
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

export default ProfileForm;
