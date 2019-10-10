import React, { Component } from "react";
import { Form, Button, Page, Grid } from "tabler-react";
import { toast } from "react-toastify";
import { QUERY_DENUNCIA } from "./DenunciaQueries";
//import Moment from "moment";
import MomentComponent from "react-moment";
import "moment/locale/pt-br";
import DenunciaRelatorio from "./DenunciaRelatorio";

class DenunciaConsulta extends Component {
  constructor() {
    super();
    this.state = {
      disableForm: true,
      textoBotao: "Carregando...",
      name: "",
      codigoCookie: "",
      exibirNova: true,
      exibeInformacoes: false,
      exibir: false,
      // Dados a serem enviados
      codigo: "",
      description: "",
      municipio: "",
      coordenada_x: "",
      coordenada_y: "",
      empreendimento: "",
      empreendimento_dados: "",
      empreendedor: "",
      empreendedor_dados: "",
      pto_de_referencia: "",
      origem: "",
      updated_at: "",
      created_at: "",
      status_demanda: "",
      justificativa: ""
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkDenuncia() {
    if (this.state.codigo === "") toast.error("O código não deve ser vazio.");
    else if (this.state.codigo.length <= 3)
      toast.error("O código deve ter mais do que 3 caracteres.");
    else {
      window.location.href = "/denuncia?codigo=" + this.state.codigo;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.codigo !== prevProps.codigo) {
      this.setState({ codigo: "" });
    }
  }

  componentDidMount() {
    const codigo = this.props.codigo;
    if (codigo) {
      this.setState({ codigo: codigo });
      this.getDenuncia(codigo);
    }
  }

  getDenuncia(codigo) {
    this.props.client
      .mutate({
        mutation: QUERY_DENUNCIA,
        context: {
          headers: {
            "x-hasura-codigo": codigo
          }
        },
        update: (cache, data) => {
          if (data.data.demandas[0]) {
            let variables = data.data.demandas[0];
            this.setState({
              existe: true,
              description: variables.description,
              municipio: variables.municipio.name,
              coordenada_x: variables.coordenada_x,
              coordenada_y: variables.coordenada_y,
              empreendimento: variables.empreendimento,
              empreendimento_dados: variables.empreendimento_dados,
              empreendedor: variables.empreendedor,
              empreendedor_dados: variables.empreendedor_dados,
              pto_de_referencia: variables.pto_de_referencia,
              origem: variables.origem.name,
              updated_at: variables.updated_at,
              created_at: variables.created_at,
              status_demanda: variables.status_demanda,
              justificativa: variables.justificativa,
              exibir: true
            });
          } else toast.error("Denúncia não encontrada.");
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
      });
  }

  render() {
    const {
      codigo,
      description,
      municipio,
      coordenada_x,
      coordenada_y,
      empreendimento,
      empreendimento_dados,
      empreendedor,
      empreendedor_dados,
      pto_de_referencia,
      origem,
      exibir,
      status_demanda,
      updated_at,
      created_at,
      justificativa
    } = this.state;
    //console.log(codigo);
    return (
      <React.Fragment>
        <Page.Card title={"Consultar denúncia"}>
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

        {codigo !== "" && codigo.length === 19 && exibir ? (
          <React.Fragment>
            <Page.Card title={"Consulta à denúncia"}>
              <DenunciaRelatorio codigo={codigo} {...this.props} />
              <Button
                color="danger"
                onClick={() => this.setState({ codigo: "", exibir: false })}
              >
                Consultar Nova Denúncia
              </Button>
            </Page.Card>
          </React.Fragment>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default DenunciaConsulta;
