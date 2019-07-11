import React from "react";
import { ADD_HISTORICO } from "../Historico/HistoricoQueries";

class HistoricoLog extends React.Component {
  logar(client, processo_id, historico_tipo_id, name) {
    //console.log('Foi passado: ' + processo_id + historico_tipo_id + name);
    client.mutate({
      mutation: ADD_HISTORICO,
      variables: {
        name,
        processo_id,
        historico_tipo_id
      }
    });
  }
}

const logar = new HistoricoLog();

export default logar;
