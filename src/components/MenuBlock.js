import React, { Component } from 'react';
//import '../styles/MenuBlock.scss';

class MenuBlock extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="MenuBlock">
                <div className="line-one"></div>
                <div className="line-one"></div>
                <span>{this.props.block.name}</span>
            </div>
        );
    }
}

export default MenuBlock;