import React, { Component } from "react";
//Componentes do Projeto
import SiteWrapper from "../SiteWrapper/SiteWrapper";
//Componentes de Terceiros
import { Button, Page, Card } from "tabler-react";
import { toast } from "react-toastify";
import gql from "graphql-tag";

const QUERY_TOTAL = gql`
  {
    documentos_aggregate {
      aggregate {
        count
      }
    }
    enderecos_aggregate {
      aggregate {
        count
      }
    }
    processos_status_aggregate {
      aggregate {
        count
      }
    }
    processos_aggregate {
      aggregate {
        count
      }
    }
    todos_aggregate {
      aggregate {
        count
      }
    }
  }
`;

class DashboardAdmin extends Component {
  constructor() {
    super();
    this.state = { data: null };
  }

  componentDidMount() {
    if (!localStorage.getItem("roles").includes("admin")) {
      toast.error("Área reservada aos Admins.");
      this.props.history.push("/home");
    }
  }

  getTotal() {
    this.props.client
      .mutate({
        mutation: QUERY_TOTAL,
        context: {
          headers: {
            "x-hasura-role": "admin"
          }
        },
        update: (cache, data) => {
          if (data) {
            this.setState({ data: data.data });
          }
        }
      })
      .catch(error => {
        toast.error("Atenção! " + error);
      });
  }

  render() {
    const { data } = this.state;

    let contentTitle = "Dashboard Administração";
    //let cardTitle = 'Dashboard Administração';

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Card>
            <Button onClick={() => this.getTotal()}>Calcular Total</Button>
          </Card>
          {data ? (
            <React.Fragment>
              {Object.keys(data).map(function(keyName, keyIndex) {
                // use keyName to get current key's name
                // and a[keyName] to get its value
                return (
                  <span key={keyIndex}>
                    {data[keyName]["aggregate"]["__typename"]}:
                    {data[keyName]["aggregate"]["count"]}
                    {data[keyIndex]} <br />
                  </span>
                );
              })}
            </React.Fragment>
          ) : (
            ""
          )}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DashboardAdmin;
