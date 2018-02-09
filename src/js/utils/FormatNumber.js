import {max} from 'd3-array'


function numberOfDecimals(num) {
  if(typeof(num) === "string"){
    return (num.split('.')[1] || []).length;
  } else {
    return (num.toString().split('.')[1] || []).length;
  }
}

function significantFigures( xArray, len ){
    const numDigits = max(xArray.map(x => Math.ceil(Math.log10(Math.abs(x)))))
    const rounded = xArray.map(x => Math.round(x*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len))
    const fixed = max(rounded.map(x => numberOfDecimals(x)))
    return fixed === 0 ? rounded : rounded.map(x => x.toFixed(Math.min(fixed,len-numDigits)))
}

function bracketPercent (count = 0, total) {
  if(count === 0)
    return ""
  return `(${Math.round(count/total*100)}%)`
}

export {significantFigures, bracketPercent}
