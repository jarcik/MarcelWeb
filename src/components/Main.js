import React, { Component } from 'react';
import '../styles/Main.scss';
import data from  '../data/data.json';
import MenuBlock  from './MenuBlock';
import { LOGO, IMAGES, KONTAKT } from '../data/constants';
import Images from './Images';
import Kontakt from './Kontakt';
import Logo from './Logo';

class Main extends Component {

    //set the base of the state
    state = {
        //radus of the circle
        radius: 0,
        insideBigCircle: LOGO,
        smallerPart: 0
    };

    constructor(props) {
        super(props);
        //reference to the elements of the dom
        this.bigCircle = React.createRef();
        this.smallCircle = React.createRef();
        this.circularName = React.createRef();
        this.svg = React.createRef();
    }

    componentDidMount() {
        let width = document.body.clientWidth;
        let height = document.body.clientHeight;
        let smallerPart = width > height ? height : width;
        
        window.addEventListener('resize', this.reRender);
        //set radius of the big circle to the state
        this.setState({
            documentWidth: width,
            documentHeight: height,
            smallerPart: smallerPart,
            radius: smallerPart / 100 * 90
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.reRender);
    }

    reRender = () => {
        this.setState({
            //radius: this.bigCircle.current.getClientRects().width / 2,
        });
    };

    //path for the curved text (name at the bottom of the circle)
    getMarcelMalypetrTextPath() {
        //reference for svg to get the center of the svg
        if(!this.svg.current || !this.bigCircle.current) return;

        //adjusted radius
        let r = this.state.radius * 1.14;
        //inital geometry for calculating paths from svg
        let cx = this.svg.current.width.baseVal.value/2 - r;
        let cy = this.svg.current.height.baseVal.value/2 * 0.9;
        //return curved path for the text
        return `M${cx},${cy} a${r},${r} 0 0 0 ${2*r},0`;
    }

    //from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    //use: window.onload = function() {
    //document.getElementById("arc1").setAttribute("d", describeArc(150, 150, 100, 0, 270));
    //};
    polarToCartesian(centerX, centerY, radius, angleInDegrees, plusX = 0, plusY = 0) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
      
        return {
          x: centerX + plusX + (radius * Math.cos(angleInRadians)),
          y: centerY + plusY + (radius * Math.sin(angleInRadians))
        };
    }
      
    //from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    //use: window.onload = function() {
    //document.getElementById("arc1").setAttribute("d", describeArc(150, 150, 100, 0, 270));
    //};
    describeArc(x, y, radius, startAngle, endAngle, plusX = 0, plusY = 0){    
        var start = this.polarToCartesian(x, y, radius, endAngle, plusX, plusY);
        var end = this.polarToCartesian(x, y, radius, startAngle, plusX, plusY);
    
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
        var d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    
        //d - path in text
        //start - start of the path
        //end - end of the path
        return {
            d,
            start,
            end
        };       
    }

    //spinning small circle around big circle
    spinSmallCircle() {
        //reference to a animated object
        var element = document.getElementById("animateSmallCircle");
        //element does not exist already
        if(!element) return;
        //start the motion
        element.beginElement();
    }
    
    onMenuClick(menu, index, event) {
        this.spinSmallCircle();
        switch(index) {
            //zemelod, slamak, projekty
            case 0:
            case 1:
            case 2:
                this.setState({ insideBigCircle: IMAGES })
                break;
            //kontakt
            case 3:
                this.setState({ insideBigCircle: KONTAKT })
                break;
            //default, uvod
            default:
                this.setState({ insideBigCircle: LOGO })
                break;
        }        
    }

    contentBigCircle() {
        switch(this.state.insideBigCircle) {    
          case KONTAKT: 
            return <Kontakt />;
          case IMAGES:   
            return <Images />;
          case LOGO:   
          default:      
            return <Logo />;
        }
    }

    render() {
        let pathText = this.getMarcelMalypetrTextPath();
        let circularPath = "";
        circularPath = this.describeArc(this.state.documentWidth / 2, this.state.documentHeight / 2, this.state.radius / 2, 0, 359).d;
        
        return (
            <div className="Main">      
                <svg id="pallete" width="100vw" height="100vh">
                    {/* <ellipse id="BigCircle" ref={this.bigCircle} rx={this.state.radius / 2} ry={this.state.radius / 2} transform="matrix(0 0.988012-.988012 0 668 200)" fill="#d2dbed" stroke-width="0"/> */}

                    <path id="bigCircle" d={circularPath} stroke="red"
                        stroke-width="3" fill="none" />

                    {/* <g>
                        <ellipse ref="smallCircle" rx="29.311374" ry="29.311374" transform="matrix(.788901 0 0 0.788901 668 42.479246)" 
                            fill="#c511dc" stroke-width="0" onClick={(e) => {this.spinSmallCircle(e)}}/>
                        <animateMotion id="animateSmallCircle" attributeName="x" begin="indefinite" dur="3s" repeatCount="1"
                                path={circularPath} />
                    </g> */}

                    <circle id="SmallCircleSvg" cy="5vh" cx="50%" r="2.5vh" stroke="black" strokeWidth="1" 
                            fill="red" ref={this.smallCircle} onClick={(e) => {this.spinSmallCircle(e)}} />
                        <animateMotion id="animateSmallCircle" attributeName="x" begin="indefinite" dur="3s" repeatCount="1"
                            path={circularPath} />

                    <line x1="11.144775" y1="11.144775" x2="-11.144776" y2="-11.144776" transform="translate(454.718086 115.212509)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="11.144775" y1="11.144775" x2="-11.144776" y2="-11.144776" transform="translate(881.270254 541.739727)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="-11.144775" y1="11.144775" x2="11.144776" y2="-11.144776" transform="translate(454.718085 542.019987)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="-11.144775" y1="11.144775" x2="11.144776" y2="-11.144776" transform="translate(881.291264 115.212509)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(382.634939 104.500667)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(997.090392 104.526595)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(997.153814 552.454943)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(382.634939 552.695162)" fill="none" stroke="#f1ee03" stroke-width="3"/>

                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(360 94.221499)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Slam??k</tspan>
                    </text>
                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(980 94.580462)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Zem??lo??</tspan>
                    </text>
                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(975 542.33721)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Kontakt</tspan>
                    </text>
                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(360 542.149847)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Projekty</tspan>
                    </text>
                    
                    <defs>
                        <path id="curvedTextPath" d={pathText}></path>
                    </defs>
                    <text>
                        <textPath id="curvedText" startOffset="50%" href="#curvedTextPath">Marcel Malypetr</textPath>
                    </text>
                </svg>
            </div>
        );
    }
}

export default Main;