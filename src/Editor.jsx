import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import 'brace/mode/xml';
import 'brace/mode/java';
import 'brace/theme/monokai';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'java'
        };
        this.updateCode = this.updateCode.bind(this);
    }

    updateCode(val, opt) {
        this.props.onChange(val);
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <div>
                <AceEditor
                    value={this.props.value}
                    mode={this.state.mode}
                    theme="monokai"
                    onChange={this.updateCode}
                    name="editor"
                    width="100%"
                    height="200px"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2
                    }}
                />
            </div>
        );
    }
}

export default Editor;
