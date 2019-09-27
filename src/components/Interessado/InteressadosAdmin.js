import React, { Component } from "react";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page } from "tabler-react";
import ListaInteressadosAdmin from "./ListaInteressadosAdmin";

class InteressadosAdmin extends Component {
  constructor() {
    super();
    this.state = {
      last_update: ""
    };
  }

  componentDidMount() {
    //console.log(Date());
    this.setState({ last_update: Date() });
  }

  render() {
    let contentTitle = "Lista de todos os interessados";
    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <ListaInteressadosAdmin {...this.props} />
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default InteressadosAdmin;
