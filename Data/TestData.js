{
  "treatment": [
    {
      "value": 0,
      "label": "Placebo",
      "color": "#0000FF"
    },
    {
      "value": 1,
      "label": "Mystery Drug",
      "color": "#FF0000"
    }
  ],
  "causality": [
    {
      "column": "causalityD",
      "label": "Drug causality"
    }
  ],
  "keyDates": [
    {
      "column": "registration",
      "label": "Registration"
    },
    {
      "column": "mdtreatment",
      "label": "Mid treatment"
    },
    {
      "column": "eot",
      "label": "End of treatment"
    }
  ],
  "adverseEventGroups" : [
    {
      "name": "Flu Like Symptoms",
      "adverseEvents": [
        "Nausea",
        "Vomiting"
      ]
    }
  ],
  "keyEvents": [
    "column": "eot",
    "label": "End of treatment",
    "color": "#000"
  ],
  "patientData" : [
    {"patid": "P0", "treatment": 0, "registration": "2015-01-01", "mdtreatment": "2015-01-15", "eot": "2015-02-01"},
    {"patid": "P1", "treatment": 0, "registration": "2015-01-05", "mdtreatment": "2015-01-15", "eot": "2015-02-05"},
    {"patid": "P2", "treatment": 1, "registration": "2015-01-08", "mdtreatment": "2015-01-15", "eot": "2015-02-10"},
    {"patid": "P3", "treatment": 1, "registration": "2015-01-09", "mdtreatment": "2015-01-15", "eot": "2015-02-12"},
    {"patid": "P4", "treatment": 1, "registration": "2015-01-10", "mdtreatment": "2015-01-15", "eot": "2015-02-14"},
    {"patid": "P5", "treatment": 0, "registration": "2015-01-12", "mdtreatment": "2015-01-18", "eot": "2015-02-18"}
  ],
  "toxData": [
    {"startToxicity": "2015-01-01", "endToxicity": "2015-01-03", "patid": "P0", "adverseEvent": "Nausea", "grade": 1, "sae": false, "causalityD": 1},
    {"startToxicity": "2015-01-06", "endToxicity": "2015-01-08", "patid": "P0", "adverseEvent": "Nausea", "grade": 2, "sae": false, "causalityD": 3},
    {"startToxicity": "2015-01-11", "endToxicity": "2015-01-13", "patid": "P0", "adverseEvent": "Vomiting", "grade": 1, "sae": false, "causalityD": 4},
    {"startToxicity": "2015-01-09", "endToxicity": "2015-01-13", "patid": "P1", "adverseEvent": "Nausea", "grade": 2, "sae": false, "causalityD": 5},
    {"startToxicity": "2015-01-09", "endToxicity": "2015-01-13", "patid": "P1", "adverseEvent": "Vomiting", "grade": 1, "sae": false, "causalityD": 2},
    {"startToxicity": "2015-01-11", "endToxicity": "2015-01-12", "patid": "P2", "adverseEvent": "Vomiting", "grade": 2, "sae": false, "causalityD": 3},
    {"startToxicity": "2015-01-12", "endToxicity": "2015-01-18", "patid": "P3", "adverseEvent": "Nausea", "grade": 2, "sae": true, "causalityD": 4},
    {"startToxicity": "2015-01-14", "endToxicity": "2015-01-14", "patid": "P4", "adverseEvent": "Nausea", "grade": 3, "sae": true, "causalityD": 5},
    {"startToxicity": "2015-01-17", "endToxicity": "2015-01-24", "patid": "P4", "adverseEvent": "Vomiting", "grade": 1, "sae": false, "causalityD": 3},
    {"startToxicity": "2015-01-18", "endToxicity": "", "patid": "P4", "adverseEvent": "Headache", "grade": 1, "sae": true, "causalityD": 3},
    {"startToxicity": "2015-01-20", "endToxicity": "2015-01-22", "patid": "P4", "adverseEvent": "Palpitations", "grade": 1, "sae": true, "causalityD": 1}
  ]
}
