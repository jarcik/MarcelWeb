import React, { Component } from 'react';
import {MoveMe} from '../Movement/move';
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

        //check
        console.log(data);
    }

    componentDidMount() {
        //set radius of the big circle to the state
        this.setState({
            radius: this.bigCircle.current.offsetWidth
        });

        //center point for rotation of the small circle
        let smallCircleOffset = this.smallCircle.current;
        this.setState({            
            xRot: this.state.radius - smallCircleOffset,
            yRot: this.state.radius - smallCircleOffset
        });
    }

    //spinning small circle around the big crlce
    spin(e) {
        //get center point coordinates and radius from state
        const { radius, xRot, yRot } = this.state;
        
        //rotate the small circle
        let move = new MoveMe().start('SmallCircleSvg', {
            radius: radius,
            //center point of the rotation
            center: { x: xRot, y: yRot },
            // time in milliseconds for one revolution
            interval: 4000,
            // direction = 1 for clockwise, -1 for counterclockwise
            direction: -1,
            // number of times to animate the revolution (-1 for infinite)
            iterations: 1,
            // startPosition can be a degree angle
            // (0 = right, 90 = top, 180 = left, 270 = bottom)
            startPositionDeg: 90,
            // how often (in milliseconds) the position of the
            // circle should be attempted to be updated
            updateInterval: 5
        });

    }

    //make the name as text with circular direction
    circularText(text) {
        //text to circular must be splitted
        let txt = text.split("");
        //element of the text
        let element = this.circularName.current;

        if(!element) return;
        //angle of the curve for the text
        var textAngle = 75;
        //degree for the curve to use in transfor css
        //orign as a start of the transform
        var deg = textAngle / txt.length,
            origin = 180 - (textAngle / 2);
        
        //generate element for each rotated letter and set it to an html element
        txt.forEach((ea) => {
            ea = `<p class='name-letter' style='transform:rotate(${origin}deg);'><span class='flip'>${ea}</span></p>`;
            element.innerHTML += ea;
            origin += deg;
        });
    }

    getTextPathData() {
        let r = this.state.radius / 2 * 1.14;
        let element = this.bigCircle.current;
        if(!element) return;
        let startX = element.offsetWidth / 2 - r; 
        return `m${startX},${element.offsetHeight/2} a${r},${r} 0 0 0 ${2*r},0`;
    }

    getCircularPathData() {
        let r = this.state.radius / 2;
        let element = this.bigCircle.current;
        if(!element) return;
        let cx = element.offsetWidth / 2 - r; 
        let cy = element.offsetHeight / 2; 
        //return `M ${cx} ${cy} m ${-r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 a ${-(r * 2)},0`;
        return `M ${(cx - r)},${cy} a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 ${-(r*2)},0`;

    //     M (CX - R), CY
    //   a R,R 0 1,0 (R * 2),0
    //   a R,R 0 1,0 -(R * 2),0
    

    //     M cx cy
    // m -r, 0
    // a r,r 0 1,0 (r * 2),0
    // a r,r 0 1,0 -(r * 2),0
    // "
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
      

    render() {
        let pathText = this.getTextPathData();
        let r = this.state.radius / 2;
        let element = this.bigCircle.current;
        let circularPath = "";
        if(element) {
            let cx = element.offsetWidth / 2 - r; 
            let cy = element.offsetHeight / 2; 
            circularPath = this.describeArc(cx, cy, this.state.radius/2, 0, 359);
        }
        
        return (
            <div>
                <div id="BigCircle" ref={this.bigCircle}>                
                    {/* <div id="SmallCircle" ref={this.smallCircle} onClick={(e) => {this.spin(e)}}></div>   */}
                    {data.map((block) => <MenuBlock key={block.order} block={block} />)}
                </div>  
                {/* <div id="Name" ref={this.circularName}>{this.circularText("rtepylaM lecraM")}</div> */}
                <svg width="120vh" height="100vh">                
                    <g>
                        <circle id="SmallCircleSvg" cy="5vh" cx="50%" r="2.5vh" stroke="black" strokeWidth="1" fill="red" ref={this.smallCircle} onClick={(e) => {this.spin(e)}} />
                        {/* <animateTransform 
                            attributeName="transform" 
                            type="rotate"
                            values={path} 
                            dur="12s"
                            repeatCount="indefinite"
                        /> */}
                        {/* <animateMotion dur="10s" repeatCount="1"
                            path="M -295.5,295.5 a 295.5,295.5 0 1,0 591,0 a 295.5,295.5 0 1,0 -591,0" /> */}
                        <animateMotion dur="10s" repeatCount="1"
                            path={circularPath} />
                            {/* a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy */}
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