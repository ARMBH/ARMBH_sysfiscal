import React from "react";
import { ADD_HISTORICO } from "../Historico/HistoricoQueries";

class HistoricoLog extends React.Component {
  logar(client, processo_id, tipo, title) {
    //console.log('Foi passado: ' + processo_id + tipo + title);
    client.mutate({
      mutation: ADD_HISTORICO,
      variables: {
        title,
        processo_id,
        tipo
      }
    });
  }
}

const logar = new HistoricoLog();

export default logar;
