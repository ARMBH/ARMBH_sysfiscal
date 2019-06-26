import React from "react";

import TodoInput from "./TodoInput";
import TodoPublicList from "./TodoPublicList";

const TodoPublicWrapper = () => {
  return (
    <React.Fragment>
      <TodoInput isPublic />
      <TodoPublicList />
    </React.Fragment>
  );
};

export default TodoPublicWrapper;
