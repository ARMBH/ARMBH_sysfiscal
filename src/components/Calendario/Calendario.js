import React, { Component } from "react";
import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Page, Grid, Card, Button } from "tabler-react";
import { QUERY_PROCESSOS_STATUS } from "./CalendarioQueries";
import { toast } from "react-toastify";
import ModalStatus from "../Status/ModalStatus";

//Calendario
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendario.css";

const localizer = momentLocalizer(moment);
const defaultMessages = {
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia inteiro",
  week: "Semana",
  work_week: "Semana Útil",
  day: "Dia",
  month: "Mês",
  previous: "Voltar",
  next: "Próximo",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  today: "Hoje",
  agenda: "Agenda",

  noEventsInRange: "Não existem eventos nesta data.",

  showMore: total => `+${total} mais`
};

class Calendario extends Component {
  constructor(props) {
    super(props);
    const hoje = new Date();

    this.state = {
      meucalendario: false,
      hoje: hoje,
      myEvents: []
    };

    if (this.props.match.path === "/meucalendario")
      this.state.meucalendario = true;
  }

  componentDidMount() {
    this.atualizaData(this.state.hoje);
    const userLogado = this.props.auth.getSub();
    this.setState({ userLogado: userLogado });
  }

  atualizaData(e) {
    const endDate = moment(e)
      .add(60, "days")
      .format("YYYY-MM-DD");
    const startDate = moment(e)
      .subtract(60, "days")
      .format("YYYY-MM-DD");

    this.setState(
      { startDate: startDate, endDate: endDate },
      this.getEventos()
    );
    //console.log('Data Inicial: ' + startDate + ' Data Final: ' + endDate);
  }

  getEventos() {
    this.props.client.mutate({
      mutation: QUERY_PROCESSOS_STATUS,
      variables: {
        startDate: this.state.startDate,
        endDate: this.state.endDate
      },
      update: (cache, data) => {
        if (data) {
          if (data.data.processos_status.length === 0) {
            toast.error("Não há eventos no período.");
            return false;
          } else {
            //toast.success('Eventos carregados com sucesso!');
            this.setState(
              { data: data.data.processos_status },
              this.setMyEvents(data.data.processos_status)
            );
          }
        }
      }
    });
  }
  /**
	{
		id: 0,
		title: 'All Day Event very long title',
		allDay: true,
		start: new Date(2019, 7, 1),
		end: new Date(2019, 7, 1),
		isMine: true,
		desc: 'Evento muito bonito que vamos atender aqui vamos ver se fica grande demais'
	},
 */
  setMyEvents(data) {
    let myEvents = [];
    data.map((item, index) => {
      //console.log(item);
      let desc =
        "Processo " +
        item.processo.id +
        " - " +
        item.processo.name +
        " - " +
        item.status.name;
      let isMine = false;

      if (item.processo.user_id === this.state.userLogado) {
        desc = desc + ". Este Processo foi iniciado por você.";
        isMine = true;
      }

      myEvents[index] = {
        id: item.id,
        processo_id: item.processo.id,
        title:
          item.processo.id +
          " - " +
          item.processo.name +
          " - " +
          item.status.name,
        allDay: true,
        start: item.due_date,
        end: item.due_date,
        desc: desc,
        type: item.status.type,
        status_id: item.status.id,
        user_id: item.processo.user_id,
        isMine: isMine
      };

      if (this.state.meucalendario) {
        if (!isMine) delete myEvents[index];
        //Apenas Adiciona os eventos que sao do usuario
      }

      return null;
    });

    const novoId = myEvents.length + 1;
    myEvents.push({
      id: novoId,
      title: "Hoje",
      allDay: true,
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
      desc: "Hoje!"
    });
    this.setState({ myEvents: myEvents });
    //console.log(myEvents);
  }

  //Muda a cor com base nas propriedades do Evento
  eventPropGetter = (event, start, end, isSelected) => {
    //console.log(event.type);
    let newStyle = {
      backgroundColor: "lightgrey",
      color: "black",
      borderRadius: "0px",
      border: "none"
    };

    if (event.type === "success") {
      newStyle.backgroundColor = "lightgreen";
    }

    if (event.type === "warning") {
      newStyle.backgroundColor = "orange";
    }

    if (event.type === "danger") {
      newStyle.backgroundColor = "red";
    }

    if (event.status_id === 1) {
      newStyle.backgroundColor = "LightSkyBlue";
    }

    if (event.user_id === this.state.userLogado) {
      newStyle.border = "dotted";
      newStyle.borderWidth = "2px";
    }
    return {
      className: event.type,
      style: newStyle
    };
  };

  modalAbrir(e) {
    this.setState({ eventAbrir: e });
  }

  render() {
    const { userLogado, meucalendario, eventAbrir } = this.state;

    let contentTitle = "Calendário de Status";
    let cardTitle = "Consulta ao Calendário";

    if (meucalendario) {
      contentTitle = "Meu Calendário";
      cardTitle = "Consulta ao meu Calendário";
    }

    return (
      <SiteWrapper {...this.props}>
        <Page.Content title={contentTitle}>
          <Grid.Row cards deck>
            <React.Fragment>
              <Card>
                <Card.Header>
                  <Card.Title>
                    {eventAbrir ? (
                      <React.Fragment>
                        <ModalStatus
                          title={eventAbrir.title}
                          processo_id={eventAbrir.processo_id}
                        />{" "}
                        <strong>Informações:</strong> {eventAbrir.title}{" "}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>{cardTitle}</React.Fragment>
                    )}
                  </Card.Title>
                  <Card.Options>
                    <Button.List align="right">
                      {meucalendario ? (
                        <Button
                          icon="calendar"
                          //type="submit"
                          color="warning"
                          className="ml-auto"
                          onClick={() =>
                            this.props.history.push("/calendario/")
                          }
                        >
                          Ir para o Calendário Geral
                        </Button>
                      ) : (
                        <Button
                          icon="calendar"
                          //type="submit"
                          color="primary"
                          className="ml-auto"
                          onClick={() =>
                            this.props.history.push("/meucalendario/")
                          }
                        >
                          Ir para o Meu Calendário
                        </Button>
                      )}
                    </Button.List>
                  </Card.Options>
                </Card.Header>
                <Card.Body className="calendario">
                  {userLogado ? (
                    <Calendar
                      localizer={localizer}
                      events={this.state.myEvents}
                      startAccessor="start"
                      endAccessor="end"
                      messages={defaultMessages}
                      onNavigate={e => this.atualizaData(e)}
                      onSelectEvent={event => this.modalAbrir(event)}
                      eventPropGetter={this.eventPropGetter}
                    />
                  ) : (
                    "Carregando..."
                  )}
                </Card.Body>
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
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default Calendario;
