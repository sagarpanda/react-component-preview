import React from 'react';
import _ from 'lodash';
import Editor from './Editor';

var X2JS = require('./xml2json')

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
		this.xml2json = new X2JS();
		window.xml2json = this.xml2json
	}

	updateCode(val){
		console.log("updateCode: ", arguments);
		this.setState({ code: val})
	}

	getChildAndProps(aOpt){
		var o = {};
		var regx = /^\_/;
		var opt = _.merge({}, aOpt);
		if(opt.__text){
			o = {childTag: "__text", child:opt.__text};
		}
		opt = _.omit(opt, ['__text','toString']);
		//Set Props
		var keys = Object.keys(opt);
		var props = {};
		keys.forEach(function(key){
			var k = key;
			if (regx.test(key)) {
				k = k.replace(regx, '');
				//console.log(key, k);
				props[k] = aOpt[key];
			}else{
				o.childTag = k;
				o.child = aOpt[k];
			}
		});
		o.props = props;
		return o;
	}

	createElement(aTag, aOpt){
		var self = this;
		var regx = /^[A-Z]/; var children = [];
		var component = aTag;
		if (regx.test(aTag)) {
			component = this.components[aTag];
			if (!component) { return "" }
		}
		if(aTag === "__text"){
			return aOpt;
		}else if (_.isString(aOpt)) {
			return React.createElement(component, {}, aOpt);
		}

		var extract = this.getChildAndProps(aOpt);
		console.log("extract: ", extract);

		if(_.isArray(extract.child)){
			var temp = null;
			//console.log("In Array: ", extract);
			extract.child.forEach(function(aNode){
				children.push( self.createElement(extract.childTag, aNode) )
			});
			children.unshift(extract.props);
			children.unshift(component);
			return React.createElement.apply(React, children);
		}else if(_.isObject(extract.child) || _.isString(extract.child)){
			//console.log("In Object: ", extract);
			return React.createElement(component, extract.props,  self.createElement(extract.childTag, extract.child) );
		}

	}

	componentParser(aStr){
		var json = this.xml2json.xml_str2json(aStr);
		if (json) {
			console.log(JSON.stringify(json, null, 2));
			var tag = Object.keys(json)[0];
			return this.createElement(tag, json[tag]);
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

module.exports = LivePreview;
