import React from "react";
import { withApollo } from "react-apollo";
import { Table, Icon, Badge } from "tabler-react";
import Moment from "moment";
import MomentComponent from "react-moment";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
//import "moment-timezone";
import "moment/locale/pt-br";

import "../../styles/TodoItem.css";
import "./WidgetsProcessosStyle.css";

const TodoItem = ({ index, todo, client, userId }) => {
  const link = "/processo/" + todo.processo_id;

  return (
    <Table.Row>
      <Table.Col>
        {todo.processo_id}/{Moment(todo.processo.created_at).format("YYYY")}
      </Table.Col>
      <Table.Col>
        <span className={userId === todo.processo.user.id ? "isMine" : ""}>
          {todo.processo.name}
        </span>
        : {todo.name} (
        <MomentComponent fromNow>{todo.created_at}</MomentComponent>)
      </Table.Col>
      <Table.Col>
        <Badge color={todo.historico_tipo.type}>
          {todo.historico_tipo.name}{" "}
        </Badge>{" "}
      </Table.Col>
      <Table.Col>
        <span
          data-for={
            todo.processo.user.name + "id_hist" + index + todo.processo.id
          }
          data-tip={"Responsável: " + todo.processo.user.name}
        >
          <ReactTooltip
            id={todo.processo.user.name + "id_hist" + index + todo.processo.id}
          />
          <Link className="btn-sm btn-primary ml-auto" to={link}>
            <Icon name="edit" />
          </Link>
        </span>
      </Table.Col>
    </Table.Row>
  );
};

export default withApollo(TodoItem);
