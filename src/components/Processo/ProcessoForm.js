import React, { Component } from "react";
//import PropTypes from 'prop-types';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import MomentPure from "moment";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Form, Button, Page, Grid } from "tabler-react";
//import Moment from 'react-moment';
import "moment-timezone";
import "moment/locale/pt-br";
//import Loading from '../Loading/Loading';

const ADD_PROCESSO = gql`
  mutation($title: String!, $descricao: String!, $origem_solicitacao: String!) {
    insert_processos(
      objects: {
        title: $title
        descricao: $descricao
        origem_solicitacao: $origem_solicitacao
      }
    ) {
      affected_rows
      returning {
        id
        title
      }
    }
  }
`;

const EDIT_PROCESSO = gql`
  mutation(
    $id: Int!
    $title: String!
    $descricao: String!
    $origem_solicitacao: String!
    $updated_at: timestamptz
  ) {
    update_processos(
      where: { id: { _eq: $id } }
      _set: {
        updated_at: $updated_at
        title: $title
        origem_solicitacao: $origem_solicitacao
        descricao: $descricao
      }
    ) {
      affected_rows
      returning {
        id
        title
      }
    }
  }
`;

const QUERY_PROCESSO = gql`
  query getUser($processoId: Int!) {
    processos(where: { id: { _eq: $processoId } }) {
      id
      title
      updated_at
      user {
        id
        name
      }
      origem_solicitacao
      descricao
      created_at
    }
  }
`;

class ProcessoForm extends Component {
  constructor() {
    super();
    this.state = {
      //id: '',
      title: "",
      origem_solicitacao: "",
      descricao: ""
    };
  }

  getProcesso(processoId) {
    this.props.client.mutate({
      mutation: QUERY_PROCESSO,
      variables: { processoId: processoId },
      update: (cache, data) => {
        if (data) {
          if (!data.data.processos[0]) {
            console.log(
              "Processo não encontrado ou você não possui permissão para visualizar este processo."
            );
            this.props.history.push("/processo/todos");
            return null;
          }
          //console.log(data.data.processos[0]);
          this.setState(data.data.processos[0]);
        }
      }
    });
  }

  componentDidMount() {
    const { param } = this.props.match.params;
    if (parseInt(param, 10) > 0) {
      this.getProcesso(param);
      this.setState({
        id: param
      });
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (this.state.id) {
      console.log(this.state.id + " editado com sucesso!");
    } else {
      //alert(data.insert_processos.returning[0].title);
      this.setState({
        id: data.insert_processos.returning[0].id
      });
      //Encaminhar para  lista de processos ou para o processo com ID ja preenchido
      this.props.history.push(
        "/processo/" + data.insert_processos.returning[0].id
      );
    }
  };

  render() {
    const { id, title, origem_solicitacao, descricao } = this.state;
    let contentTitle = "Novo Processo";
    if (id) contentTitle = "Editar Processo nº " + id;

    let cardTitle = "Cadastro de Novo Processo";
    if (id) cardTitle = title + "";

    let mutation = ADD_PROCESSO;
    if (id) mutation = EDIT_PROCESSO;

    return (
      <React.Fragment>
        <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
          {(mutationProcesso, { loading, error }) => {
            return (
              <SiteWrapper {...this.props}>
                <Page.Content title={contentTitle}>
                  <Page.Card title={cardTitle}>
                    <Grid.Row cards deck>
                      <Grid.Col>
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            let variables = {
                              title: title,
                              descricao: descricao,
                              origem_solicitacao: origem_solicitacao
                            };

                            if (id) {
                              variables.id = id;
                              variables.updated_at = MomentPure().format(
                                "YYYY-MM-DD[T]HH:mm:ss"
                              );
                              console.log(variables);
                            }

                            mutationProcesso({
                              variables: variables
                            });
                          }}
                        >
                          <Form.Group label="Título">
                            <Form.Input
                              value={title}
                              name="title"
                              placeholder="Digite um título..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group label="Origem da Solicitação">
                            <Form.Input
                              value={origem_solicitacao}
                              name="origem_solicitacao"
                              placeholder="Digite a origem deste processo..."
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group
                            label={
                              <Form.Label aside={descricao.length + "/100"}>
                                Descrição
                              </Form.Label>
                            }
                          >
                            <Form.Textarea
                              name="descricao"
                              value={descricao}
                              placeholder="Descreva este processo (opcional)"
                              rows={6}
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                          {id ? (
                            <Button
                              type="submit"
                              color="primary"
                              className="ml-auto"
                            >
                              Editar Processo
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              color="success"
                              className="ml-auto"
                            >
                              Adicionar Novo Processo
                            </Button>
                          )}
                        </Form>

                        {error && <p>Erro ao salvar Processo.</p>}
                      </Grid.Col>
                    </Grid.Row>
                  </Page.Card>
                </Page.Content>
              </SiteWrapper>
            );
          }}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default ProcessoForm;
