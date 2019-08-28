import React, { Component } from "react";
//Mutations
import { Mutation } from "react-apollo";
import { QUERY_PROCESSO, ADD_PROCESSO } from "./ProcessoQueries";
import { ADD_STATUS } from "../Status/StatusQueries";
import logar from "../Historico/HistoricoLog";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import ListaHistoricos from "../Historico/ListaHistoricos";
import HistoricoAdiciona from "../Historico/HistoricoAdiciona";
import MenuProcesso from "./MenuProcesso";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Container } from "tabler-react";
import { toast } from "react-toastify";
//import { Link } from "react-router-dom";
// Relativos à data:
import MomentPure from "moment";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt-BR", ptBR);

class ProcessoFormHistorico extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      due_date: ""
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
            toast.error(
              "Processo não encontrado ou você não possui permissão para visualizar este processo."
            );
            this.setState({ id: "" });
            this.props.history.push("/listaprocessos");
            return false;
          } else {
            this.setState({
              ...data.data.processos[0],
              oldState: data.data.processos[0]
            });
          }
        }
      }
    });
  }

  componentDidMount() {
    //Parametros do Routes.js
    const { param } = this.props.match.params;
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);

    //Caso haja demanda
    const demanda = paramsUrl.get("demanda");
    if (demanda) console.log(demanda);
    if (parseInt(param, 10) > 0) {
      this.setState(
        {
          id: param
        },
        () => {
          this.getProcesso(param);
        }
      );
    }
  }

  render() {
    //Declara variaveis do state/props para facilitar
    const { id, name } = this.state;

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    /*
    let { auth } = this.props;
    const userLogado = auth.getSub();
    let disableForm = true;

    if (!id || (user && user.id === userLogado)) disableForm = false;
    else disableForm = true;
*/
    return (
      <React.Fragment>
        <SiteWrapper {...this.props}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <MenuProcesso id={id} {...this.props} />
                <Grid.Col md={9}>
                  <Page.Content>
                    {id ? ( //Início da parte de Baixo quando o Processo já existe
                      <React.Fragment>
                        <Page.Card>
                          <Form.Group label="Histórico">
                            <ListaHistoricos id={id} title={name} />
                          </Form.Group>
                        </Page.Card>
                        <Page.Card>
                          <Form.Group label="Comentários">
                            <ListaHistoricos id={id} title={name} type={3} />
                          </Form.Group>
                          <HistoricoAdiciona
                            client={this.props.client}
                            processo_id={id}
                          />
                        </Page.Card>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    <Button
                      icon="chevrons-left"
                      onClick={() =>
                        this.props.history.push("/listaprocessos/")
                      }
                    >
                      Voltar para a lista
                    </Button>
                  </Page.Content>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </div>
        </SiteWrapper>
      </React.Fragment>
    );
  }
}

export default ProcessoFormHistorico;
