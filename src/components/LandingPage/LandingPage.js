import React, { Component } from "react";
import PropTypes from "prop-types";
//import '../../styles/App.css';
import "../../styles/LandingPage.css";
import { Link } from "react-router-dom";
class LandingPage extends Component {
  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    //const reactLogo = require('../../images/React-logo.png');
    //const authLogo = require('../../images/auth.png');
    //const graphql = require('../../images/graphql.png');
    //const hasuraLogo = require('../../images/green-logo-white.svg');
    //const apolloLogo = require('../../images/apollo.png');
    const rightImg = require("../../images/right-img.png");

    return (
      <div className="gradientBgColor minHeight">
        <div>
          <div className="headerWrapper">
            <div className="headerDescription">
              {isAuthenticated() && <Link to="/home">Sysfiscal App</Link>}
              {!isAuthenticated() && <span>Sysfiscal App</span>}
            </div>
            <div className="loginBtn">
              {!isAuthenticated() && (
                <button
                  id="qsLoginBtn"
                  bsstyle="primary"
                  className="btn-margin logoutBtn"
                  onClick={this.login.bind(this)}
                >
                  Log In
                </button>
              )}
              {isAuthenticated() && (
                <button
                  id="qsLogoutBtn"
                  bsStyle="primary"
                  className="btn-margin logoutBtn"
                  onClick={this.logout.bind(this)}
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
          <div className="mainWrapper">
            <div className="col-md-5 col-sm-6 col-xs-12 noPadd">
              <div className="appstackWrapper">
                <div className="appStack">
                  <div className="col-md-1 col-sm-1 col-xs-2 removePaddLeft flexWidth">
                    <i className="em em-fast_forward" />
                  </div>
                  <div className="col-md-11 col-sm-11 col-xs-10 noPadd">
                    <div className="description">ARMBH</div>
                    <div className="description removePaddBottom">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="http://www.agenciarmbh.mg.gov.br/"
                      >
                        Visite o site oficial da Agência
                      </a>
                    </div>
                  </div>
                </div>
                <div className="appStack">
                  <div className="col-md-1 col-sm-1 col-xs-2 removePaddLeft flexWidth">
                    <i className="em em-fast_forward" />
                  </div>
                  <div className="col-md-11 col-sm-11 col-xs-10 noPadd">
                    <div className="description">Processo de Fiscalização</div>
                    <div className="description removePaddBottom">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="http://www.agenciarmbh.mg.gov.br/processos-fiscalizacao-parcelamento/"
                      >
                        Conheça o processo de fiscalização
                      </a>
                    </div>
                  </div>
                </div>
                <div className="appStack">
                  <div className="col-md-1 col-sm-1 col-xs-2 removePaddLeft flexWidth">
                    <i className="em em-star" />
                  </div>
                  <div className="col-md-11 col-sm-11 col-xs-10 noPadd">
                    <div className="description removePaddBottom">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/danperrout/ARMBH_sysfiscal"
                      >
                        Consulte o repositório Front-end
                      </a>
                    </div>
                  </div>
                </div>
                <div className="appStack removePaddBottom">
                  <div className="col-md-1 col-sm-1 col-xs-2 removePaddLeft flexWidth">
                    <i className="em em-zap" />
                  </div>
                  <div className="col-md-11 col-sm-11 col-xs-10 noPadd">
                    <div className="description removePaddBottom">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/danperrout/ARMBH_backend_sysfiscal"
                      >
                        Consulte o repositório Back-end
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tutorialImg col-md-6 col-sm-6 col-xs-12 hidden-xs noPadd">
              <img className="img-responsive" src={rightImg} alt="View" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default LandingPage;
