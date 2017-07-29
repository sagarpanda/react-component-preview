import React from 'react';
import LivePreview from './LivePreview';
import * as ReactBootstrap from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.components = {};
        for (var key in ReactBootstrap) {
            this.components[key] = ReactBootstrap[key];
        }
    }

    render() {
        return (
            <div className="container">
                <h1>React Bootstrap Component Preview</h1>
                <LivePreview
                    previewStyle={{ minHeight: 150 }}
                    components={this.components}
                    code="<Button bsStyle=&quot;primary&quot;>Primary</Button>"
                />
            </div>
        );
    }
}

module.exports = Sample;
