import React, { Component } from "react";
import { Form, Button, Page, Grid, Alert, Icon } from "tabler-react";
import MomentPure from "moment";
import { toast } from "react-toastify";
//Mutations
import { Query } from "react-apollo";
import { QUERY_MUNICIPIOS } from "../Processo/ProcessoQueries";
import { ADD_DENUNCIA } from "./DenunciaQueries";
import ReactTooltip from "react-tooltip";

class DenunciaNova extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableForm: true,
      textoBotao: "Carregando...",
      denunciaNova: false,
      // Dados a serem enviados
      codigo: "",
      description: "",
      municipio_id: "",
      coordenada_x: "",
      coordenada_y: "",
      empreendimento: "",
      empreendimento_dados: "",
      empreendedor: "",
      empreendedor_dados: "",
      pto_de_referencia: "",
      feedback: "",
      touched: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  criaCookie(codigo) {
    //COOKIE EM SEGUNDOS
    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString();
    document.cookie = "reader=" + codigo + ";expires=" + date;
    document.cookie = "denuncia=" + codigo + ";expires=" + date;
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

  setDenuncia(variables) {
    //console.log(variables);
    this.setState({ touched: true });
    this.props.client
      .mutate({
        mutation: ADD_DENUNCIA,
        variables: variables,
        context: {
          headers: {
            "x-hasura-role": "public"
          }
        },
        update: (cache, data) => {
          if (data) {
            //console.log(data);
            this.setState({
              disableForm: true,
              textoBotao: "Aguarde 24h p/ enviar nova denúncia",
              codigo: variables.codigo,
              denunciaNova: true
            });
            //this.setState({ data: data.data });
          }
        }
      })
      .catch(error => {
        console.log("Atenção! " + error);
        toast.error("Preencha todos os campos obrigatórios.");
        this.setState({ feedback: "Este campo é obrigatório" });
      });
  }

  componentDidMount() {
    //console.log(this.props);
    this.checkCookie();
  }

  render() {
    const {
      disableForm,
      textoBotao,
      denunciaNova,
      // Dados a serem enviados
      codigo,
      description,
      municipio_id,
      coordenada_x,
      coordenada_y,
      empreendimento,
      empreendimento_dados,
      empreendedor,
      empreendedor_dados,
      pto_de_referencia,
      feedback,
      touched
    } = this.state;
    let cardTitle = "Nova Denúncia Anônima ";
    let variables = {};
    return (
      <React.Fragment>
        {denunciaNova ? (
          <React.Fragment>
            <Alert type="success" icon="check">
              Sua denúncia foi enviada com sucesso! Para verificar seu andamento
              anote o código abaixo e retorne a esta página para consultá-lo
              sempre que precisar.
            </Alert>
            <Alert type="warning" icon="alert-triangle">
              <Button
                onClick={() =>
                  (window.location.href = "/denuncia?codigo=" + codigo)
                }
                color="warning"
              >
                Consultar denúncia
              </Button>{" "}
              {codigo}
            </Alert>
          </React.Fragment>
        ) : (
          ""
        )}
        <Page.Card title={cardTitle}>
          {disableForm ? (
            "Aguarde 24h para enviar uma nova denúncia."
          ) : (
            <Form
              onSubmit={e => {
                e.preventDefault();
                variables = {
                  description,
                  municipio_id,
                  coordenada_x,
                  coordenada_y,
                  empreendimento,
                  empreendimento_dados,
                  empreendedor,
                  empreendedor_dados,
                  pto_de_referencia,
                  codigo: this.randomstring(8)
                };
                let permitir = true;
                //Falta determinar os campos obrigatórios
                for (var key in variables) {
                  if (variables.hasOwnProperty(key)) {
                    //console.log(key + " -> " + variables[key]);
                    if (variables[key] === "") {
                      variables[key] = null;
                      if (
                        key === "coordenada_x" ||
                        key === "coordenada_y" ||
                        key === "empreendedor" ||
                        key === "empreendedor_dados"
                      )
                        variables[key] = "";
                    }
                  }
                }

                //console.log(variables);
                //CriaCookie para permitir denúncia apenas daqui a 24h
                //this.criaCookie(variables.codigo);
                if (permitir) this.setDenuncia(variables);
                else toast.error("Favor preencher os campos obrigatórios.");
              }}
            >
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Descrição">
                    <Form.Textarea
                      name="description"
                      value={description}
                      placeholder="Descreva o tipo de atividade que está ocorrendo no local (venda de lotes, desmatamento, abertura de vias, construções, etc.) "
                      rows={6}
                      onChange={this.handleChange}
                      feedback={feedback}
                      invalid={touched && description.length === 0}
                      valid={description.length >= 3}
                      tick={description.length >= 3}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col width={12}>
                  <Form.Group
                    label={
                      <React.Fragment>
                        <strong>Empreendimento</strong>
                        <a data-tip data-for="empreendimento">
                          {" "}
                          <Icon name="help-circle" />
                        </a>
                        <ReactTooltip id="empreendimento">
                          <p>
                            Digite o nome do Empreendimento
                            <br />
                            (Ex: Condomínio Vale do Paraiso,
                            <br /> Bairro das Oliveiras,
                            <br /> Fazenda Mato Verde,
                            <br />
                            etc.)
                          </p>
                        </ReactTooltip>
                      </React.Fragment>
                    }
                  >
                    <Form.Input
                      value={empreendimento}
                      name="empreendimento"
                      placeholder="Digite o nome do Empreendimento..."
                      onChange={this.handleChange}
                      feedback={feedback}
                      invalid={touched && empreendimento.length === 0}
                      valid={empreendimento.length >= 3}
                      tick={empreendimento.length >= 3}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Dados do Empreendimento">
                    <Form.Textarea
                      name="empreendimento_dados"
                      value={empreendimento_dados}
                      placeholder="Descreva os dados  e endereço do empreendimento: rua, fazenda, bairro, etc."
                      rows={6}
                      onChange={this.handleChange}
                      feedback={feedback}
                      invalid={touched && empreendimento_dados.length === 0}
                      valid={empreendimento_dados.length >= 3}
                      tick={empreendimento_dados.length >= 3}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col width={12}>
                  <Form.Group label="Empreendedor">
                    <Form.Input
                      value={empreendedor}
                      name="empreendedor"
                      placeholder="Digite o nome do responsável pelo parcelamento/e ou atividades no local objeto da denúncia (vendedor dos lotes, responsável pelas intervenções e obras no local)."
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Dados do Empreendedor">
                    <Form.Textarea
                      name="empreendedor_dados"
                      value={empreendedor_dados}
                      placeholder="Descreva os dados do empreendedor, endereço do responsável pelo parcelamento/e ou atividades no local objeto da denúncia. ..."
                      rows={6}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Município">
                    <Form.Select
                      disabled={disableForm}
                      name="municipio_id"
                      value={municipio_id}
                      onChange={this.handleChange}
                      feedback={feedback}
                      invalid={touched && municipio_id.length === 0}
                      valid={municipio_id.length > 0}
                      tick={municipio_id.length > 0}
                    >
                      <option value="0">Selecione um município</option>
                      <Query query={QUERY_MUNICIPIOS}>
                        {({ loading, error, data }) => {
                          if (loading) return "Carregando...";
                          if (error) return `Erro! ${error.message}`;
                          return (
                            <React.Fragment>
                              {data.municipios.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </React.Fragment>
                          );
                        }}
                      </Query>
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col width={6}>
                  <Form.Group
                    label={
                      <React.Fragment>
                        <strong>Coordenada X</strong>
                        <a data-tip data-for="coordenada">
                          {" "}
                          <Icon name="help-circle" />
                        </a>
                        <ReactTooltip id="coordenada">
                          <p>
                            Coordenadas UTM ou qualquer outro sistema (por ex.
                            Google Earth)
                          </p>
                        </ReactTooltip>
                      </React.Fragment>
                    }
                  >
                    <Form.Input
                      value={coordenada_x}
                      name="coordenada_x"
                      placeholder="Digite a coordenada X..."
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col width={6}>
                  <Form.Group
                    label={
                      <React.Fragment>
                        <strong>Coordenada Y</strong>
                        <a data-tip data-for="coordenada">
                          {" "}
                          <Icon name="help-circle" />
                        </a>
                      </React.Fragment>
                    }
                  >
                    <Form.Input
                      value={coordenada_y}
                      name="coordenada_y"
                      placeholder="Digite a coordenada Y..."
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Ponto de Referência">
                    <Form.Textarea
                      name="pto_de_referencia"
                      value={pto_de_referencia}
                      placeholder="Digite um ponto de referência..."
                      rows={6}
                      onChange={this.handleChange}
                      feedback={feedback}
                      invalid={touched && pto_de_referencia.length === 0}
                      valid={pto_de_referencia.length >= 3}
                      tick={pto_de_referencia.length >= 3}
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
      </React.Fragment>
    );
  }
}

export default DenunciaNova;
