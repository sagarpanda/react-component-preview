import _ from 'lodash';

class XmltoJson{
    parse(aXmlStr){
        var str = this.checkEmptyValAttr(aXmlStr);
        //console.log("XML before parse: ", str);
        var parser, xmlDoc;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, "text/xml");
        } else { // IE
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(str);
        }
        //console.log(xmlDoc);
        var json = this.createJson(xmlDoc);
        return json;
    }

    createJson(xmlDoc){
        var node = xmlDoc.childNodes[0];
        if (node.nodeName != 'html') {
            return this.getChildNodeJson(node);
        }else{
            return "";
        }
    }

    getChildNodeJson(node){
        const { nodeName, attributes, childNodes, nodeValue } = node;
        //console.log('nodeName: ', nodeName);
        if (nodeName !== '#text') {
            return {
                name: nodeName,
                props: this.getProps(attributes),
                children: this.getChildren(childNodes)
            }
        }else{
            return _.trim(nodeValue);
        }
    }

    getChildren(aNodes){
        var nodes = [];
        for (var i = 0; i < aNodes.length; i++) {
            nodes.push(this.getChildNodeJson(aNodes[i]));
        }
        return nodes;
    }

    getProps(attributes){
        var attr = {};
        for (var i = 0; i < attributes.length; i++) {
            const { nodeName, nodeValue } = attributes[i];
            if (nodeValue === "") {
                attr[nodeName] = true;
            }else{
                attr[nodeName] = nodeValue;
            }
        }
        return attr;
    }

    checkEmptyValAttr(str){
        var regexTag = /\<([\w\s\=\"\#\!\@\$\%\^\&\*\(\)\_\-\+\~\`\{\}\[\]\:\;\'\\\|]+)(\>|\/\>)/g;
        var regexAttr = /((?:\s[a-zA-Z0-9\-\_]+\b(?!\=)))/g;
        var curlyBracket = /\=\{([\w\s\"\'\-\_\@\#\$\%\^\&\*\(\)\+\=\[\]\:\;]+)\}/g
        var newStr = _.replace(str, regexTag, function(matchStr, c1, c2, index){
            return  _.replace(matchStr, curlyBracket, function(m1, s){
                var val = null;
                try {
                    val = eval(s);
                } catch (e) {
                    val = "";
                }
                if (typeof val === "string") {
                    return '="' + val + '"';
                }else{
                    return '="' + JSON.stringify(val) + '"';
                }
            });
        });
        return newStr;
    }
}

export default  XmltoJson;
