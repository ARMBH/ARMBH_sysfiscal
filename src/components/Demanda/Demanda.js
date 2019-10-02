/*
Gestão de Demandas
Origens distintas:
{
  demandas_aggregate(distinct_on: origem_id) {
    nodes {
      origem_id
      origem {
        id
        name
      }
    }
  }
}
Conta quantas são:
{
  demandas_aggregate(where: {origem_id: {_eq: 3}, status_demanda: {_eq: "Nova"}}) {
    aggregate {
      count(columns: id)
    }
  }
}

Update Demanda
mutation {
  update_demandas(where: {codigo: {_eq: "2019-09-27-TxF8Ho2J"}}, _set: {status_demanda: "Alterada"}) {
    affected_rows
    returning {
      status_demanda
      updated_at
    }
  }
}


*/
import React, { Component } from "react";
import logar from "../Historico/HistoricoLog";
import { QUERY_DEMANDA, EDIT_DEMANDA } from "./DemandaQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Badge } from "tabler-react";
import { toast } from "react-toastify";
import MomentComponent from "react-moment";
import "moment/locale/pt-br";

class Demanda extends Component {
  constructor() {
    super();
    this.state = {
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

  alteraDemanda(codigo, status_novo, justificativa) {
    this.props.client
      .mutate({
        mutation: EDIT_DEMANDA,
        variables: {
          codigo: codigo,
          status_demanda: status_novo,
          justificativa: justificativa
        },
        update: (cache, data) => {
          //console.log(data);
          if (data.data.update_demandas.returning) {
            //console.log(data);
            let variables = data.data.update_demandas.returning[0];
            this.setState({
              updated_at: variables.updated_at,
              status_demanda: variables.status_demanda,
              justificativa: variables.justificativa
            });
            toast.success(codigo + ": " + status_novo + "!");
          } else toast.error("Erro ao alterar demanda.");
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
      });
  }

  getDenuncia(codigo) {
    //console.log("Codigo da denuncia " + codigo);
    this.props.client
      .mutate({
        mutation: QUERY_DEMANDA,
        variables: {
          codigo: codigo
        },
        update: (cache, data) => {
          if (data.data.demandas[0]) {
            //console.log(data);
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
          } else toast.error("Demanda não encontrada.");
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
      });
  }

  componentDidMount() {
    //Envia para o Topo da página
    window.scrollTo(0, 0);
    const { param } = this.props.match.params;
    this.setState({
      codigo: param
    });

    this.getDenuncia(param);
  }

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

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

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={"Demanda"}>
          <Page.Card title={codigo}>
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
                  <Form.Group label="Status da Demanda">
                    <Badge
                      color={status_demanda === "Nova" ? "success" : "warning"}
                    >
                      {status_demanda}
                    </Badge>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label="Descrição">{description}</Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col width={12}>
                  <Form.Group label="Empreendimento">
                    {empreendimento}
                  </Form.Group>
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
            </React.Fragment>
          </Page.Card>
          <Page.Card title="Ações">
            <Grid.Row>
              <Grid.Col>
                <Form.Group label="Justificativa">
                  <Form.Textarea
                    name="justificativa"
                    value={justificativa}
                    placeholder="Atenção! A justificativa é pública..."
                    rows={6}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
            <Button
              disabled={justificativa.length < 1}
              icon="shopping-bag"
              onClick={() =>
                this.alteraDemanda(codigo, "Arquivada", justificativa)
              }
              color="danger"
            >
              Arquivar Demanda
            </Button>
            <Button
              disabled={justificativa.length < 1}
              icon="navigation"
              onClick={() =>
                this.alteraDemanda(codigo, "Em andamento", justificativa)
              }
              color="success"
            >
              Vincular a um Processo
            </Button>
          </Page.Card>
          <Button
            icon="chevrons-left"
            onClick={() => this.props.history.push("/listademandas/")}
          >
            Voltar para a lista de demandas
          </Button>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default Demanda;
