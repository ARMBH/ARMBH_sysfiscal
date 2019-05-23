import React from 'react';
import logo from './logo.svg';
import logo1 from './logo.PNG';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo1} className="App-logo" alt="logo" />
				<p>Sistema de Fiscalização de Parcelamento do Solo para Fins Urbanos</p>
				<a
					className="App-link"
					href="https://github.com/danperrout/ARMBH_sysfiscal/blob/master/README.md"
					target="_blank"
					rel="noopener noreferrer"
				>
					Visite o repositório
				</a>
			</header>
		</div>
	);
}

export default App;
