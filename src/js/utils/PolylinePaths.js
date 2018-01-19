

function PathRect(data,xScale, yScale) {
  return data.map((d) => `${xScale(d.x-0.5)},${yScale(d.y)} ${xScale(d.x+0.5)},${yScale(d.y)}`).join(' ')
}

function PathKaplanMeier(data,xScale,yScale) {
  return data.map((d,i) => `${xScale(d.x)},${yScale(d.y)}${i<data.length-1 ? ` ${xScale(data[i+1].x)},${yScale(d.y)}`: ""}`)
}

function PathLine(data, xScale, yScale) {
  const fn = (d) => (xScale(d.x) + "," + yScale(d.y))
  return data.map(fn).join(' ')
}



function PathYAxis(data, xScale, yScale, yAxis) {
  const fn = (d) => (xScale(d.x) + "," + yScale(d.y))
  return fn({x: data[0].x, y: yAxis}) + ' ' + data.map(fn).join(' ') + ' ' + fn({x: data[data.length-1].x, y: yAxis})
}
export {PathLine, PathYAxis, PathRect, PathKaplanMeier}
