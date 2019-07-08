import React, { Component } from "react";
import { Mutation } from "react-apollo";

import SiteWrapper from "../SiteWrapper/SiteWrapper";
import { Form, Button, Page, Grid, Alert, Tag, Icon } from "tabler-react";
import { QUERY_DOCUMENTO } from "./DocumentoQueries";
import { Query } from "react-apollo";
import { toast } from "react-toastify";
import FileBase64 from "react-file-base64";

class DocumentoDownload extends Component {
  constructor() {
    super();
    this.state = {
      gerarLink: false
    };
  }

  b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  geraLink() {
    return (
      <Query query={QUERY_DOCUMENTO} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Button color="warning" disabled>
                Preparando Download...
              </Button>
            );
          if (error) return `Erro! ${error.message}`;

          const documento = data.documentos[0];
          const newBase64 = documento.base64.split(",")[1];
          const blob = this.b64toBlob(newBase64, documento.type);
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");

          return (
            <React.Fragment>
              {data.documentos.length > 0 ? (
                <React.Fragment>
                  {data.documentos.map((documento, index) => (
                    <a
                      className="btn btn-success ml-auto"
                      key={index}
                      download={documento.name}
                      href={blobUrl}
                    >
                      <Icon name="download" /> Download
                    </a>
                  ))}
                </React.Fragment>
              ) : (
                <span>Nenhum documento encontrado.</span>
              )}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
  render() {
    const { gerarLink } = this.state;
    return (
      <React.Fragment>
        {!gerarLink ? (
          <Button
            disabled={gerarLink}
            onClick={() => this.setState({ gerarLink: true })}
          >
            <Icon name="download" /> Download
          </Button>
        ) : (
          this.geraLink()
        )}
      </React.Fragment>
    );
  }
}

export default DocumentoDownload;
