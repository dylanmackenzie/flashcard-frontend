let actionTypes = {}

let actionNames= [
  'createDeck',
  'loadDeck',
  'editDeck',

  'changeActiveDeck',
  'changeActiveCard',
  'changeActiveSide',
]

actionNames.forEach((name, i) => {
  actionTypes[name] = i
})

export default actionTypes
