const AssistantV2 = require('ibm-watson/assistant/v2'); // watson sdk
const { IamAuthenticator } = require('ibm-watson/auth');
const moment = require('moment');
const {searchRooms } = require('../crawler');

// Create the service wrapper
const assistant = new AssistantV2({
  authenticator: new IamAuthenticator({ apikey: process.env.ASSISTANT_IAM_APIKEY }),
  version: '2019-02-28',
  url: 'https://gateway.watsonplatform.net/assistant/api/',
});

async function message(input, sessionId, io) {
  const assistantId = process.env.ASSISTANT_ID || '<assistant-id>';
  if (!assistantId || assistantId === '<assistant-id>') {
    throw 'The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
  }

  let textIn = '';

  if(input) {
    textIn = input;
  }

  const payload = {
    assistantId: assistantId,
    sessionId: sessionId,
    input: {
      message_type : 'text',
      text : textIn
    }
  };

  // Send the input to the assistant service
  const data = await assistant.message(payload);
  const { output } = data.result

  if (hasIntent(output, 'busca')) {
    const checkin = moment(getCheckIn(output)).format('DDMMYYYY')
    const checkout = moment(getCheckOut(output)).format('DDMMYYYY')

    searchRooms({ checkin, checkout }).then(rooms => {
      io.emit("message", {
        from: { id: 666, avatar, name: "Watson" },
        content: 'Este são os resultados que eu encontrei: '
      });
      io.emit("message", {
        from: { id: 666, avatar, name: "Watson" },
        content: { results: rooms }
      });
    })
  }
  return getGenericResponse(output);
}

async function session() {
  const assistantId = process.env.ASSISTANT_ID || '{assistant_id}'
  console.log({ASSISTANT_ID: assistantId})
  const result = await assistant.createSession({
    assistantId
  })
  return result.result.session_id
}

const avatar = `https://mpng.pngfly.com/20180526/ljo/kisspng-ibm-watson-iot-tower-ibm-watson-iot-tower-analytic-5b09398685b890.5013696415273312065477.jpg`

function hasIntent(output, id) {
  return output.intents.some(el => el.intent.includes(id))
}

function getGenericResponse(output) {
  return output.generic[0].text
}

function getCheckIn(output) {
  const index = output.entities.findIndex(el => el.value === 'check-in')
  return output.entities[index + 1].value
}

function getCheckOut(output) {
  const index = output.entities.findIndex(el => el.value === 'check-out')
  return output.entities[index + 1].value
}

module.exports = {
  message,
  session,
  avatar
}