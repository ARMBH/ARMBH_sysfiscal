import React, { Component } from "react";
//import '../../styles/App.css';
//import "../../styles/Denuncia.css";
//import { Link } from "react-router-dom";

class Denuncia extends Component {
  criaCookie() {
    //COOKIE EM SEGUNDOS
    document.cookie = "reader=restringe;max-age=60*60*12";
    //ES2016
    alert("COOKIE CRIADO");
  }

  checkCookie() {
    console.log(document.cookie);
    if (
      document.cookie
        .split(";")
        .filter(item => item.trim().startsWith("reader=")).length
    ) {
      alert('The cookie "reader" exists (ES6)');
    } else {
      alert("Coookie nao existe. Pode Postar");
    }
  }

  render() {
    return <React.Fragment>Faça uma denúncia anônima</React.Fragment>;
  }
}

export default Denuncia;
