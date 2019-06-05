import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { QUERY_USER } from "./SiteWrapperQueries";

export default function GetUser({ userId }) {
  return (
    <Query query={QUERY_USER} variables={{ userId }}>
      {({ data, loading, error }) => {
        if (loading) return "Carregando...";
        if (error) return <p>ERROR: {error.message}</p>;
        if (data.users.length > 0) {
          //console.log(data.users[0].name);
          return <span>{data.users[0].name}</span>;
        }
        return "Carregando...";
      }}
    </Query>
  );
}
