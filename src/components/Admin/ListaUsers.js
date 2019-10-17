import React, { Component } from "react";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid } from "tabler-react";
import { QUERY_USERS } from "./AdminQueries";
import { Query } from "react-apollo";
import TabelaUsers from "./TabelaUsers";
import { toast } from "react-toastify";

class ListaUsers extends Component {
  constructor() {
    super();
    this.state = {
      last_update: ""
    };
  }

  componentDidMount() {
    //console.log(Date());
    this.setState({ last_update: Date() });

    if (!localStorage.getItem("roles").includes("admin")) {
      toast.error("Área reservada aos Admins.");
      this.props.history.push("/home");
    }
  }

  render() {
    let { auth } = this.props;
    const userLogado = auth.getSub();

    let contentTitle = "Gestão de usuários";
    let context = {
      headers: {
        "x-hasura-role": "admin"
      }
    };

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <Query query={QUERY_USERS} pollInterval={5000} context={context}>
              {({ loading, error, data }) => {
                if (loading) return "Carregando...";
                if (error) return `Erro! ${error.message}`;
                //console.log(data);
                return (
                  <React.Fragment>
                    <TabelaUsers
                      {...this.props}
                      size={data.users.length}
                      data={data.users}
                      userLogado={userLogado}
                      //categoria="Nova"
                    />
                  </React.Fragment>
                );
              }}
            </Query>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ListaUsers;
