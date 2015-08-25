const endpoint = 'http://en.wiktionary.org/w/api.php'

// Singleton for performing ajax requests to wiktionary
let Wiktionary = {
  lookup(word, o) {
    let opts = _.extend({
      format: 'json'
    }, o)

    let query = {
      action: 'query',
      format: opts.format,
      titles: word,
      prop: 'revisions',
      rvprop: 'content',
      formatversion: '2'
    }

    return requestJSONP(endpoint + toQueryString(query))
  }
}

function toQueryString(o) {
  let cnt = 0
  let s = ''
  for (let prop in o) {
    if (o[prop] == null) {
      continue
    }

    s += (cnt ? '&' : '?') + prop + '=' + encodeURIComponent(o[prop])
    cnt += 1
  }

  return s
}

function request(url) {
  let req = new XMLHttpRequest()
  req.withCredentials = true
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

JSONPReceiver.pending = new Map
window.JSONPReceiver = JSONPReceiver
function JSONPReceiver(json) {
  let key = document.currentScript.src

  if (!JSONPReceiver.pending.has(key)) {
    return
  }

  let deferred = JSONPReceiver.pending.get(key)
  if (json.query.pages[0].missing) {
    deferred.reject(Error('No word found'))
  } else {
    let content = _.map(json.query.pages, page => page.revisions[0].content)
    deferred.resolve(content)
  }

  JSONPReceiver.pending.delete(key)
}

function requestJSONP(url) {
  url += '&callback=JSONPReceiver'
  let script = document.createElement('script')

  let deferred = {}
  let promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  }).then(arg => {
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
    return arg
  }, err => {
    script.parentNode.removeChild(script)
    throw err
  })

  JSONPReceiver.pending.set(url, deferred)

  script.src = url
  script.onerror = deferred.reject
  document.body.appendChild(script)

  return promise
}

export default Wiktionary
