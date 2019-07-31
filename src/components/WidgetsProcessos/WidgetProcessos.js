import React, { Component } from "react";
import ProcessoList from "./ProcessoList";

class WidgetProcessos extends Component {
  render() {
    return (
      <React.Fragment>
        <ProcessoList {...this.props} />
      </React.Fragment>
    );
  }
}

export default WidgetProcessos;
