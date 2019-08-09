import * as React from "react";

import { Error404Page } from "tabler-react";

type Props = {||};

function Error404(props: Props): React.Node {
  return (
    <Error404Page
      details="Página não encontrada"
      subtitle="Ops! Você encontrou um erro!"
    />
  );
}

export default Error404;
