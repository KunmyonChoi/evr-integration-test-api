var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();


function spellcheck(obj, parameters, errstr) {
  let given = Object.keys(obj)
  let outsiders = given.filter( function( el ) {
    return parameters.indexOf( el ) < 0;
  });
  if (outsiders.length > 0) 
    errstr.push('Please check spell: ' + outsiders.join('/') + ' key')
}

/* GET order listing. 
GET /evr-core/v1/labdevice/order/{병원ID}
*/
router.get('/labdevice/order/:hsptlId', function(req, res, next) {
  let contentType = req.header('Content-Type')
  let authorization = req.header('Authorization')
  let agentId = req.header('AgentId')

  console.log("Header:", contentType, authorization, agentId)

  // Mandatory
  let hsptlId = req.params.hsptlId

  if (!hsptlId) {
    console.log("params.hsptlId is mandatory")
    res.json({
      "resultCode": "EVR-0002",
      "resultMessage": "hsptlId is mandatory"
    })
  } else {
    fetch('http://localhost:3001/hsptls?hsptlId=' + hsptlId)
    .then(res => res.json())
    .then(json => {
      let data = json[0]
      if (data) {
        data.resultCode = "EVR-0000"
        data.resultMessage = "success"
      } else {
        console.log("Record not found")
        data = {
          "resultCode": "EVR-0001",
          "resultMessage": "hsptlId not found"
        }
      }
      res.json(data)
    });
  }
});



/* POST lab result. 
POST /evr-core/v1/labdevice/result/{병원ID}
*/
router.post('/labdevice/result/:hsptlId', function(req, res, next) {
  let contentType = req.header('Content-Type')
  let authorization = req.header('Authorization')
  let agentId = req.header('AgentId')

  console.log("Header:", contentType, authorization, agentId)


  // result
  let errstr = [];

  // key check
  spellcheck(req.body, ['hsptlId', 'patntId', 'specsDivCd', 'endDttm', 'detailList', 'prsecBasId'], errstr)

  // Optional
  let prsecBasId = req.body.prsecBasId

  // Mandatory
  let hsptlId = req.body.hsptlId
  let patntId = req.body.patntId
  let specsDivCd = req.body.specsDivCd
  let endDttm = req.body.endDttm
  let detailList = req.body.detailList

  if (!hsptlId) errstr.push("body.hsptlId is mandatory")
  if (!req.params.hsptlId) errstr.push("params.hsptlId is mandatory")
  if (!(req.params.hsptlId == hsptlId)) errstr.push("params.hsptlId and body.hsptlId should be the same")
  
  if (!patntId) errstr.push("patntId is mandatory")
  if (!specsDivCd) errstr.push("specsDivCd is mandatory")
  if (!endDttm) errstr.push("endDttm is mandatory")
  if (!detailList) {
    errstr.push("detailList is mandatory")
  } else {
    detailList.forEach(element => {

      // key check
      spellcheck(element, ['prsecDtsId', 'dvcId', 'prsecItemId', 'prsecItemNm', 'prsecItemCd', 'prsecRsltVal', 'unit', 'prsecRsltDivCd', 'minVal', 'maxVal', 'options'], errstr)

      // Optional
      let dvcId = element.dvcId
      let prsecItemId = element.prsecItemId
      let prsecItemNm = element.prsecItemNm
      let prsecItemCd = element.prsecItemCd
      let prsecRsltVal = element.prsecRsltVal
      let unit = element.unit
      let prsecRsltDivCd = element.prsecRsltDivCd
      let minVal = element.minVal
      let maxVal = element.maxVal

      // Mandatory
      let prsecDtsId = element.prsecDtsId

      if (!prsecDtsId) errstr.push("detailList.prsecDtsId is mandatory")

      // Check number
      if (typeof(prsecRsltVal) !== "number") errstr.push("detailList.prsecRsltVal should be a number")
      if (typeof(minVal) !== "number") errstr.push("detailList.minVal should be a number")
      if (typeof(maxVal) !== "number") errstr.push("detailList.maxVal should be a number")
    })
  }

  if (errstr.length > 0) {
    // return error code
    console.log(errstr)
    res.json({
      "resultCode": "DX-0002",
      "resultMessage": errstr.join(", ")
    })
  } else {
    // Not save result to db. Just debug it
    res.json({
      "resultCode": "DX-0000",
      "resultMessage": "success"
    })    
  } 
});



