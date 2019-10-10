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

*/
import React, { Component } from "react";
//import logar from "../Historico/HistoricoLog";
import { QUERY_DEMANDA, EDIT_DEMANDA } from "./DemandaQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Form, Button, Page, Grid } from "tabler-react";
import { toast } from "react-toastify";
import VincularDemandaProcesso from "./VincularDemandaProcesso";
import DemandaSumario from "./DemandaSumario";

class Demanda extends Component {
  constructor() {
    super();
    this.state = {
      codigo: "",
      justificativa: "",
      exibir: false
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
            setTimeout(() => {
              window.scrollTo(0, 0);
              this.props.history.push("/listademandas/");
            }, 2000);
            return true;
          } else {
            toast.error("Erro ao alterar demanda.");
            return false;
          }
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
        return false;
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
    const { codigo, exibir, justificativa } = this.state;

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={"Demanda"}>
          {exibir ? (
            <React.Fragment>
              <DemandaSumario codigo={codigo} {...this.props} />
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
                <VincularDemandaProcesso
                  {...this.props}
                  codigo={codigo}
                  justificativa={justificativa}
                  alteraDemanda={this.alteraDemanda}
                />
                <Grid.Row>
                  <Grid.Col width={3}>
                    <Form.Group label="Outras Ações">
                      <Button
                        disabled={justificativa === null}
                        icon="shopping-bag"
                        onClick={() =>
                          this.alteraDemanda(codigo, "Arquivada", justificativa)
                        }
                        color="danger"
                      >
                        Arquivar Demanda
                      </Button>
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
              </Page.Card>
            </React.Fragment>
          ) : (
            "Demanda não encontrada."
          )}
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
