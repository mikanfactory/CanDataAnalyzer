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

export { checkStatus }
