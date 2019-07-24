import React, { Component } from "react";
import Modal from "react-modal";
import { Button, Icon, Card } from "tabler-react";
import TabelaStatus from "./TabelaStatus";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

Modal.setAppElement("#root");

class ModalStatus extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { processo_id, title } = this.props;

    if (!this.state.modalIsOpen)
      return (
        <Button size="sm" color="purple" onClick={this.openModal}>
          <Icon name="info" />
        </Button>
      );

    let cardTitle = "Status do Processo " + processo_id + " - " + title;
    //Caso queira estilizar um elemento ao abrir Modal
    //<h2 ref={subtitle => (this.subtitle = subtitle)}>Status do Processo {processo_id}</h2>

    return (
      <div>
        <Button size="sm" onClick={this.openModal}>
          <Icon name="eye" />
        </Button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <Card statusColor="purple">
            <Card.Header>
              <Card.Title>{cardTitle}</Card.Title>
              <Card.Options>
                <Button size="sm" onClick={this.closeModal}>
                  <Icon name="x" />
                </Button>
              </Card.Options>
            </Card.Header>
            <Card.Body>
              <TabelaStatus title={title} id={processo_id} />
            </Card.Body>
          </Card>
        </Modal>
      </div>
    );
  }
}

export default ModalStatus;
