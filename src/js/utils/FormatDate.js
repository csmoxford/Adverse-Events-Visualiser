

function formatDate(date) {

  const day = date.getDate()
  const mnth = date.getMonth() + 1
  const year = date.getFullYear()
  if(isNaN(day)) {
    return "Not Known"
  } else {
    return `${day < 10 ? "0":""}${day}/${mnth < 10 ? "0": ""}${mnth}/${year}`
  }
}

function DayDifference(d1,d2) {
    return (d2 - d1) / 86400000
}

export {formatDate, DayDifference}
