import _ from 'lodash';

class XmltoJson {
    parse(aXmlStr) {
        const str = this.checkEmptyValAttr(aXmlStr);
        //console.log("XML before parse: ", str);
        let parser, xmlDoc;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, 'text/xml');
        } else {
            // IE
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            xmlDoc.loadXML(str);
        }
        const json = this.createJson(xmlDoc);
        return json;
    }

    createJson(xmlDoc) {
        const node = xmlDoc.childNodes[0];
        if (node.nodeName != 'html') {
            return this.getChildNodeJson(node);
        } else {
            return '';
        }
    }

    getChildNodeJson(node) {
        const { nodeName, attributes, childNodes, nodeValue } = node;
        //console.log('nodeName: ', nodeName);
        if (nodeName !== '#text') {
            return {
                name: nodeName,
                props: this.getProps(attributes),
                children: this.getChildren(childNodes)
            };
        } else {
            return _.trim(nodeValue);
        }
    }

    getChildren(aNodes) {
        const nodes = [];
        for (let i = 0; i < aNodes.length; i++) {
            nodes.push(this.getChildNodeJson(aNodes[i]));
        }
        return nodes;
    }

    getProps(attributes) {
        const attr = {};
        for (let i = 0; i < attributes.length; i++) {
            const { nodeName, nodeValue } = attributes[i];
            if (nodeValue === '') {
                attr[nodeName] = true;
            } else {
                attr[nodeName] = nodeValue;
            }
        }
        return attr;
    }

    checkEmptyValAttr(str) {
        const regexTag = /\<([\w\s\=\"\#\!\@\$\%\^\&\*\(\)\_\-\+\~\`\{\}\[\]\:\;\'\\\|\/\.]+)(\>|\/\>)/g;
        const regexAttr = /((?:\s[a-zA-Z0-9\-\_]+\b(?!\=)))/g;
        const curlyBracket = /\=\{([\w\s\"\'\-\_\@\#\$\%\^\&\*\(\)\+\=\[\]\:\;]+)\}/g;
        const newStr = _.replace(str, regexTag, function(
            matchStr,
            c1,
            c2,
            index
        ) {
            return _.replace(matchStr, curlyBracket, function(m1, s) {
                let val = null,
                    valType;
                try {
                    val = eval(s);
                } catch (e) {
                    val = null;
                }
                valType = typeof val;
                if (valType === 'string' || valType === 'number' || valType === 'boolean') {
                    return '="' + val + '"';
                } else {
                    return '';
                }
            });
        });
        return newStr;
    }
}

export default XmltoJson;
