import React, { Component, Fragment } from "react";

import TodoItem from "./TodoItem";
//import TodoFilters from './TodoFilters';
import gql from "graphql-tag";
import { Query } from "react-apollo";
//import moment from 'moment';
import { Table, Card } from "tabler-react";

const GET_HISTORICOS = gql`
  query getHistoricosUltimosGeral {
    historicos(limit: 10, order_by: { created_at: desc }) {
      created_at
      historico_tipo {
        id
        name
        type
      }
      id
      name
      processo_id
      processo {
        id
        name
        created_at
        user {
          id
          name
        }
      }
      user {
        id
        name
      }
    }
  }
`;

class ProcessoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      clearInProgress: false
    };

    this.filterResults = this.filterResults.bind(this);

    // Set the apollo client
    this.client = props.client;
  }

  filterResults(filter) {
    this.setState({
      ...this.state,
      filter: filter
    });
  }

  render() {
    const { todos } = this.props;

    let filteredTodos = todos;
    if (this.state.filter === "active") {
      filteredTodos = todos.filter(todo => todo.is_completed !== true);
    } else if (this.state.filter === "completed") {
      filteredTodos = todos.filter(todo => todo.is_completed === true);
    }
    const todoList = [];
    filteredTodos.forEach((todo, index) => {
      todoList.push(
        <TodoItem
          userId={this.props.userId}
          key={index}
          index={index}
          todo={todo}
        />
      );
    });

    return (
      <Fragment>
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
              <Table.ColHeader>Tipo</Table.ColHeader>
              <Table.ColHeader />
            </Table.Row>
          </Table.Header>
          <Table.Body>{todoList}</Table.Body>
        </Table>
        <Card.Footer>{todoList.length} itens</Card.Footer>
      </Fragment>
    );
  }
}

const ProcessoListQuery = props => {
  let query = GET_HISTORICOS;
  let variables = {};

  return (
    <Query query={query} variables={variables} pollInterval={3000}>
      {({ loading, error, data, client }) => {
        if (loading) {
          return <div>Carregando...</div>;
        }
        if (error) {
          console.error(error);
          return <div>Error!</div>;
        }
        return (
          <ProcessoList
            userId={props.userId}
            client={client}
            todos={data.historicos}
          />
        );
      }}
    </Query>
  );
};

export default ProcessoListQuery;
export { GET_HISTORICOS };
