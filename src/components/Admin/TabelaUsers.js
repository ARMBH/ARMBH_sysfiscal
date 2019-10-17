import React, { Component } from "react";
import Moment from "moment";
import { Button, Badge, Form, Icon } from "tabler-react";
import { Link } from "react-router-dom";
import { Table, Card } from "tabler-react";
import "../Demanda/Demandas.css";

var Highlight = require("react-highlighter");
class TabelaDemandas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      //data: props.data,
      updatedList: props.data
    };
  }
  /** Função para filtro no futuro
 * 
 pickCategory(item) {
   if (item.status_demanda === "Nova") return item;
  }
  
  componentDidMount() {
    console.log(this.props);
    let lista = this.props.data.filter(this.pickCategory);
    this.setState({ updatedList: lista });
  }
  */

  refreshList() {
    this.setState({ value: "", updatedList: this.props.data });
  }

  filterList = e => {
    let { value } = e.target;
    this.setState({ value }, () => {
      var updatedList = this.props.data;
      //console.log(updatedList);
      var searchValue = this.state.value.toLowerCase();
      //Filtro deve ser personalizado por causa da resposta da Query;
      updatedList = updatedList.filter(item => {
        if (!item.last_seen) item.last_seen = "-";

        if (
          item.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.cpf
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.email
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.last_seen
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1
        )
          return item;
        return null;
        //return Object.keys(item).some(key => item[key].toString().search(searchValue) !== -1);
      });
      this.setState({ updatedList: updatedList });
    });
  };

  gotoUser(id) {
    this.props.history.push("/admin/user/" + id);
  }

  componentWillUnmount() {
    this.setState({ updatedList: [] });
  }
  render() {
    const { updatedList, value } = this.state;
    const { userLogado, data } = this.props;
    //console.log(userLogado);
    let cardTitle = "Nenhum usuário encontrado";
    if (updatedList.length > 0)
      cardTitle = "Mostrando " + updatedList.length + " usuários";
    else cardTitle = "Nenhum usuário encontrado";

    //if (data.length !== updatedList.length && value === '') this.refreshList();
    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title>{cardTitle}</Card.Title>
            <Card.Options>
              <Form.Input
                value={this.state.value}
                placeholder="Busque por usuários..."
                onChange={this.filterList}
              />
              {data.length !== updatedList.length ? (
                <Button
                  onClick={() => this.refreshList()}
                  color="primary"
                  size="sm"
                >
                  <Icon name="refresh-cw" />
                </Button>
              ) : (
                <Button disabled color="primary" size="sm">
                  <Icon name="refresh-cw" />
                </Button>
              )}
            </Card.Options>
          </Card.Header>
          {data.length !== updatedList.length && value === "" ? (
            <Card.Alert color="warning">
              {" "}
              Novos usuários foram cadastradas.
            </Card.Alert>
          ) : (
            ""
          )}
          {updatedList.length > 0 ? (
            <React.Fragment>
              <Table
                cards={true}
                striped={true}
                responsive={true}
                className="table-vcenter"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.ColHeader>CPF</Table.ColHeader>
                    <Table.ColHeader>Nome</Table.ColHeader>
                    <Table.ColHeader>Email</Table.ColHeader>
                    <Table.ColHeader>Perfil</Table.ColHeader>
                    <Table.ColHeader>Visto por último</Table.ColHeader>
                    <Table.ColHeader />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {updatedList.map((user, index) => (
                    <Table.Row key={index}>
                      <Table.Col>{user.cpf}</Table.Col>
                      <Table.Col>
                        <Highlight matchClass="highlightNovo" search={value}>
                          <Link title={user.name} to={"admin/user/" + user.id}>
                            {user.name}
                          </Link>
                        </Highlight>
                      </Table.Col>
                      <Table.Col>{user.email}</Table.Col>
                      <Table.Col>{user.role}</Table.Col>
                      <Table.Col>
                        {user.last_seen && user.last_seen !== "-" ? (
                          <span>
                            <Badge>
                              {Moment(user.last_seen).format("DD/MM/YYYY")}
                            </Badge>
                            <Badge>
                              {Moment(user.last_seen).format("HH:mm:ss")}
                            </Badge>
                          </span>
                        ) : (
                          "-"
                        )}
                      </Table.Col>
                      <Table.Col>
                        <Button
                          size="sm"
                          color="primary"
                          icon="edit"
                          onClick={() => this.gotoUser(user.id)}
                        />
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </React.Fragment>
          ) : (
            <Card.Body>Nenhuma user encontrada.</Card.Body>
          )}
          <Card.Footer>
            {" "}
            <Button.List align="right">
              <Button
                color="success"
                icon="file-plus"
                onClick={() => this.props.history.push("/novauser/")}
              >
                Adicionar Nova user
              </Button>
            </Button.List>
          </Card.Footer>
        </Card>
      </React.Fragment>
    );
  }
}

export default TabelaDemandas;
