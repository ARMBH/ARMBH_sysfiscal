import React from "react";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { GET_MY_TODOS } from "./TodoPrivateList";
import { Table, Avatar, Icon, Form } from "tabler-react";
import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/pt-br";

import "../../styles/TodoItem.css";

const TodoItem = ({ index, todo, client }) => {
  const REMOVE_TODO = gql`
    mutation removeTodo($id: Int!) {
      delete_todos(where: { id: { _eq: $id } }) {
        affected_rows
      }
    }
  `;

  const removeTodo = e => {
    e.preventDefault();
    e.stopPropagation();
    client.mutate({
      mutation: REMOVE_TODO,
      variables: { id: todo.id },
      optimisticResponse: null,
      update: cache => {
        const existingTodos = cache.readQuery({ query: GET_MY_TODOS });
        const newTodos = existingTodos.todos.filter(t => t.id !== todo.id);
        cache.writeQuery({
          query: GET_MY_TODOS,
          data: { todos: newTodos }
        });
      }
    });
  };

  const TOGGLE_TODO = gql`
    mutation toggleTodo($id: Int!, $isCompleted: Boolean!) {
      update_todos(
        where: { id: { _eq: $id } }
        _set: { is_completed: $isCompleted }
      ) {
        affected_rows
      }
    }
  `;

  const toggleTodo = () => {
    client.mutate({
      mutation: TOGGLE_TODO,
      variables: { id: todo.id, isCompleted: !todo.is_completed },
      optimisticResponse: null,
      update: cache => {
        const existingTodos = cache.readQuery({ query: GET_MY_TODOS });
        const newTodos = existingTodos.todos.map(t => {
          if (t.id === todo.id) {
            return { ...t, is_completed: !t.is_completed };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: GET_MY_TODOS,
          data: { todos: newTodos }
        });
      }
    });
  };

  return (
    <Table.Row>
      <Table.Col>
        <Avatar>{todo.id}</Avatar>
      </Table.Col>
      <Table.Col>
        <span
          className={
            "labelContent" + (todo.is_completed ? " todoCompleto" : "")
          }
        >
          {todo.title}
        </span>
      </Table.Col>
      <Table.Col className="text-nowrap">
        <span
          className={
            "labelContent" + (todo.is_completed ? " todoCompleto" : "")
          }
        >
          <Moment fromNow>{todo.created_at}</Moment>
        </span>
      </Table.Col>
      <Table.Col>
        <Form.Switch
          name="tandcs"
          value="tandcs"
          checked={todo.is_completed}
          id={todo.id}
          onChange={toggleTodo}
        />
        <Icon link={true} onClick={removeTodo} name="trash" />
      </Table.Col>
    </Table.Row>
  );
};

export default withApollo(TodoItem);
