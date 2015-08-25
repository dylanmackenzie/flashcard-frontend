import codes from 'utils/lang-codes'

// A simple parser that assumes the non whitespace characters of s are
// the template that describes the word
function makeParser(params, funcs) {
  return (s => {
    let tmplString = s.trim().slice(0, s.search('}}') + 1)
    let tmpl = parseWikiTemplate(tmplString)

    _.remove(tmpl.positional, (_, i) => params[i] == null)
    _.remove(params, t => t == null)
    let ret = _.zipObject(params, tmpl.positional)

    for (let prop in funcs) {
      if (prop in tmpl.named) {
        tmpl.named[prop] = funcs[prop](tmpl.named[prop])
      } else if (prop in ret) {
        ret[prop] = funcs[prop](ret[prop])
      }
    }

    ret.named = tmpl.named
    return ret
  })
}

let parsers = {
  'en:de:noun': makeParser(['gender', 'genitive', 'plural', 'diminutive']),
  'en:de:verb': makeParser(['thirdPerson', 'past', 'pastParticiple']),
  'en:de:adjective': makeParser(['comparative', 'superlative']),
  'en:de:preposition': makeParser([null, null, 'case'], { 'case': w => w.slice(2) })
}

export function parseWord(from, to, pos, page) {
  let key = from + ':' + to + ':' + pos
  let process = parsers[key] || ((data) => ({}))

  to = _.find(codes, lang => lang.code === to).name.toLowerCase()
  let lang = page.slice.apply(page, extractLanguage(to, page))
  let sec = lang.slice.apply(lang, extractSection(pos, lang))

  let ret = process(sec)
  ret.definitions = parseDefinitions(sec)

  return ret
}

export function getPartsOfSpeech(from, to, page) {
  const regex = /^={3,4}([^=]{1,20})={3,4}$/gm
  const poses = [
    'noun',
    'verb',
    'adjective',
    'adverb',
    'pronoun',
    'preposition',
    'conjunction',
    'interjection'
  ]

  to = _.find(codes, lang => lang.code === to).name.toLowerCase()
  let lang = page.slice.apply(page, extractLanguage(to, page))
  let ret = []
  let match = regex.exec(lang)
  while (match != null) {
    let idx = poses.indexOf(match[1].toLowerCase())
    if (idx > -1) {
      ret.push(poses[idx])
    }

    match = regex.exec(lang)
  }

  return ret
}


function parseDefinitions(sec) {
  let lines = sec.split('\n')
  let defs = []

  for (let line of lines) {
    if (line.charAt(0) !== '#' || line.charAt(1) === ':') {
      continue
    }

    let def = line.slice(2)
      .replace(/{{[^|]+}}/g, '')
      .replace(/{{plural of\|([^|]*).*?}}/g, 'plural of $1')
      .replace(/{{[^|]+\|([^|]*).*?}}/g, '($1)')
      .replace(/(\[\[|\]\])/g, '')

    defs.push(def)
  }

  return defs
}

function parseWikiTemplate(tmpl) {
  if (tmpl.charAt(0) !== '{' &&
      tmpl.charAt(1) !== '{' &&
      tmpl.charAt(tmpl.length - 1) !== '}' &&
      tmpl.charAt(tmpl.length - 2) !== '}') {
    throw new Error('Invalid Template')
  }

  tmpl = tmpl.slice(2, -2)
  let fields = tmpl.split('|')

  let ret = { templateTitle: fields[0], positional: [], named: {} }

  for (var i = 1, len = fields.length; i < len; i++) {
    if (fields[i].includes('=')) {
      let def = fields[i].split('=')
      ret.named[def[0]] = def[1]
    } else {
      ret.positional.push(fields[i])
    }
  }

  return ret
}

function extractSection(title, section) {
  return extract(title, /^={3,4}([^=]{1,20})={3,4}$/gm, section)
}

function extractLanguage(lang, article) {
  return extract(lang, /^==([^=]{1,20})==$/gm, article)
}

function extract(str, regex, data) {
  let match = regex.exec(data)
  let found = false
  let start = data.length
  let end = start
  while (match != null) {
    if (match[1].toLowerCase() === str) {
      found = true
      start = match.index + match[0].length
    }

    match = regex.exec(data)

    if (found && match != null) {
      end = match.index
      break
    }
  }

  return [ start, end ]
}
