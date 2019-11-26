import requests
import json
import sys

print(sys.argv[1], sys.argv[2])
mno = sys.argv[1]
msg = sys.argv[2]
URL = 'https://www.way2sms.com/api/v1/sendCampaign'

# get request
def sendPostRequest(reqUrl, apiKey, secretKey, useType, phoneNo, senderId, textMessage):
  req_params = {
  'apikey':apiKey,
  'secret':secretKey,
  'usetype':useType,
  'phone': phoneNo,
  'message':textMessage,
  'senderid':senderId
  }
  return requests.post(reqUrl, req_params)

# get response
response = sendPostRequest(URL, 'GQV86VAIQ1VQWRJDYPHN16MHL585GZC6', 'WTJW2T8NR3Z7DVX8', 'stage', mno, 'taruns', msg )
# print response if you want
print(response.text)