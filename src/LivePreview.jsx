import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Editor from './Editor';
import XmltoJson from './XmltoJson';

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
        this.xmltojson = new XmltoJson();
    }

    updateCode(val) {
        this.setState({ code: val });
    }

    createElement(aOpt) {
        const self = this;
        let rComp = null;
        const regx = /^[A-Z]/;
        const children = [];

        if (_.isString(aOpt)) {
            return aOpt;
        }
        if (aOpt.name === 'parsererror') {
            return '';
        }

        let component = aOpt.name;
        if (regx.test(aOpt.name)) {
            component = _.at(this.components, aOpt.name);
            if (component.length === 0) {
                return '';
            }else{
                component = component[0];
            }
        }

        if (_.isArray(aOpt.children)) {
            //console.log("In Array: ", extract);
            aOpt.children.forEach(function(aNode) {
                children.push(self.createElement(aNode));
            });
            children.unshift(aOpt.props);
            children.unshift(component);
            try {
                rComp = React.createElement.apply(React, children);
            } catch (e) {
                rComp = '';
            } finally {
            }
            return rComp;
        } else {
            return '';
        }
    }

    componentParser(aStr) {
        const json = this.xmltojson.parse(aStr);
        if (json) {
            //console.log(JSON.stringify(json, null, 2));
            return this.createElement(json);
        }
        return '';
    }

    render() {
        //console.log("render: ", this.xml2json);
        const {
            components,
            code,
            previewStyle,
            enableEditor,
            ...props
        } = this.props;
        let comp = null;
        try {
            comp = this.componentParser(this.state.code);
        } catch (e) {
            comp = '';
        }
        const previewStyleAttr = _.assign(
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
