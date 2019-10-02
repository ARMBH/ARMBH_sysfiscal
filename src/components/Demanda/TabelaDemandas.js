import React, { Component } from "react";
import Moment from "moment";
import { Button, Badge, Form, Icon } from "tabler-react";
import { Link } from "react-router-dom";
import { Table, Card } from "tabler-react";
import "./Demandas.css";

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
        if (
          item.codigo
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.municipio.name
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.status_demanda
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.empreendimento
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.empreendedor
            .toLowerCase()
            .toString()
            .search(searchValue) !== -1 ||
          item.updated_at
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
  gotoDemanda(id) {
    this.props.history.push("/demanda/" + id);
  }
  componentWillUnmount() {
    this.setState({ updatedList: [] });
  }
  render() {
    const { updatedList, value } = this.state;
    const { userLogado, data } = this.props;
    console.log(userLogado);
    let cardTitle = "Nenhuma demanda encontrada";
    if (updatedList.length > 0)
      cardTitle = "Mostrando " + updatedList.length + " demandas";
    else cardTitle = "Nenhuma demanda encontrada";

    //if (data.length !== updatedList.length && value === '') this.refreshList();
    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title>{cardTitle}</Card.Title>
            <Card.Options>
              <Form.Input
                value={this.state.value}
                placeholder="Busque por demandas..."
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
              Novas demandas foram cadastradas.
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
                    <Table.ColHeader>Código</Table.ColHeader>
                    <Table.ColHeader>Empreendimento</Table.ColHeader>
                    <Table.ColHeader>Empreendedor</Table.ColHeader>
                    <Table.ColHeader>Status</Table.ColHeader>
                    <Table.ColHeader>Município</Table.ColHeader>
                    <Table.ColHeader>Últ.</Table.ColHeader>
                    <Table.ColHeader />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {updatedList.map((demanda, index) => (
                    <Table.Row key={index}>
                      <Table.Col>{demanda.codigo}</Table.Col>
                      <Table.Col>
                        <Highlight matchClass="highlightNovo" search={value}>
                          <Link
                            title={demanda.empreendimento}
                            to={"/demanda/" + demanda.codigo}
                          >
                            {demanda.empreendimento.substring(0, 18)}
                            {demanda.empreendimento.length > 18 ? "(...)" : ""}
                          </Link>
                        </Highlight>
                      </Table.Col>
                      <Table.Col>
                        {demanda.empreendedor.substring(0, 18)}{" "}
                        {demanda.empreendedor.length > 18 ? "(...)" : ""}
                      </Table.Col>
                      <Table.Col>
                        <Badge
                          color={
                            demanda.status_demanda === "Nova"
                              ? "success"
                              : demanda.status_demanda === "Arquivada"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {demanda.status_demanda}
                        </Badge>{" "}
                        {Moment().diff(demanda.updated_at, "hours") < 24 ? (
                          <React.Fragment>
                            <Badge color="secondary">Recente</Badge>{" "}
                          </React.Fragment>
                        ) : (
                          ""
                        )}
                      </Table.Col>
                      <Table.Col>{demanda.municipio.name}</Table.Col>
                      <Table.Col>
                        {Moment(demanda.updated_at).format("DD/MM/YYYY")}
                      </Table.Col>
                      <Table.Col>
                        <Button
                          size="sm"
                          color="primary"
                          icon="edit"
                          onClick={() => this.gotoDemanda(demanda.codigo)}
                        />
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </React.Fragment>
          ) : (
            <Card.Body>Nenhuma demanda encontrada.</Card.Body>
          )}
          <Card.Footer>
            {" "}
            <Button.List align="right">
              <Button
                color="success"
                icon="file-plus"
                onClick={() => this.props.history.push("/novademanda/")}
              >
                Adicionar Nova Demanda
              </Button>
            </Button.List>
          </Card.Footer>
        </Card>
      </React.Fragment>
    );
  }
}

export default TabelaDemandas;
