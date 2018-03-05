




function getTreatment(treatments, d) {

  const thisTreatment = treatments.find(t => t.value === d.treatment)

  if(thisTreatment === undefined) {
    return {label: `Treatment not in metadata (${d.treatment})`, color: '#FFFFFF'}
  }
  return thisTreatment
}


export default getTreatment;
