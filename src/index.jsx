import React from 'react';
import { render } from 'react-dom';
import Sample from './Sample';

class App extends React.Component {
    render() {
        return <Sample />;
    }
}

render(<App />, document.getElementById('app'));
