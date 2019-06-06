/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button } from "tabler-react";
import "../../styles/TodoItem.css";

const TodoFilters = ({
  todos,
  currentFilter,
  filterResultsFn,
  clearCompletedFn
}) => {
  const filterResultsHandler = filter => {
    return () => {
      filterResultsFn(filter);
    };
  };

  // The clear completed button if these are personal todos
  const clearCompletedButton = (
    <Button
      outline
      onClick={clearCompletedFn}
      className="clearComp"
      color="danger"
      size="sm"
    >
      Excluir completos
    </Button>
  );

  const activeTodos = todos.filter(todo => todo.is_completed !== true);

  let itemCount = todos.length;

  if (currentFilter === "active") {
    itemCount = activeTodos.length;
  } else if (currentFilter === "completed") {
    itemCount = todos.length - activeTodos.length;
  }

  return (
    <React.Fragment>
      <Button.List align="center">
        <Button
          color={currentFilter === "all" ? "success" : ""}
          className="mudaCursor"
          size="sm"
        >
          {" "}
          {itemCount} item
          {itemCount !== 1 ? "s" : ""}
        </Button>
        <Button
          outline
          onClick={filterResultsHandler("all")}
          color="primary"
          size="sm"
          className={currentFilter === "all" ? "selected" : ""}
        >
          Todos
        </Button>
        <Button
          outline
          color="secondary"
          size="sm"
          onClick={filterResultsHandler("active")}
          className={currentFilter === "active" ? "selected" : ""}
        >
          Ativos
        </Button>
        <Button
          outline
          color="warning"
          size="sm"
          onClick={filterResultsHandler("completed")}
          className={currentFilter === "completed" ? "selected" : ""}
        >
          Completos
        </Button>
        {clearCompletedButton}
      </Button.List>
    </React.Fragment>
  );
};

export default TodoFilters;
