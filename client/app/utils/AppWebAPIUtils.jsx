import MessageActions from '../actions/MessageActions'

// TODO: integrate those functions
function checkStatus1(json) {
  // if status == 200 then recieved json has no status field
  if (!json.code) {
    return json
  }
  const error = new Error(json.content)
  throw error
}

function checkStatus2(json) {
  if (json.code && json.code == 200) {
    return json.content
  }
  const error = new Error(json.content)
  throw error
}

export function fetchMarkers(data, callback) {
  fetch("/api/v1/marker", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(json => checkStatus1(json))
  .then(markers => callback(markers))
  .catch(err => MessageActions.createMessage({ text: err }))
}

export function sendHeatmapSetting(data) {
  fetch("/api/v1/heatmap", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(resp => resp.json())
    .then(json => checkStatus2(json))
    .then(message => MessageActions.createMessage({ text: message }))
    .catch(err => MessageActions.createMessage({ text: err }))
}

export function fetchTasks(callback) {
  fetch("/api/v1/task", {
    credentials: "same-origin",
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(resp => resp.json())
    .then(json => checkStatus1(json))
    .then(data => callback(data.grid, data.content))
    .catch(err => MessageActions.createMessage({ text: err }))
}

export function fetchRisks(callback) {
  fetch("/api/v1/risk", {
    credentials: "same-origin",
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(resp => resp.json())
    .then(json => checkStatus1(json))
    .then(data => callback(data.grid, data.content))
    .catch(err => MessageActions.createMessage({ text: err }))
}

export function fetchSwitchPoint(callback) {
  fetch("/api/v1/pedal", {
    credentials: "same-origin",
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(resp => resp.json())
  .then(json => checkStatus1(json))
  .then(markers => callback(markers))
  .catch(err => MessageActions.createMessage({ text: err }))
}
