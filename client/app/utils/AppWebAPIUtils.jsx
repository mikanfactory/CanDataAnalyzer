import MessageActions from '../actions/MessageActions'

function checkStatus(json) {
  // if status == 200 then recieved json has no status field
  if (!json.code) {
    return json
  }
  const error = new Error(json.message)
  throw error
}

function fetchMarkers(data, callback) {
  fetch("/api/v1/markers", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(json => checkStatus(json))
  .then(markers => callback(markers))
  .catch(err => MessageActions.createMessage({text: `posting error: ${err}`}))
}

export { fetchMarkers }
