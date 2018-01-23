


function significantFigures( x, len ){
    if(x==0) return x.toFixed(len-1)
    var numDigits = Math.ceil(Math.log10(Math.abs(x)));
    var rounded = Math.round(x*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len)
    return rounded.toFixed(Math.max(len-numDigits,0))
}


export {significantFigures}