/* PUT device status
PUT /evr-core/v1/labdevice/devicestatus/{병원ID}
*/
router.put('/labdevice/devicestatus/:hsptlId', function(req, res, next) {
  let contentType = req.header('Content-Type')
  let authorization = req.header('Authorization')
  let agentId = req.header('AgentId')

  console.log("Header:", contentType, authorization, agentId)

  // result
  let errstr = [];

  spellcheck(req.body, ['hsptlId', 'reqDttm', 'statusList'], errstr)

  // Mandatory
  let hsptlId = req.body.hsptlId
  let reqDttm = req.body.reqDttm
  let statusList = req.body.statusList

  if (!hsptlId) errstr.push("body.hsptlId is mandatory")
  if (!req.params.hsptlId) errstr.push("params.hsptlId is mandatory")
  if (!(req.params.hsptlId == hsptlId)) errstr.push("params.hsptlId and body.hsptlId should be the same")
  
  if (!reqDttm) errstr.push("reqDttm is mandatory")
  if (!statusList) {
    errstr.push("statusList is mandatory")
  } else {
    statusList.forEach(element => {

      spellcheck(element, ['dvcId', 'stts', 'sttsMessage'], errstr)

      // Optional
      let sttsMessage = element.sttsMessage

      // Mandatory
      let dvcId = element.dvcId
      let stts = element.stts

      if (!dvcId) errstr.push("statusList.dvcId is mandatory")
      if (!stts) errstr.push("statusList.stts is mandatory")
    })
  }

  if (errstr.length > 0) {
    // return error code
    console.log(errstr)
    res.json({
      "resultCode": "DX-0002",
      "resultMessage": errstr.join(", ")
    })
  } else {
    // Not save result to db. Just debug it
    res.json({
      "resultCode": "DX-0000",
      "resultMessage": "success"
    })    
  } 
});


/* PUT work status
PUT /evr-core/v1/labdevice/workstatus/{병원ID}
*/
router.put('/labdevice/workstatus/:hsptlId', function(req, res, next) {
  let contentType = req.header('Content-Type')
  let authorization = req.header('Authorization')
  let agentId = req.header('AgentId')

  console.log("Header:", contentType, authorization, agentId)

  // result
  let errstr = [];

  spellcheck(req.body, ['hsptlId', 'prsecBasId', 'evtDttm', 'stts', 'detailList'], errstr)

  // Mandatory
  let hsptlId = req.body.hsptlId
  let prsecBasId = req.body.prsecBasId
  let evtDttm = req.body.evtDttm
  let stts = req.body.stts
  let detailList = req.body.detailList

  if (!hsptlId) errstr.push("body.hsptlId is mandatory")
  if (!req.params.hsptlId) errstr.push("params.hsptlId is mandatory")
  if (!(req.params.hsptlId == hsptlId)) errstr.push("params.hsptlId and body.hsptlId should be the same")
  
  if (!prsecBasId) errstr.push("prsecBasId is mandatory")
  if (!evtDttm) errstr.push("evtDttm is mandatory")
  if (!stts) errstr.push("stts is mandatory")
  if (!detailList) {
    errstr.push("detailList is mandatory")
  } else {
    detailList.forEach(element => {

      spellcheck(element, ['prsecDtsId', 'stts'], errstr)

      // Mandatory
      let prsecDtsId = element.prsecDtsId
      let stts = element.stts

      if (!prsecDtsId) errstr.push("detailList.prsecDtsId is mandatory")
      if (!stts) errstr.push("detailList.stts is mandatory")
    })
  }

  if (errstr.length > 0) {
    // return error code
    console.log(errstr)
    res.json({
      "resultCode": "DX-0002",
      "resultMessage": errstr.join(", ")
    })
  } else {
    // Not save result to db. Just debug it
    res.json({
      "resultCode": "DX-0000",
      "resultMessage": "success"
    })    
  } 
});



/* PUT Agent start status
PUT /evr-core/v1/labdevice/agentstarted/{병원ID}
*/
router.put('/labdevice/agentstarted/:hsptlId', function(req, res, next) {
  let contentType = req.header('Content-Type')
  let authorization = req.header('Authorization')
  let agentId = req.header('AgentId')

  console.log("Header:", contentType, authorization, agentId)

  // result
  let errstr = [];

  spellcheck(req.body, ['hsptlId', 'evtDttm'], errstr)

  // Mandatory
  let hsptlId = req.body.hsptlId
  let evtDttm = req.body.evtDttm

  if (!hsptlId) errstr.push("body.hsptlId is mandatory")
  if (!req.params.hsptlId) errstr.push("params.hsptlId is mandatory")
  if (!(req.params.hsptlId == hsptlId)) errstr.push("params.hsptlId and body.hsptlId should be the same")
  
  if (!evtDttm) errstr.push("evtDttm is mandatory")
  
  if (errstr.length > 0) {
    // return error code
    console.log(errstr)
    res.json({
      "resultCode": "DX-0002",
      "resultMessage": errstr.join(", ")
    })
  } else {
    // Not save result to db. Just debug it
    res.json({
      "resultCode": "DX-0000",
      "resultMessage": "success"
    })    
  } 
});

module.exports = router;
