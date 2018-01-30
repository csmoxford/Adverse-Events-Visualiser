import {significantFigures} from './FormatNumber'


function getTicksDateTime(scale, targetNumber) {
  var domain = scale.domain()/60000

  var range = domain[1] - domain[0]
  var pow10 = 10**Math.floor(Math.log10(range, 10))/100

  var scale = [1,5,15,60,120,360,1440,10080].reduce((prev, curr) => Math.abs(curr*range - targetNumber) < Math.abs(prev*range - targetNumber) ? curr : prev);

}


function getTicksNumeric(scale,  targetNumber = 5) {
  var domain = scale.domain()
  var range = domain[1] - domain[0]
  var pow10 = 10**Math.floor(Math.log10(range, 10))
  var v = range / pow10

  var scale = [0.5,1,2,2.5,4,5].reduce((prev, curr) => Math.abs(curr*v - targetNumber) < Math.abs(prev*v - targetNumber) ? curr : prev);
  domain[0] = Math.ceil(domain[0] / pow10 * scale)*pow10 / scale
  domain[1] = Math.floor(domain[1] / pow10 * scale)*pow10 / scale
  range = domain[1] - domain[0]


  var values = [domain[0]]
  var curValue = domain[0]
  const increment = pow10 / scale
  // console.log('range = ' + range);
  // console.log('increment = ' + increment);
  while(curValue < domain[1]) {
    curValue += increment
    values.push(curValue)
  }

  return significantFigures(values,3)
}

export default getTicksNumeric
