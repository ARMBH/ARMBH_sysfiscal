import React from "react";
import Moment from "moment";

const DataPorExtenso = data => {
  //Esta Funcao Subtrai 3 horas do tempo UTC. Utilizada para evitar erro no horario do servidor/cliente
  return (
    <span>
      {Moment(data.data)
        .utc()
        .subtract(3, "hours")
        .format("LLL")}
    </span>
  );
};

export default DataPorExtenso;
