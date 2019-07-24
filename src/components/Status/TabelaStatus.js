import React, { Component } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import MomentComponent from "react-moment";
import { QUERY_PROCESSOS_STATUS } from "./StatusQueries";
import {
  Table,
  Tag,
  Button,
  Page,
  Grid,
  Badge,
  Form,
  Icon,
  Card
} from "tabler-react";
import Moment from "moment";
import { Query } from "react-apollo";

class ModalStatus extends Component {
  isToday(due_date) {
    //Se está no futuro
    if (Moment().diff(due_date, "hours") < 24) {
      //Se falta mais de 2 dias
      if (Moment().diff(due_date, "hours") < -48) return "success";

      //Se falta menos de 2 dias
      return "danger";
    }

    if (Moment().diff(due_date, "hours") > 24) {
      //Em breve
      return "secondary";
    }

    return "secondary";
  }

  render() {
    const { id, title } = this.props;

    let cardTitle = "Nenhum status encontrado";
    return (
      <Query query={QUERY_PROCESSOS_STATUS} variables={{ processoId: id }}>
        {({ loading, error, data }) => {
          if (loading) return "Carregando...";
          if (error) return `Erro! ${error.message}`;
          if (data.processos_status.length > 0) {
            cardTitle =
              "Processo " +
              id +
              " - " +
              title +
              " (" +
              data.processos_status.length +
              " status";
            if (data.processos_status.length > 1) cardTitle = cardTitle + "";
            cardTitle = cardTitle + ")";
            //console.log(data.processos_status);
          } else cardTitle = "Sem status";
          return (
            <React.Fragment>
              <Card title={cardTitle}>
                {data.processos_status.length > 0 ? (
                  <Table
                    cards={true}
                    striped={true}
                    responsive={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader>Status</Table.ColHeader>
                        <Table.ColHeader>Prazo</Table.ColHeader>
                        <Table.ColHeader>Responsável</Table.ColHeader>
                        <Table.ColHeader>Descrição</Table.ColHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.processos_status.map((documento, index) => (
                        <Table.Row key={index}>
                          <Table.Col>
                            <Tag color={documento.status.type}>
                              {documento.status.name}
                            </Tag>
                          </Table.Col>
                          <Table.Col>
                            {" "}
                            {Moment(documento.due_date).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            <Tag color={this.isToday(documento.due_date)}>
                              <MomentComponent fromNow>
                                {documento.due_date}
                              </MomentComponent>
                            </Tag>
                          </Table.Col>
                          <Table.Col>{documento.user.name}</Table.Col>
                          <Table.Col>{documento.name}</Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <Card.Body>Nenhum status encontrado.</Card.Body>
                )}
              </Card>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ModalStatus;
