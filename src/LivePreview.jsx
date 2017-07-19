import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Editor from './Editor';
import XmltoJson from './XmltoJson';

class LivePreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mode: "java",
			code: props.code
		}
		this.defaultPreviewStyle = {
			position:"relative",
			height:200,
			padding:10,
			border:"2px solid #CCC"
		}
		this.updateCode = this.updateCode.bind(this);
		this.components = props.components;
	}

	componentWillReceiveProps(newProps){
		this.components = newProps.components;
		this.setState({
			code: props.code
		})
	}

	componentWillMount(){
		this.xmltojson = new XmltoJson();
	}

	updateCode(val){
		console.log("updateCode: ", arguments);
		this.setState({ code: val})
	}

	createElement(aOpt){
		var self = this, rComp;
		var regx = /^[A-Z]/; var children = [];

		if(_.isString(aOpt)){ return aOpt; }

		var component = aOpt.name;
		if (regx.test(aOpt.name)) {
			component = this.components[aOpt.name];
			if (!component) { return "" }
		}

		if(_.isArray(aOpt.children)){
			var temp = null;
			//console.log("In Array: ", extract);
			aOpt.children.forEach(function(aNode){
				children.push( self.createElement(aNode) )
			});
			children.unshift(aOpt.props);
			children.unshift(component);
			try {
				rComp = React.createElement.apply(React, children);
			} catch (e) {
				rComp = "";
			} finally {

			}
			return rComp;
		}else {
			return "";
		}

	}

	componentParser(aStr){
		//var json = this.xml2json.xml_str2json(aStr);
		var json = this.xmltojson.parse(aStr);
		if (json) {
			//console.log(JSON.stringify(json, null, 2));
			return this.createElement(json);
		}
		return "";
	}

	render() {
		//console.log("render: ", this.xml2json);
		var comp = this.componentParser(this.state.code);
		var previewStyle = this.props.previewStyle || {};
		previewStyle = _.assign({}, this.defaultPreviewStyle, previewStyle);
		return (
			<div>
				<div style={previewStyle}>
					{comp}
				</div>
				<Editor
					value={this.state.code}
					onChange={this.updateCode}
				 />
			</div>
		);
	}
}

LivePreview.propTypes = {
	components: PropTypes.object,
	code: PropTypes.string,
	onChange: PropTypes.func
};

export default  LivePreview;
