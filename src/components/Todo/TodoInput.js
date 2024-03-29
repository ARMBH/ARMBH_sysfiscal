import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { GET_MY_TODOS } from "./TodoPrivateList";
import { Form } from "tabler-react";

const ADD_TODO = gql`
  mutation($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

const TodoInput = ({ isPublic = false }) => {
  let input;
  const [todoInput, setTodoInput] = useState("");
  const updateCache = (cache, { data }) => {
    // If this is for the public feed, do nothing
    if (isPublic) {
      return null;
    }
    // Fetch the todos from the cache
    const existingTodos = cache.readQuery({
      query: GET_MY_TODOS
    });
    // Add the new todo to the cache
    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({
      query: GET_MY_TODOS,
      data: { todos: [newTodo, ...existingTodos.todos] }
    });
  };

  const resetInput = data => {
    console.log(data.insert_todos.returning[0].title);
    setTodoInput("");
    input.focus();
  };

  return (
    <Mutation mutation={ADD_TODO} update={updateCache} onCompleted={resetInput}>
      {(addTodo, { loading, data }) => {
        return (
          <div style={{ padding: "1.5rem" }}>
            <Form
              onSubmit={e => {
                e.preventDefault();
                if (todoInput.length > 3)
                  addTodo({ variables: { todo: todoInput, isPublic } });
                else alert("Digite ao menos 3 caracteres.");
              }}
            >
              <input
                className={
                  todoInput.length > 3
                    ? "form-control is-valid"
                    : "form-control "
                }
                placeholder="Adicionar nova tarefa..."
                value={todoInput}
                onChange={e => setTodoInput(e.target.value)}
                ref={n => (input = n)}
              />
              <i className="inputMarker fa fa-angle-right" />
            </Form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default TodoInput;
