import React, { Component } from "react";
//Mutations
import { QUERY_PROCESSO } from "./ProcessoQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import MenuProcesso from "./MenuProcesso";
//Componentes de Terceiros
import { Button, Page, Grid, Container } from "tabler-react";
import { toast } from "react-toastify";
//import { Link } from "react-router-dom";
// Relativos à data:
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt-BR", ptBR);

class ProcessoFormDemanda extends Component {
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

  gotoDemanda(id) {
    this.props.history.push("/demanda/" + id);
  }

  render() {
    //Declara variaveis do state/props para facilitar
    const { id, demanda_codigo } = this.state;

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
                        {demanda_codigo ? (
                          <React.Fragment>
                            <Page.Card title={"Consulta à demanda"}>
                              {demanda_codigo}
                              <Button.List align="right">
                                <Button
                                  size="sm"
                                  color="primary"
                                  icon="edit"
                                  onClick={() =>
                                    this.gotoDemanda(demanda_codigo)
                                  }
                                >
                                  Editar Demanda
                                </Button>
                              </Button.List>
                            </Page.Card>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Page.Card>
                              <Grid.Row>
                                Processo {id} não possui demanda vinculada.
                              </Grid.Row>
                              <Grid.Row>
                                <Button
                                  icon="book"
                                  color="primary"
                                  onClick={() =>
                                    this.props.history.push("/listademandas/")
                                  }
                                >
                                  Consultar lista de demandas
                                </Button>
                              </Grid.Row>
                            </Page.Card>
                          </React.Fragment>
                        )}
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

export default ProcessoFormDemanda;
