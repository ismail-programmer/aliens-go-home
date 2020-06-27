import React from "react";
import PropTypes from "prop-types";
import { pathFromBezierCurve } from "../utils/formulas";

const canonPipe = props => {
  const canonPipeStyle = {
    fill: "#999",
    stroke: "#666",
    strokeWidth: "2px"
  };

  const transfrom = `rotate(${props.rotation}, 0 , 0)`;

  const muzzleWidth = 40;
  const halfMuzzle = 20;
  const height = 100;
  const yBasis = 70;

  const cubicBezierCurve = {
    initialAxis: {
      x: -halfMuzzle,
      y: -yBasis
    },
    initialControlPoint: {
      x: -40,
      y: height * 1.7
    },
    endingControlPoint: {
      x: 80,
      y: height * 1.7
    },
    endingAxis: {
      x: muzzleWidth,
      y: 0
    }
  };

  return (
    <g transform={transfrom}>
      <path style={canonPipeStyle} d={pathFromBezierCurve(cubicBezierCurve)} />
      <line
        x1={-halfMuzzle}
        y1={-yBasis}
        x2={halfMuzzle}
        y2={-yBasis}
        style={canonPipeStyle}
      />
    </g>
  );
};

canonPipe.propType = {
  rotation: PropTypes.number.isRequired
};

export default canonPipe;
