import React, { Component } from "react";
//Mutations
import { QUERY_PROCESSO } from "./ProcessoQueries";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import MenuProcesso from "./MenuProcesso";
//Componentes de Terceiros
import { Form, Button, Page, Grid, Container } from "tabler-react";
import { toast } from "react-toastify";
//import { Link } from "react-router-dom";
// Relativos à data:
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import ListaStatus from "../Status/ListaStatus";
registerLocale("pt-BR", ptBR);

class ProcessoFormVistorias extends Component {
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
                          <Form.Group label="Vistorias">
                            <ListaStatus
                              id={id}
                              title={name}
                              status_id={6}
                              {...this.props}
                            />
                          </Form.Group>
                        </Page.Card>
                        <Page.Card>
                          <Form.Group label="Todos os Status">
                            <ListaStatus id={id} title={name} {...this.props} />
                          </Form.Group>
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

export default ProcessoFormVistorias;
