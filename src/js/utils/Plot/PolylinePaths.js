

function PathRect(data,xScale, yScale) {
  return data.map((d) => `${xScale(d.x-0.5)},${yScale(d.y)} ${xScale(d.x+0.5)},${yScale(d.y)}`).join(' ')
}

// returns the path (points) required for a kaplan meier plot displayed using a polyline.
// data will be an array of objects with x and y values
function PathKaplanMeier(data,xScale,yScale) {
  return data.map((d,i) => `${xScale(d.x)},${yScale(d.y)}${i<data.length-1 ? ` ${xScale(data[i+1].x)},${yScale(d.y)}`: ""}`)
}

function PathLine(data, xScale, yScale) {
  return data.map(d => `${xScale(d.x)},${yScale(d.y)}`).join(' ')
}


// returns the path (points) for a bar chart with the bars starting from point yAxis
function PathYAxis(data, xScale, yScale, yAxis) {
  const fn = (d) => `${xScale(d.x)},${yScale(d.y)}`
  return fn({x: data[0].x, y: yAxis}) + ' ' + data.map(fn).join(' ') + ' ' + fn({x: data[data.length-1].x, y: yAxis})
}


export {PathLine, PathYAxis, PathRect, PathKaplanMeier}
