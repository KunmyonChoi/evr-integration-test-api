### Get order list for specific hospital

GET http://localhost:3000/evr-core/v1/labdevice/order/HSP000000000032 HTTP/1.1
content-type: application/json
Authorization: token xxx
AgentId: AGT0001

### Post lab result for specific hospital

POST http://localhost:3000/evr-core/v1/labdevice/result/HSP000000000032 HTTP/1.1
content-type: application/json
Authorization: token xxx
AgentId: AGT0001

{
  "hsptlId": "HSP000000000032",
  "prsecBasId": "PBA000000000005",
  "patntId": "PNT0000000001",
  "endDttm": "20221110153325",
  "detailList": [
    {
      "dvcId": "DVC000000000001",
      "prsecItemNm": "Fibrinogen",
      "prsecItemCd": "FB001",
      "prsecRsltVal": "15.0",
      "unit": "mg/dL",
      "minVal": 20.0,
      "maxVal": 40.0
    }
  ]
}

### Report device status

PUT http://localhost:3000/evr-core/v1/labdevice/devicestatus/HSP000000000032 HTTP/1.1
content-type: application/json
Authorization: token xxx
AgentId: AGT0001

{
  "hsptlId": "HSP000000000032",
  "reqDttm": "20221110160000",
  "statusList": [
    {
      "dvcId": "DVC000000000005",
      "stts": "20",
      "sttsMessage": "헬스체크 실패"
    }
  ]
}


### Report lab test result

PUT http://localhost:3000/evr-core/v1/labdevice/workstatus/HSP000000000032 HTTP/1.1
content-type: application/json
Authorization: token xxx
AgentId: AGT0001

{
  "hsptlId": "HSP000000000032",
  "prsecBasId": "PBA000000000005",
  "evtDttm": "20221110153325",
  "stts": "10",
  "detailList": [
    {
      "prsecDtsId": "PDT000000000007",
      "stts": "10"
    }
  ]
}

### Report agent start status

PUT http://localhost:3000/evr-core/v1/labdevice/agentstarted/HSP000000000032 HTTP/1.1
content-type: application/json
Authorization: token xxx
AgentId: AGT0001

{
  "hsptlId": "HSP000000000032",
  "evtDttm": "20221110153325"
}
