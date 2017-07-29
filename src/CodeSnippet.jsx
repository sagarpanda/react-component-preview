import React, { Component } from 'react';
import {
    ButtonToolbar,
    Button
} from 'react-bootstrap';

class CodeSnippet extends Component {
    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    onClickHandler(str){
        let code = '';
        switch(str){
            case 'Buttons' :
                code = `<ButtonToolbar>\n\t<Button>Default</Button>\n\t<Button bsStyle="primary">Primary</Button>\n\t<Button bsStyle="success">Success</Button>\n\t<Button bsStyle="info">Info</Button>\n\t<Button bsStyle="warning">Warning</Button>\n\t<Button bsStyle="danger">Danger</Button>\n\t<Button bsStyle="link">Link</Button>\n</ButtonToolbar>`;
                break;

            case 'Navs-pills' :
                code = `<Nav bsStyle="pills" activeKey={1}>
    <NavItem eventKey={1}>NavItem 1 content</NavItem>
    <NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
    <NavItem eventKey={3}>NavItem 3 content</NavItem>
</Nav>`;
                break;
            case 'Navs-tabs' :
                code = `<Nav bsStyle="tabs" activeKey={1}>
    <NavItem eventKey={1}>NavItem 1 content</NavItem>
    <NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
    <NavItem eventKey={3}>NavItem 3 content</NavItem>
</Nav>`;
                                break;
        }
        this.props.onClickSnippet(code);
    }

    render() {
        return (
            <ButtonToolbar>
                <Button onClick={(e)=>{this.onClickHandler('Buttons')}}>Buttons</Button>
                <Button onClick={(e)=>{this.onClickHandler('Navs-pills')}}>Navs:pills</Button>
                <Button onClick={(e)=>{this.onClickHandler('Navs-tabs')}}>Navs:tabs</Button>
            </ButtonToolbar>
        );
    }

}

export default CodeSnippet;
