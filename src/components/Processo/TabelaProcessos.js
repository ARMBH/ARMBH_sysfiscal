import React, { Component } from "react";
import Moment from "moment";
import { Button, Badge, Form, Icon } from "tabler-react";
import { Link } from "react-router-dom";
import { Table, Card } from "tabler-react";
import ModalStatus from "../Status/ModalStatus";
import "./Processos.css";

var Highlight = require("react-highlighter");
class TabelaProcessos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      //data: props.data,
      updatedList: props.data
    };
  }
  refreshList() {
    this.setState({ value: "", updatedList: this.props.data });
  }
  filterList = e => {
    let { value } = e.target;
    this.setState({ value }, () => {
      var updatedList = this.props.data;
      var searchValue = this.state.value.toLowerCase();
      //Filtro deve ser personalizado por causa da resposta da Query;
      updatedList = updatedList.filter(item => {
        if (
          item.processo.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.processo.municipio.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.status.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.processo.user.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.due_date
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.processo.id
            //.toLowerCase()
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
  gotoProcesso(id) {
    this.props.history.push("/processo/" + id);
  }
  componentWillUnmount() {
    this.setState({ updatedList: [] });
  }
  render() {
    const { updatedList, value } = this.state;
    const { userLogado, data } = this.props;

    let cardTitle = "Nenhum processo encontrado";
    if (updatedList.length > 0)
      cardTitle = "Mostrando " + updatedList.length + " processos";
    else cardTitle = "Nenhum processo encontrado";

    //if (data.length !== updatedList.length && value === '') this.refreshList();
    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title>{cardTitle}</Card.Title>
            <Card.Options>
              <Form.Input
                value={this.state.value}
                placeholder="Busque por processos..."
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
              Novos processos foram cadastrados.
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
                    <Table.ColHeader>Nº</Table.ColHeader>
                    <Table.ColHeader>Empreendimento</Table.ColHeader>
                    <Table.ColHeader>Criado por</Table.ColHeader>
                    <Table.ColHeader>Status</Table.ColHeader>
                    <Table.ColHeader>Município</Table.ColHeader>
                    <Table.ColHeader>Prazo</Table.ColHeader>
                    <Table.ColHeader />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {updatedList.map((processo, index) => (
                    <Table.Row key={index}>
                      <Table.Col>
                        {processo.processo.id}
                        {" / "}
                        {Moment(processo.processo.created_at).format("YYYY")}
                      </Table.Col>
                      <Table.Col>
                        <Highlight matchClass="highlightNovo" search={value}>
                          <Link to={"/processo/" + processo.processo.id}>
                            {processo.processo.name}
                          </Link>
                        </Highlight>
                      </Table.Col>
                      <Table.Col>{processo.processo.user.name}</Table.Col>
                      <Table.Col>
                        {Moment().diff(processo.processo.due_date, "hours") <
                        24 ? (
                          <React.Fragment>
                            <Badge color="success">Recente</Badge>{" "}
                          </React.Fragment>
                        ) : (
                          ""
                        )}
                        <Badge color={processo.status.type}>
                          {processo.status.name}
                        </Badge>
                      </Table.Col>
                      <Table.Col>{processo.processo.municipio.name}</Table.Col>
                      <Table.Col>
                        {Moment(processo.due_date).format("DD/MM/YYYY")}
                      </Table.Col>
                      <Table.Col>
                        <ModalStatus
                          title={processo.processo.name}
                          processo_id={processo.processo.id}
                        />{" "}
                        {userLogado === processo.processo.user.id ? (
                          <Button
                            size="sm"
                            color="primary"
                            icon="edit"
                            onClick={() =>
                              this.gotoProcesso(processo.processo.id)
                            }
                          />
                        ) : (
                          <Button
                            size="sm"
                            color="secondary"
                            icon="eye"
                            onClick={() =>
                              this.gotoProcesso(processo.processo.id)
                            }
                          />
                        )}
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </React.Fragment>
          ) : (
            <Card.Body>Nenhum processo encontrado.</Card.Body>
          )}
          <Card.Footer>
            {" "}
            <Button.List align="right">
              <Button
                color="success"
                icon="file-plus"
                onClick={() => this.props.history.push("/novoprocesso/")}
              >
                Adicionar Novo processo
              </Button>
            </Button.List>
          </Card.Footer>
        </Card>
      </React.Fragment>
    );
  }
}

export default TabelaProcessos;
