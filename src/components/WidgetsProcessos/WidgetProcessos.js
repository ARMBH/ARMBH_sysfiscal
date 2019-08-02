import React, { Component } from "react";
import ProcessoList from "./ProcessoList";

class WidgetProcessos extends Component {
  /**
  Props:
  isMine = retorna lista dos processos do usuário
  proximosAVencer = retorna lista dos processos que estão com prazos mais próximos de hoje
  
  Caso não haja Props: retorna lista dos últimos procesos cadastrados
   */
  render() {
    return (
      <React.Fragment>
        <ProcessoList {...this.props} />
      </React.Fragment>
    );
  }
}

export default WidgetProcessos;
