import React, { Component } from "react";
import { Mutation } from "react-apollo";

import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Form, Button, Page, Grid, Alert, Tag } from "tabler-react";
import { ADD_DOCUMENTO } from "./DocumentoQueries";
import { QUERY_PROCESSO } from "../Processo/ProcessoQueries";

import { toast } from "react-toastify";
import FileBase64 from "react-file-base64";
import "./InputFile.css";

import logar from "../Historico/HistoricoLog";

class DocumentoUpload extends Component {
  constructor() {
    super();
    this.state = {
      //id: '',
      title: "",
      origem_solicitacao: "",
      descricao: "",
      data_prazo: "",
      files: [],
      disableForm: true
    };
  }
  // Callback upload arquivos
  getFiles(files) {
    this.setState({ files: files });

    if (files.file.size > 10591292) {
      this.setState({ disableForm: true });
      toast.error(
        "O arquivo " +
          this.state.files.name +
          " tem mais de 10mb. Não é possível fazer upload. Selecione outro arquivo. "
      );
    } else {
      toast.info(
        "O arquivo " +
          this.state.files.name +
          " está pronto para ser enviado ao servidor. "
      );
      this.setState({ disableForm: false });
    }
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
            this.setState(data.data.processos[0]);
          }
        }
      }
    });
  }

  componentDidMount() {
    const { param } = this.props.match.params;
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

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCompleted = data => {
    if (this.state.id) {
      let message =
        "Documento " +
        this.state.files.name +
        " adicionado com sucesso ao processo " +
        this.state.id +
        "!";
      toast.success(message);
      logar.logar(this.props.client, this.state.id, "Documento", message);
      this.props.history.push(
        "/processo/" + data.insert_documentos.returning[0].processo_id
      );
    } else {
      toast.success(
        data.insert_documentos.returning[0].name + " criado com sucesso!"
      );
      this.setState(
        {
          ...data.insert_documentos.returning[0]
        },
        () => {
          this.props.history.push(
            "/processo/" + data.insert_documentos.returning[0].id
          );
        }
      );
    }
  };

  render() {
    //Declara variaveis do state/props para facilitar
    const { id, title, files, disableForm } = this.state;
    const { auth } = this.props;

    //Adquire ID do user que está logado para verificar se ele pode editar o formulário
    const userLogado = auth.getSub();

    /**
		if (!id || (user && user.id === userLogado)) disableForm = false;
		else disableForm = true;
 */

    //Altera o título de acordo com o Edição/Adição de Processo
    let contentTitle = "Adicionar Novo Documento";
    if (id) contentTitle = "Adicionar Novo Documento ao Processo nº " + id;

    let cardTitle = "Cadastro de Novo Documento";
    if (id) cardTitle = title + "";

    let mutation = ADD_DOCUMENTO;
    let mutationType = "add";

    return (
      <React.Fragment>
        <Mutation mutation={mutation} onCompleted={this.handleCompleted}>
          {(mutationProcesso, { loading, error }) => {
            return (
              <SiteWrapper {...this.props}>
                <Page.Content title={contentTitle}>
                  <Page.Card title={cardTitle}>
                    <Grid.Row cards deck>
                      <Grid.Col>
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            let variables = {
                              processo_id: id,
                              user_id: userLogado,
                              name: files.name,
                              type: files.type,
                              size: files.size,
                              base64: files.base64
                            };

                            mutationProcesso({
                              variables: variables
                            })
                              .then(res => {
                                //console.log(res);
                                if (!res.errors) {
                                  if (mutationType === "edit") {
                                    this.setState({
                                      updated_at: variables.updated_at
                                    });
                                  }
                                  //onCompleted é chamado caso entre aqui
                                } else {
                                  // Erros code 200
                                  toast.error("Erro 200: " + res);
                                  console.log("Erro 200: " + res);
                                }
                              })
                              .catch(e => {
                                //Erro de GraphQL
                                toast.error("Erro GraphQL: " + e);
                                //console.log("Erro GraphQL: " + e);
                              });
                          }}
                        >
                          {id ? (
                            <React.Fragment>
                              <FileBase64
                                multiple={false}
                                onDone={this.getFiles.bind(this)}
                                className="btn btn-primary ml-auto"
                              />
                            </React.Fragment>
                          ) : (
                            ""
                          )}
                          {error && (
                            <Alert type="danger">
                              Erro ao salvar Processo.
                            </Alert>
                          )}
                          {id ? (
                            <React.Fragment>
                              <Button.List align="right">
                                {id ? (
                                  <React.Fragment>
                                    <Button
                                      outline
                                      color="warning"
                                      icon="chevrons-left"
                                      onClick={() =>
                                        this.props.history.push(
                                          "/processo/" + id
                                        )
                                      }
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      icon="edit"
                                      type="submit"
                                      color="primary"
                                      className="ml-auto"
                                      disabled={disableForm}
                                    >
                                      {loading
                                        ? "Carregando..."
                                        : "Upload do Documento"}
                                    </Button>
                                  </React.Fragment>
                                ) : (
                                  <Tag color="secondary">
                                    {loading ? "Carregando..." : "ERRO"}
                                  </Tag>
                                )}
                              </Button.List>
                            </React.Fragment>
                          ) : (
                            <span>Erro</span>
                          )}
                        </Form>
                      </Grid.Col>
                    </Grid.Row>
                  </Page.Card>
                  <Button
                    icon="chevrons-left"
                    onClick={() => this.props.history.push("/listaprocessos/")}
                  >
                    Voltar para a lista
                  </Button>
                </Page.Content>
              </SiteWrapper>
            );
          }}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default DocumentoUpload;
