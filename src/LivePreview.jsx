import React from 'react';
import PropTypes from 'prop-types';
import assign from 'lodash/assign';
import Editor from './Editor';
const JSXTransformer = require('./JSXTransformer');

const noop = () => {};

class LivePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'java',
            code: props.code
        };
        this.defaultPreviewStyle = {
            position: 'relative',
            minHeight: 200,
            padding: 10,
            border: '2px solid #CCC'
        };
        this.updateCode = this.updateCode.bind(this);
        this.components = props.components;
    }

    componentWillReceiveProps(newProps) {
        this.components = newProps.components;
        this.setState({
            code: newProps.code
        });
    }

    componentWillMount() {
        window.JSXTransformer = JSXTransformer;
        window.React = React;
        const cKeys = Object.keys(this.components);
        for (var i = 0; i < cKeys.length; i++) {
            window[cKeys[i]] = this.components[cKeys[i]];
        }
    }

    updateCode(val) {
        this.setState({ code: val });
    }

    render() {
        const {
            components,
            code,
            previewStyle,
            enableEditor,
            ...props
        } = this.props;
        let comp = null;
        try {
            comp = JSXTransformer.exec(this.state.code);
        } catch (e) {
            console.log(e.description || e.message);
            comp = '';
        }
        const previewStyleAttr = assign(
            {},
            this.defaultPreviewStyle,
            previewStyle
        );
        return (
            <div {...props}>
                <div className="preview" style={previewStyleAttr}>
                    {comp}
                </div>
                {this.props.enableEditor
                    ? <Editor
                          value={this.state.code}
                          onChange={this.updateCode}
                      />
                    : ''}
            </div>
        );
    }
}

LivePreview.defaultProps = {
    enableEditor: true,
    code: '',
    previewStyle: {},
    onChange: noop
};

LivePreview.propTypes = {
    components: PropTypes.object,
    code: PropTypes.string,
    onChange: PropTypes.func,
    previewStyle: PropTypes.object,
    enableEditor: PropTypes.bool
};

export default LivePreview;
