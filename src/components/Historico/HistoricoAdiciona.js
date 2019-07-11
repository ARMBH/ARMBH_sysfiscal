import React, { Component } from "react";
import { Form, Badge, Icon, Button } from "tabler-react";
import { toast } from "react-toastify";
import logar from "../Historico/HistoricoLog";

class HistoricoAdiciona extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      name: "",
      disableForm: true
    };
  }

  handleChange = e => {
    //console.log(e.target.name + e.target.value);
    this.setState({ [e.target.name]: e.target.value.trimLeft() });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.name.length > 10) {
      toast.success(
        "Comentário salvo com sucesso no Processo " + this.props.processo_id
      );
      logar.logar(
        this.props.client,
        this.props.processo_id,
        3,
        this.state.name
      );
      this.setState({ name: " " });
    } else {
      toast.error("Erro ao salvar comentário.");
    }
  };

  render() {
    let { name, disableForm } = this.state;
    //console.log(name.trim().length);
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group
            label={
              <Form.Label
                aside={name ? name.trim().length + "/500" : "0/500"}
              />
            }
          >
            <Form.Textarea
              name="name"
              value={"" || name}
              placeholder="Digite um comentário (mín. 10 caracteres)"
              rows={2}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button.List align="right">
            <Button
              disabled={name.trim().length > 10 ? false : true}
              color="primary"
              type="submit"
            >
              <Icon name="plus-circle" />
              Adicionar Novo Comentário
            </Button>
          </Button.List>
        </Form>
      </React.Fragment>
    );
  }
}

export default HistoricoAdiciona;
