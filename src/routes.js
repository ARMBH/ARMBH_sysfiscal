import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import Home from "./components/Home/Home";
import Error404 from "./components/Home/Error404";
import Callback from "./components/Callback/Callback";
import auth from "./components/Auth/Auth";
import LandingPage from "./components/LandingPage/LandingPage";
import BlogPage from "./components/BlogPage/BlogPage";
import ProcessoForm from "./components/Processo/ProcessoForm";
import ProcessoFormNovo from "./components/Processo/ProcessoFormNovo";
import EnderecoForm from "./components/Endereco/EnderecoForm";
import ProfileForm from "./components/Profile/ProfileForm";
import StatusForm from "./components/Status/StatusForm";
import DocumentoUpload from "./components/Documento/DocumentoUpload";
import ListaProcessos from "./components/Processo/ListaProcessos";
import Calendario from "./components/Calendario/Calendario";
import DashboardAdmin from "./components/Admin/DashboardAdmin";

import history from "./utils/history";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";

import "tabler-react/dist/Tabler.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProcessoFormHistorico from "./components/Processo/ProcessoFormHistorico";
import ProcessoFormDocumentos from "./components/Processo/ProcessoFormDocumentos";
import ProcessoFormVistorias from "./components/Processo/ProcessoFormVistorias";
import ProcessoFormInteressados from "./components/Processo/ProcessoFormInteressados";
import InteressadoForm from "./components/Interessado/InteressadoForm";
import InteressadosAdmin from "./components/Interessado/InteressadosAdmin";
import Denuncia from "./components/Denuncia/Denuncia";
import ListaDemandas from "./components/Demanda/ListaDemandas";
import Demanda from "./components/Demanda/Demanda";
import ProcessoFormDemanda from "./components/Processo/ProcessoFormDemanda";
import ListaUsers from "./components/Admin/ListaUsers";
import UserForm from "./components/Admin/UserForm";

// Call it once in your app. At the root of your app is the best place
toast.configure({
  closeButton: false,
  hideProgressBar: true
});

let client;

const providePublicClient = (Component, renderProps) => {
  if (!client) {
    client = makeApolloClient();
  }

  return (
    <ApolloProvider client={client}>
      <Component {...renderProps} client={client} />
    </ApolloProvider>
  );
};

const provideClient = (Component, renderProps) => {
  // check if logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    // check if client exists
    if (!client) {
      client = makeApolloClient();
    }

    if (localStorage.getItem("roles") === "") {
      localStorage.setItem("isLoggedIn", "false");
      alert(
        "Seu cadastro encontra-se em análise. Você receberá um e-mail quando o acesso estiver liberado."
      );
      //history.replace("/login");
      return (window.location.href = "/login");
    }

    return (
      <ApolloProvider client={client}>
        <Component {...renderProps} auth={auth} client={client} />
      </ApolloProvider>
    );
  } else {
    // not logged in already, hence redirect to login page
    if (renderProps.match.path !== "/login") {
      window.location.href = "/login";
    } else {
      return <Component auth={auth} {...renderProps} />;
    }
  }
};

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route
            exact
            path="/denuncia"
            render={props => providePublicClient(Denuncia, props)}
          />
          <Route
            exact
            path="/login"
            render={props => provideClient(LandingPage, props)}
          />
          <Route exact path="/" render={props => provideClient(Home, props)} />
          <Route
            exact
            path="/home"
            render={props => provideClient(Home, props)}
          />
          <Route
            exact
            path="/admin/"
            render={props => {
              return provideClient(DashboardAdmin, props);
            }}
          />
          <Route
            exact
            path="/admin/users"
            render={props => {
              return provideClient(ListaUsers, props);
            }}
          />
          <Route
            exact
            path="/admin/user/:param"
            render={props => {
              return provideClient(UserForm, props);
            }}
          />
          <Route
            exact
            path="/home/:param"
            render={props => provideClient(Home, props)}
          />
          <Route
            exact
            path="/blog"
            render={props => provideClient(BlogPage, props)}
          />
          <Route
            exact
            path="/novoprocesso/"
            key={"novoprocesso"}
            render={props => provideClient(ProcessoFormNovo, props)}
          />
          <Route
            exact
            path="/listaprocessos/"
            render={props => provideClient(ListaProcessos, props)}
          />
          <Route
            exact
            path="/listademandas/"
            render={props => provideClient(ListaDemandas, props)}
          />
          <Route
            exact
            path="/demanda/:param"
            render={props => provideClient(Demanda, props)}
          />
          <Route
            exact
            path="/calendario/"
            key={"calendario"}
            render={props => provideClient(Calendario, props)}
          />
          <Route
            exact
            path="/meucalendario"
            key={"meucalendario"}
            render={props => provideClient(Calendario, props)}
          />
          <Route
            exact
            path="/profile"
            render={props => provideClient(ProfileForm, props)}
          />
          <Route
            exact
            path="/processo/:param"
            key={"processo"}
            render={props => provideClient(ProcessoForm, props)}
          />
          <Route
            exact
            path="/processo/interessados/:param"
            key={"processo"}
            render={props => provideClient(ProcessoFormInteressados, props)}
          />
          <Route
            exact
            path="/processo/demanda/:param"
            key={"processo"}
            render={props => provideClient(ProcessoFormDemanda, props)}
          />
          <Route
            exact
            path="/interessados/"
            key={"interessado"}
            render={props => provideClient(InteressadosAdmin, props)}
          />
          <Route
            exact
            path="/interessado/"
            key={"interessado"}
            render={props => provideClient(InteressadoForm, props)}
          />
          <Route
            exact
            path="/interessado/:param"
            key={"interessado"}
            render={props => provideClient(InteressadoForm, props)}
          />
          <Route
            exact
            path="/historico/:param"
            key={"processo"}
            render={props => provideClient(ProcessoFormHistorico, props)}
          />
          <Route
            exact
            path="/vistorias/:param"
            key={"processo"}
            render={props => provideClient(ProcessoFormVistorias, props)}
          />
          <Route
            exact
            path="/documentos/:param"
            key={"processo"}
            render={props => provideClient(ProcessoFormDocumentos, props)}
          />
          <Route
            exact
            path="/endereco/:param"
            render={props => provideClient(EnderecoForm, props)}
          />
          <Route
            exact
            path="/adicionarstatus/:param"
            render={props => provideClient(StatusForm, props)}
          />
          <Route
            exact
            path="/adicionarvistoria/:param"
            render={props => provideClient(StatusForm, props)}
          />
          <Route
            exact
            path="/encerrarprocesso/:param"
            render={props => provideClient(StatusForm, props)}
          />
          <Route
            exact
            path="/adicionardoc/:param"
            render={props => provideClient(DocumentoUpload, props)}
          />
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          <Route exact={true} component={Error404} />
        </Switch>
      </div>
    </Router>
  );
};
