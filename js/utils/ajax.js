let apiUrl = 'http://' + document.domain + '/'

let ajax = {
  getCard(word, query) {
    if (query != null) {
      word += query
    }
    return request(apiUrl + 'api-v1/card/en/de/' + word)
  }
}

function request(url) {
  let req = new XMLHttpRequest()
  req.open('GET', url, true)
  return new Promise((resolve, reject) => {
    req.onload = () => {
      if (req.status === 200) {
        resolve(req.response)
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = () => {
      reject(Error('Network Error'))
    }

    req.send()
  })
}

export default ajax
