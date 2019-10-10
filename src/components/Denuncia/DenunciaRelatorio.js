import React, { Component } from "react";
import { Form, Grid } from "tabler-react";
import { toast } from "react-toastify";
import { QUERY_DENUNCIA } from "./DenunciaQueries";
//import Moment from "moment";
import MomentComponent from "react-moment";
import "moment/locale/pt-br";

class DenunciaRelatorio extends Component {
  constructor() {
    super();
    this.state = {
      disableForm: true,
      textoBotao: "Carregando...",
      name: "",
      codigoCookie: "",
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
      status_demanda,
      updated_at,
      created_at,
      justificativa
    } = this.state;
    //console.log(codigo);
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Col width={6}>
            <Form.Group label="Código da denúncia">
              <strong>{codigo}</strong>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={6}>
            <Form.Group label="Data de cadastro">
              <MomentComponent format="DD/MM/YYYY HH:mm">
                {created_at}
              </MomentComponent>
            </Form.Group>
          </Grid.Col>
          <Grid.Col width={6}>
            <Form.Group label="Última atualização">
              <MomentComponent fromNow>{updated_at}</MomentComponent>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>

        <Grid.Row>
          <Grid.Col width={6}>
            <Form.Group label="Origem da denúncia">{origem}</Form.Group>
          </Grid.Col>
          <Grid.Col width={6}>
            <Form.Group label="Status da Demanda">{status_demanda}</Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label="Descrição">{description}</Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <Form.Group label="Empreendimento">{empreendimento}</Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label="Dados do Empreendimento">
              {empreendimento_dados}
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <Form.Group label="Empreendedor">{empreendedor}</Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label="Dados do Empreendedor">
              {empreendedor_dados}
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label="Município">{municipio}</Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={6}>
            <Form.Group label="Coordenada X">{coordenada_x}</Form.Group>
          </Grid.Col>
          <Grid.Col width={6}>
            <Form.Group label="Coordenada Y">{coordenada_y}</Form.Group>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://www.google.com/maps/place/" +
                coordenada_x +
                "," +
                coordenada_y
              }
            >
              Visualizar no mapa
            </a>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label="Ponto de Referência">
              {pto_de_referencia}
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        {justificativa !== null ? (
          <Grid.Row>
            <Grid.Col>
              <Form.Group label="Justificativa">{justificativa}</Form.Group>
            </Grid.Col>
          </Grid.Row>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default DenunciaRelatorio;
