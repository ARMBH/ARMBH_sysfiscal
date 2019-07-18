import React, { Component } from "react";
import { Icon, Button } from "tabler-react";
import { Card, Grid, Form } from "tabler-react";
import { QUERY_ENDERECO } from "./EnderecoQueries";
//import { toast } from 'react-toastify';
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

class ListaEnderecos extends Component {
  constructor() {
    super();
    this.state = {};
  }

  tituloTabela() {
    const link = "/endereco/" + this.props.id;
    return (
      <Link className="btn btn-primary ml-auto" to={link}>
        <Icon name="plus-circle" />
        Editar Endereço
      </Link>
    );
  }

  render() {
    let { id, title } = this.props;
    if (!title) title = "";
    let cardTitle = "";
    let disableForm = true;
    return (
      <Query
        pollInterval={500}
        query={QUERY_ENDERECO}
        variables={{ processoId: id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.enderecos.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.enderecos.length +
              " endereço";
            if (data.enderecos.length > 1) cardTitle = cardTitle + "s";
            cardTitle = cardTitle + ")";
            //console.log(data.enderecos);
          } else cardTitle = "Sem endereço cadastrado";
          //console.log(cardTitle);
          return (
            <React.Fragment>
              {data.enderecos.length > 0 ? (
                <React.Fragment>
                  {data.enderecos.map((endereco, index) => (
                    <React.Fragment key={index}>
                      <Grid.Row cards deck>
                        <Grid.Col>
                          <Grid.Row>
                            <Grid.Col width={3}>
                              <Form.Group label="CEP">
                                <Form.MaskedInput
                                  disabled={disableForm}
                                  value={endereco.cep}
                                  name="cep"
                                  placeholder="Digite um CEP..."
                                  type="text"
                                  mask={[
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    "-",
                                    /\d/,
                                    /\d/,
                                    /\d/
                                  ]}
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={9}>
                              <Form.Group label="Bairro">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.bairro}
                                  name="bairro"
                                  placeholder="Digite o Bairro..."
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={9}>
                              <Form.Group label="Logradouro">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.logradouro}
                                  name="logradouro"
                                  placeholder="Digite um logradouro..."
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={3}>
                              <Form.Group label="Núm/Complemento">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.complemento}
                                  name="complemento"
                                  placeholder="Digite um complemento..."
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={9}>
                              <Form.Group label="Município">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.localidade}
                                  name="localidade"
                                  placeholder="Digite um Município..."
                                />
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col width={3}>
                              <Form.Group label="UF">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.uf}
                                  name="uf"
                                  placeholder="Digite um UF..."
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col width={12}>
                              <Form.Group label="Área (m²)">
                                <Form.Input
                                  disabled={disableForm}
                                  value={endereco.area || ""}
                                  name="area"
                                  placeholder="Área não cadastrada"
                                  type="float"
                                />
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                      </Grid.Row>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ) : (
                <Card.Body>Não há endereço cadastrado.</Card.Body>
              )}

              <Button.List align="right">{this.tituloTabela()}</Button.List>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ListaEnderecos;
