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
        insideBigCircle: LOGO
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
        window.addEventListener('resize', this.reRender);
        //set radius of the big circle to the state
        this.setState({
            radius: this.bigCircle.current.offsetWidth / 2,
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.reRender);
    }

    reRender = () => {
        this.setState({
            radius: this.bigCircle.current.offsetWidth / 2,
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
    
    //path under the text
    //the straight line and coordinates
    getStraightLine(path, quadrant) {
        //coordinates for the line under the text
        let straightPath = this.getStraghtLineCoords(quadrant);
        //path in the text format
        straightPath.path = `${path} ${straightPath.path}`;
        //return the object of the coordinates and the text format of the path
        return straightPath;
    }

    //get coordinates for the line under the text
    //use in text coordinates too
    getStraghtLineCoords(quadrant) {        
        if(!this.bigCircle.current) return;

        let widthBigCircle = this.bigCircle.current.offsetWidth;

        //crossed line and its vector
        let xcross = widthBigCircle*0.04;
        let ycross = widthBigCircle*0.04;
        //length of the line
        let xline = widthBigCircle*0.3;
        //it is straight line so y move is 0
        let yline = 0;

        //base on the quadrant change the vector
        switch(quadrant) {
            case 0:
                ycross = -ycross;
                break;
            case 2:
                xcross = -xcross;
                xline = -xline;
                break;
            case 3:
                xcross = -xcross;
                ycross = -ycross;
                xline = -xline;
                break;
            default:
                break;
        }

        //create text representation of the path
        let path = `l ${xcross},${ycross} l ${xline},${yline}`;
        //return coordinates and text representation of the path
        return {
            xcross,
            ycross,
            xline,
            yline,
            path
        };
    }

    //creates points data set for paths and text paths
    pointsData() {
        //svg not ready
        if(!this.svg.current) return;

        //inital geometry for calculating paths from svg
        let r = this.state.radius;
        let cx = this.svg.current.width.baseVal.value/2;
        let cy = this.svg.current.height.baseVal.value/2;

        //data for paths
        //part of the string part for the html, starting point for drawing, ending points for drawing
        let pathData0 = this.describeArc(cx, cy, r, 44.5, 45);
        let pathData1 = this.describeArc(cx, cy, r, 134.5, 135);
        let pathData2 = this.describeArc(cx, cy, r, 224.5, 225);
        let pathData3 = this.describeArc(cx, cy, r, 314.5, 315);

        //numbers from drawing straight line needed for text paths
        //full string path for html
        let straightLineData0 = this.getStraightLine(pathData0.d, 0);
        let straightLineData1 = this.getStraightLine(pathData1.d, 1);
        let straightLineData2 = this.getStraightLine(pathData2.d, 2);
        let straightLineData3 = this.getStraightLine(pathData3.d, 3);

        //path for the text
        let menuPaths = [];
        menuPaths.push(this.getMenuPath(pathData0.end, straightLineData0, 0));
        menuPaths.push(this.getMenuPath(pathData1.end, straightLineData1, 1));
        menuPaths.push(this.getMenuPath(pathData2.start, straightLineData2, 2));
        menuPaths.push(this.getMenuPath(pathData3.start, straightLineData3, 3));

        //path for drawing lines
        let lines = [];
        lines.push(straightLineData0.path);
        lines.push(straightLineData1.path);
        lines.push(straightLineData2.path);
        lines.push(straightLineData3.path);

        return {
            lines,
            menuPaths,
        };
    }

    getMenuPath(end, crossLine, quadrant) {        
        if(!this.bigCircle.current) return;
        let widthBigCircle = this.bigCircle.current.offsetWidth;

        //move the text above the line - space between text and line
        let yMoveUpLine = -widthBigCircle*0.01;

        switch(quadrant) {
            case 0:
            case 1:
                return { x: end.x + crossLine.xcross*4, y: yMoveUpLine + end.y + crossLine.ycross };
            case 2:
            case 3:
                let endPoint = { x: end.x - crossLine.xcross*2, y: end.y + crossLine.ycross };
                return {x: endPoint.x + crossLine.xline, y: yMoveUpLine + endPoint.y + crossLine.yline };
            default:
                return { x:0, y:0 };
        }
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
        let element = this.bigCircle.current;
        let circularPath = "";
        let paths = this.pointsData()
        if(element) {            
            let r = this.state.radius;
            circularPath = this.describeArc(element.offsetWidth / 2, element.offsetWidth / 2, r, 0, 359, -r, 0).d;
        }
        
        return (
            <div className="Main">
            <div className="hidden">
                <div id="BigCircle" ref={this.bigCircle}>
                { this.contentBigCircle() }
                </div>  
                
                <svg width="100vw" height="100vh" ref={this.svg}>    
                    {paths && paths.lines && paths.lines.map((line, index) => <path key={index} d={line} id={"block"+index} stroke="#446688" strokeWidth="3"></path>)}
                    {paths && paths.menuPaths && paths.menuPaths.map((menu, index) => <text id={"menu"+index} onClick={(e) => this.onMenuClick(menu, index, e)} className="menuItem" x={menu.x} y={menu.y} key={index}>{data[index].name}</text>)}
                                
                    <g>
                        <circle id="SmallCircleSvg" cy="5vh" cx="50%" r="2.5vh" stroke="black" strokeWidth="1" 
                            fill="red" ref={this.smallCircle} onClick={(e) => {this.spinSmallCircle(e)}} />
                        <animateMotion id="animateSmallCircle" attributeName="x" begin="indefinite" dur="3s" repeatCount="1"
                            path={circularPath} />
                    </g>
                    {/* <defs>
                        <path id="curvedTextPath" d={pathText}></path> */}
                        {/* {paths && paths.menuPaths && paths.menuPaths.map((menu, index) => <path key={"menuPath"+index} id={"menuPath"+index} d={menu}></path>)} */}
                    {/* </defs>
                    <text>
                        <textPath id="curvedText" startOffset="50%" href="#curvedTextPath">Marcel Malypetr</textPath>
                    </text> */}
                </svg>
                </div>




                <svg id="eUz0M5e2ncR1"
                    viewBox="0 0 1336 657">
                    <ellipse rx="289.491174" ry="289.491174" transform="matrix(0 0.988012-.988012 0 668 328.5)" fill="#d2dbed" stroke-width="0"/>
                    <ellipse rx="289.491174" ry="289.491174" transform="matrix(0 0.988012-.988012 0 668 328.5)" fill="#000000" fill-opacity="0" stroke-width="0"/>

                    <g>
                        <ellipse rx="29.311374" ry="29.311374" transform="matrix(.788901 0 0 0.788901 668 42.479246)" 
                            fill="#c511dc" stroke-width="0" onClick={(e) => {this.spinSmallCircle(e)}}/>
                        <animateMotion id="animateSmallCircle" attributeName="x" begin="indefinite" dur="3s" repeatCount="1"
                                path={circularPath} />
                    </g>

                    <line x1="11.144775" y1="11.144775" x2="-11.144776" y2="-11.144776" transform="translate(454.718086 115.212509)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="11.144775" y1="11.144775" x2="-11.144776" y2="-11.144776" transform="translate(881.270254 541.739727)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="-11.144775" y1="11.144775" x2="11.144776" y2="-11.144776" transform="translate(454.718085 542.019987)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="-11.144775" y1="11.144775" x2="11.144776" y2="-11.144776" transform="translate(881.291264 115.212509)" fill="none" stroke="#e1ef07" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(382.634939 104.500667)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(997.090392 104.526595)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(997.153814 552.454943)" fill="none" stroke="#f1ee03" stroke-width="3"/>
                    <line x1="62.010673" y1="0" x2="-105.77125" y2="0" transform="translate(382.634939 552.695162)" fill="none" stroke="#f1ee03" stroke-width="3"/>

                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(360 94.221499)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Slamák</tspan>
                    </text>
                    <text dx="0" dy="0" font-size="35" font-weight="700" transform="translate(980 94.580462)" stroke-width="0">
                        <tspan y="0" font-weight="700" stroke-width="0">Zeměloď</tspan>
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