function checkStatus(resp, code) {
  if (resp.status == code) {
    return resp
  } else {
    console.log(resp)
    const error = new Error(resp.statusText)
    error.resp = resp
    throw error
  }
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
    .then(resp => checkStatus(resp, 200))
    .then(resp => resp.json())
    .then(markers => callback(markers))
    .catch(err => console.log('post setting error:', err))
}

export { fetchMarkers }
