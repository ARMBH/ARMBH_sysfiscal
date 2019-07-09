import React, { Component } from "react";
import { Button, Icon } from "tabler-react";
import { QUERY_DOCUMENTO } from "./DocumentoQueries";
import { Query } from "react-apollo";
import { toast } from "react-toastify";

class DocumentoDownload extends Component {
  constructor() {
    super();
    this.state = {
      gerarLink: false,
      blobUrl: ""
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

  handleLink() {
    this.setState({ gerarLink: true });
  }

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

          if (this.state.blobUrl === "") {
            const documento = data.documentos[0];
            const newBase64 = documento.base64.split(",")[1];
            const blob = this.b64toBlob(newBase64, documento.type);
            this.setState({ blobUrl: URL.createObjectURL(blob) }, () => {
              toast.info(documento.name + " pronto para download.");
              window.open(this.state.blobUrl, "_blank");
            });
          }

          return (
            <React.Fragment>
              {data.documentos.length > 0 ? (
                <React.Fragment>
                  {data.documentos.map((documento, index) => (
                    <a
                      className="btn btn-success ml-auto"
                      key={index}
                      download={documento.name}
                      href={this.state.blobUrl}
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
            onClick={e => {
              //e.preventDefault();
              this.handleLink();
            }}
          >
            <Icon name="download" />
            Download
          </Button>
        ) : (
          this.geraLink()
        )}
      </React.Fragment>
    );
  }
}

export default DocumentoDownload;
