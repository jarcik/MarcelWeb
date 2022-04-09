import React, { Component } from 'react';
import '../styles/Main.scss';
import data from  '../data/data.json';
import MenuBlock  from './MenuBlock';

class Main extends Component {

    //set the base of the state
    state = {
        //radus of the circle
        radius: 0,
        //center point for small circle
        cxSmall: 0,
        cySmall: 0
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
        //set radius of the big circle to the state
        this.setState({
            radius: this.bigCircle.current.offsetWidth / 2
        });

        //center point for rotation of the small circle
        let smallCircleSvg = this.smallCircle.current;
        this.setState({            
            cxSmall: smallCircleSvg.cx.baseVal.value,
            cySmall: smallCircleSvg.cy.baseVal.value
        });
    }

    //path for the curved text (name at the bottom of the circle)
    getTextPathData() {
        //reference for svg to get the center
        //svg not ready
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
        let straightPath = this.getTextLineCoords(quadrant);
        //path in the text format
        let wholePath = `${path} ${straightPath.path}`;
        straightPath.path = wholePath;
        //return the object of the coordinates and the text format of the path
        return straightPath;
    }

    //get coordinates for the line undex the text
    //use in text coordinates too
    getTextLineCoords(quadrant) {
        
        if(!this.bigCircle.current) return;
        let widthBigCircle = this.bigCircle.current.offsetWidth;

        //turned line and its vector
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
        let path0Data = this.describeArc(cx, cy, r, 44.5, 45);
        let path1Data = this.describeArc(cx, cy, r, 134.5, 135);
        let path2Data = this.describeArc(cx, cy, r, 224.5, 225);
        let path3Data = this.describeArc(cx, cy, r, 314.5, 315);

        //numbers from drawing straight line needed for text paths
        //full string path for html
        let straightLineData0 = this.getStraightLine(path0Data.d, 0);
        let straightLineData1 = this.getStraightLine(path1Data.d, 1);
        let straightLineData2 = this.getStraightLine(path2Data.d, 2);
        let straightLineData3 = this.getStraightLine(path3Data.d, 3);

        let menuPaths = [];
        menuPaths.push(this.getMenuPath(path0Data.end, straightLineData0, 0));
        menuPaths.push(this.getMenuPath(path1Data.end, straightLineData1, 1));
        menuPaths.push(this.getMenuPath(path2Data.start, straightLineData2, 2));
        menuPaths.push(this.getMenuPath(path3Data.start, straightLineData3, 3));

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
                return { x: end.x + crossLine.xcross, y: yMoveUpLine + end.y + crossLine.ycross };
            case 2:
            case 3:
                let endPoint = { x: end.x - crossLine.xcross, y: end.y - crossLine.ycross };
                return {x: endPoint.x + crossLine.xline, y: endPoint.y + crossLine.yline };
            default:
                return { x:0, y:0 };
        }
    }

    // getMenuPath2(end, crossLine, quadrant) {
    //     let startPoint = {};
    //     let endPoint = {};
    //     switch(quadrant) {
    //         case 0:
    //         case 1:
    //             startPoint = { x: end.x + crossLine.xcross, y: end.y + crossLine.ycross };
    //             endPoint = {x: startPoint.x + crossLine.xline, y: startPoint.y + crossLine.yline };
    //             break;
    //         case 2:
    //         case 3:
    //             endPoint = { x: end.x - crossLine.xcross, y: end.y - crossLine.ycross };
    //             startPoint = {x: endPoint.x + crossLine.xline, y: endPoint.y + crossLine.yline };
    //             break;
    //         default:
    //             break;
    //     }
    //     return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`;
    // }

    render() {
        let pathText = this.getTextPathData();
        let element = this.bigCircle.current;
        let circularPath = "";
        let paths = this.pointsData()
        if(element) {            
            let r = this.state.radius;
            circularPath = this.describeArc(element.offsetWidth / 2, element.offsetWidth / 2, r, 0, 359, -r, 0).d;
        }
        
        return (
            <div className="Main">
                <div id="BigCircle" ref={this.bigCircle}></div>  
                <svg width="100vw" height="100vh" ref={this.svg}>                
                    <g>
                        <circle id="SmallCircleSvg" cy="5vh" cx="50%" r="2.5vh" stroke="black" strokeWidth="1" 
                            fill="red" ref={this.smallCircle} onClick={(e) => {this.spinSmallCircle(e)}} />
                        <animateMotion id="animateSmallCircle" attributeName="x" begin="indefinite" dur="4s" repeatCount="1"
                            path={circularPath} />
                    </g>
                    <defs>
                        <path id="curvedTextPath" d={pathText}></path>
                        {/* {paths && paths.menuPaths && paths.menuPaths.map((menu, index) => <path key={"menuPath"+index} id={"menuPath"+index} d={menu}></path>)} */}
                    </defs>
                    <text>
                        <textPath startOffset="50%" href="#curvedTextPath">Marcel Malypetr</textPath>
                    </text>

                    {paths && paths.lines && paths.lines.map((line, index) => <path key={index} d={line} id={"block"+index} stroke="#446688" strokeWidth="3"></path>)}
                    {paths && paths.menuPaths && paths.menuPaths.map((menu, index) => <text className="menuItem" x={menu.x} y={menu.y} key={index}>{data[index].name}</text>)}
                </svg>
            </div>
        );
    }
}

export default Main;