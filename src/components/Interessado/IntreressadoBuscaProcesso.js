import React, { Component } from "react";
import { Card, Grid, Form } from "tabler-react";
import ListaInteressadosCPF from "./ListaInteressadosCPF";

class InteressadoBuscaProcesso extends Component {
  constructor() {
    super();
    this.state = {
      cpf: "",
      disableForm: false
    };
  }

  handleChange = e => {
    //console.log(e.target.name + ": " + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  limpaCpf(cpf) {
    let cpf_limpo = cpf.replace(/[-_+()\s]/g, "");
    if (cpf_limpo.length < 11) cpf = cpf.replace(/[-_+()\s]/g, "");
    else cpf = cpf.replace(/[_+()\s]/g, "");
    if (cpf.length <= 5 && cpf.length > 0) cpf = cpf.slice(0, -2);
    if (cpf.length <= 8 && cpf.length > 5) cpf = cpf.slice(0, -1);
    //console.log(cpf.length);
    return cpf;
  }

  render() {
    let { id, title } = this.props;
    const { cpf, disableForm } = this.state;
    if (!title) title = "";
    let cardTitle = "Buscar por CPF ";

    return (
      <React.Fragment>
        <Card title={cardTitle}>
          <Card.Body>
            <Grid.Row>
              <Grid.Col width={12}>
                <Form.Group
                  label={
                    <Form.Label
                      aside={
                        cpf && cpf.replace(/[-_+()\s]/g, "").length > 4
                          ? "Buscando: " + this.limpaCpf(cpf)
                          : ""
                      }
                    >
                      CPF
                    </Form.Label>
                  }
                >
                  <Form.MaskedInput
                    disabled={disableForm}
                    value={cpf}
                    name="cpf"
                    placeholder="Digite um cpf..."
                    onChange={this.handleChange}
                    type="text"
                    valid={
                      cpf.replace(/[-_+()\s]/g, "").length > 4
                        ? "valid"
                        : undefined
                    }
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
            </Grid.Row>
          </Card.Body>
        </Card>
        {this.limpaCpf(cpf).length >= 3 ? (
          <ListaInteressadosCPF
            cpf={"%" + this.limpaCpf(cpf) + "%"}
            id={id}
            title={title}
            {...this.props}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default InteressadoBuscaProcesso;
