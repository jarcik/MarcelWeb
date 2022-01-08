import React, { Component } from 'react';
import '../styles/Main.scss';
import data from  '../data/data.json';
import MenuBlock  from './MenuBlock';

class Main extends Component {

    //set the base of the state
    state = {
        //radus of the circle
        radius: 0,
        //center point of the rotation of the small circle
        xRot: 0,
        yRot: 0
    };

    constructor(props) {
        super(props);
        //reference to the elements of the dom
        this.bigCircle = React.createRef();
        this.smallCircle = React.createRef();
        this.circularName = React.createRef();
    }

    componentDidMount() {
        //set radius of the big circle to the state
        this.setState({
            radius: this.bigCircle.current.offsetWidth / 2
        });

        //center point for rotation of the small circle
        let smallCircleOffset = this.smallCircle.current;
        this.setState({            
            xRot: this.state.radius - smallCircleOffset,
            yRot: this.state.radius - smallCircleOffset
        });
    }

    getTextPathData() {
        let r = this.state.radius * 1.14;
        let element = this.bigCircle.current;
        if(!element) return;
        let startX = element.offsetWidth-r*1.6; 
        return `m${startX},${element.offsetHeight/2} a${r},${r} 0 0 0 ${2*r},0`;
    }

    //from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    //use: window.onload = function() {
    //document.getElementById("arc1").setAttribute("d", describeArc(150, 150, 100, 0, 270));
    //};
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
      
        return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
      
    //from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    //use: window.onload = function() {
    //document.getElementById("arc1").setAttribute("d", describeArc(150, 150, 100, 0, 270));
    //};
    describeArc(x, y, radius, startAngle, endAngle){    
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);
    
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
        var d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    
        return d;       
    }

    //spinning small circle around big circle
    spinSmallCircle() {
        var elements = document.getElementsByTagName("animateMotion");
        for (var i = 0; i < elements.length; i++) {
            //start motion on the svg element
            elements[i].beginElement();
        }
    }      

    render() {
        let pathText = this.getTextPathData();
        let element = this.bigCircle.current;
        let circularPath = "";
        if(element) {            
            let r = this.state.radius;
            let cx = element.offsetWidth / 2 - r; 
            let cy = element.offsetHeight / 2; 
            circularPath = this.describeArc(cx, cy, r, 0, 359);
        }
        
        return (
            <div className="Main">
                <div id="BigCircle" ref={this.bigCircle}>                
                    {data.map((block) => <MenuBlock key={block.order} block={block} />)}
                </div>  
                <svg width="120vh" height="100vh">                
                    <g>
                        <circle id="SmallCircleSvg" cy="5vh" cx="50%" r="2.5vh" stroke="black" strokeWidth="1" fill="red" ref={this.smallCircle} onClick={(e) => {this.spinSmallCircle(e)}} />
                        <animateMotion attributeName="x" begin="indefinite" dur="4s" repeatCount="1"
                            path={circularPath} />
                    </g>
                    <defs>
                        <path id="curvedTextPath" d={pathText}></path>
                    </defs>
                    <text>
                        <textPath startOffset="50%" href="#curvedTextPath">Marcel Malypetr</textPath>
                    </text>
                </svg>
            </div>
        );
    }
}

export default Main;