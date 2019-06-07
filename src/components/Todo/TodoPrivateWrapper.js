import React, { Component } from "react";

import TodoInput from "./TodoInput";
import TodoPrivateList from "./TodoPrivateList";

class TodoPrivateWrapper extends Component {
  render() {
    let { userId } = this.props;

    return (
      <React.Fragment>
        <TodoInput />
        <TodoPrivateList />
      </React.Fragment>
    );
  }
}

export default TodoPrivateWrapper;
