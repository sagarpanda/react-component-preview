import React from 'react';
import LivePreview from './LivePreview';
import CodeSnippet from './CodeSnippet';
import * as ReactBootstrap from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '<Button bsStyle="primary">Primary</Button>'
        }
        this.components = {};
        const bootKeys = Object.keys(ReactBootstrap);
        for (let i=0; i<bootKeys.length; i++) {
            const key = bootKeys[i];
            this.components[key] = ReactBootstrap[key];
        }
        this.onClickSnippet = this.onClickSnippet.bind(this);
    }

    onClickSnippet(code){
        this.setState({'code': code});
    }

    render() {
        return (
            <div className="container">
                <h1>React Bootstrap Component Preview</h1>
                <LivePreview
                    previewStyle={{ minHeight: 150 }}
                    components={this.components}
                    code={this.state.code}
                />
                <br />
                <CodeSnippet onClickSnippet={this.onClickSnippet} />
            </div>
        );
    }
}

export default Sample;
