import React, { Component } from "react";
import { Button, Page } from "tabler-react";
import DenunciaNova from "./DenunciaNova";
import DenunciaConsulta from "./DenunciaConsulta";

//Esqueleto de Denúncia Anônima
class Denuncia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: "",
      consultar: false
    };
  }

  componentDidMount() {
    //Parametros da URL (após o ?)
    const paramsUrl = new URLSearchParams(this.props.location.search);
    const codigo = paramsUrl.get("codigo");
    if (codigo) this.setState({ codigo: codigo });
  }

  render() {
    const { codigo, consultar } = this.state;

    return (
      <React.Fragment>
        <Page.Content
          title={"Sistema de Fiscalização de Parcelamento de Solo da ARMBH"}
        >
          <Button.List>
            <Button
              color="success"
              onClick={() => (window.location.href = "/denuncia")}
            >
              Nova Denúncia
            </Button>
            <Button
              color="secondary"
              disabled={consultar}
              onClick={() => this.setState({ consultar: true, codigo: "" })}
            >
              Consultar Denúncia
            </Button>
          </Button.List>
          {codigo === "" && !consultar ? (
            <DenunciaNova {...this.props} />
          ) : (
            <DenunciaConsulta
              {...this.props}
              codigo={codigo}
              onClick={() => alert("clicou")}
            />
          )}
        </Page.Content>
      </React.Fragment>
    );
  }
}

export default Denuncia;
