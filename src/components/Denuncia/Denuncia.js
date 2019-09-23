import React, { Component } from "react";
import { Form, Button, Page, Grid, Alert } from "tabler-react";
import MomentPure from "moment";
import { toast } from "react-toastify";
//import '../../styles/App.css';
//import "../../styles/Denuncia.css";
//import { Link } from "react-router-dom";

class Denuncia extends Component {
  constructor() {
    super();
    this.state = {
      disableForm: true,
      textoBotao: "Carregando...",
      name: "",
      description: "",
      codigo: "",
      codigoCookie: "",
      exibirNova: true,
      exibeInformacoes: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  criaCookie() {
    const codigo = this.randomstring(8);
    //COOKIE EM SEGUNDOS
    document.cookie = "reader=" + codigo + ";max-age=60*60*12";
    document.cookie = "denuncia=" + codigo + ";max-age=60*60*24*365*10";
    this.setState({
      disableForm: true,
      textoBotao: "Aguarde 24h p/ enviar nova denúncia",
      codigo: codigo,
      codigoCookie: codigo,
      exibeInformacoes: true
    });
    console.log(this.state);
  }

  checkCookie() {
    //console.log(document.cookie);
    let codigo = document.cookie
      .split(";")
      .filter(item => item.trim().startsWith("reader="));

    if (codigo.length) {
      codigo = String(codigo).replace("reader=", "");
      this.setState({
        codigoCookie: codigo.trim(),
        disableForm: true,
        textoBotao: "Denúncia já enviada"
      });
    } else {
      this.setState({ disableForm: false, textoBotao: "Enviar denúncia" });
    }
  }

  randomstring(L) {
    const due_date = MomentPure()
      .utc()
      .format("YYYY-MM-DD");

    var s = "";
    var randomchar = function() {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < L) s += randomchar();
    return due_date + "-" + s;
  }

  checkDenuncia() {
    if (this.state.codigo === "") toast.error("O código não deve ser vazio.");
    else {
      window.location.href = "/denuncia?codigo=" + this.state.codigo;
      // this.props.history.push("/denuncia?codigo=" + this.state.codigo);
    }
  }

  componentDidMount() {
    this.checkCookie();
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);
    const codigo = paramsUrl.get("codigo");
    if (codigo) this.setState({ codigo: codigo });
  }

  render() {
    const {
      name,
      disableForm,
      description,
      textoBotao,
      codigo,
      exibirNova,
      exibeInformacoes,
      codigoCookie
    } = this.state;
    let contentTitle =
      "Sistema de Fiscalização de Parcelamento de Solo da ARMBH";
    let cardTitle = "Denúncia Anônima " + codigo;

    return (
      <React.Fragment>
        <Page.Content title={contentTitle}>
          {exibeInformacoes ? (
            <React.Fragment>
              <Alert type="success" icon="check">
                Sua denúncia foi enviada com sucesso! Para verificar seu
                andamento anote o código abaixo e retorne a esta página para
                consultá-lo sempre que precisar.
              </Alert>
              <Alert type="warning" icon="alert-triangle">
                {codigoCookie}
              </Alert>
            </React.Fragment>
          ) : (
            ""
          )}
          <Button.List>
            <Button
              color="success"
              onClick={() => this.setState({ exibirNova: true, codigo: "" })}
            >
              Nova Denúncia
            </Button>
            <Button
              color="secondary"
              onClick={() => this.setState({ exibirNova: false })}
            >
              Consultar Denúncia
            </Button>
          </Button.List>
          {exibirNova ? (
            <React.Fragment>
              {codigo !== "" ? (
                <Page.Card title={cardTitle}>
                  {disableForm ? (
                    "Aguarde 24h para enviar uma nova denúncia."
                  ) : (
                    <React.Fragment>
                      <Grid.Row>
                        <Grid.Col>
                          <Form.Group label="Código da denúncia">
                            <strong>{codigo}</strong>
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col>
                          <Form.Group label="Descrição">
                            {description}
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col width={12}>
                          <Form.Group label="Nome completo">{name}</Form.Group>
                        </Grid.Col>
                      </Grid.Row>
                    </React.Fragment>
                  )}
                </Page.Card>
              ) : (
                <Page.Card title={cardTitle}>
                  {disableForm ? (
                    "Aguarde 24h para enviar uma nova denúncia."
                  ) : (
                    <Form
                      onSubmit={e => {
                        e.preventDefault();
                        this.criaCookie();
                      }}
                    >
                      <Grid.Row>
                        <Grid.Col>
                          <Form.Group label="Descrição">
                            <Form.Textarea
                              name="description"
                              value={description}
                              placeholder="Descreva a denúncia..."
                              rows={6}
                              onChange={this.handleChange}
                            />
                          </Form.Group>
                        </Grid.Col>
                      </Grid.Row>
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

                      <Form.Footer>
                        <Button color="warning" disabled={disableForm}>
                          {textoBotao}
                        </Button>
                      </Form.Footer>
                    </Form>
                  )}
                </Page.Card>
              )}
            </React.Fragment>
          ) : (
            <Page.Card title={"Consulta a denúncia"}>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  this.checkDenuncia();
                }}
              >
                <Grid.Row>
                  <Grid.Col width={12}>
                    <Form.Group label="Código de verificação">
                      <Form.Input
                        value={codigo}
                        name="codigo"
                        placeholder="Digite o código..."
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Button color="warning">Consultar Denúncia</Button>
              </Form>
            </Page.Card>
          )}
        </Page.Content>
      </React.Fragment>
    );
  }
}

export default Denuncia;
