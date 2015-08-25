import Dispatcher from 'dispatchers/dispatcher'
import actionTypes from 'actions/types'
import { EventEmitter } from 'events'

function handler(action) {
  switch(action.type) {

  case actionTypes.changeActiveDeck:
    this.activeDeck = action.id
    this.emit('change')
    break
  case actionTypes.changeActiveCard:
    this.activeCard = action.id
    this.emit('change')
    break
  case actionTypes.changeActiveSide:
    this.activeSide = action.side
    this.emit('change')
    break

  case actionTypes.createDeck:
    let id = action.id
    this._decks.set(id, { cards: [] })
    this.activeDeck = id
    this.emit('change')
    break

  case actionTypes.editDeck:
    let word = action.word
    let info = action.info
    let deck = this._decks.get(action.deck)
    let deckAction = action.action

    if (deck == null) {
      throw new Error('Invalid Deck Id')
    }

    switch(deckAction) {
    case 'add':
      deck.cards.push(word)
      if (!this._cards.has(word)) {
        this._cards.set(word, { word: word, en : { defs: info.definitions } })
      }
      break
    case 'remove':
      let index = deck.cards.indexOf(word)
      deck.cards.splice(index, 1)
      break
    case 'reorder':
      let tmp = deck.cards[action.from]
      deck.cards.splice(action.from, 1)
      deck.cards.splice(action.to, 0, tmp)
      break
    }

    this.emit('change')
    break
  }
}

class DeckStore extends EventEmitter {
  constructor(handler) {
    super()
    this.dispatchToken = Dispatcher.register(handler.bind(this))
    this._cards = new Map
    this._decks = new Map
    this.activeDeck = null
    this.activeCard = null
    this.activeSide = { func: c => c.toString, name: 'default' }
  }

  get decks() {
    return Array.from(this._decks.keys())
  }

  wordsFromDeck(deckId) {
    let deck = this._decks.get(deckId)
    if (deck == null) {
      throw new Error('No deck found')
    }

    return deck.cards
  }

  cardsFromDeck(deckId) {
    let deck = this._decks.get(deckId)
    if (deck == null) {
      throw new Error('No deck found')
    }

    return deck.cards.map(word => {
      return this._cards.get(word)
    })
  }
}

export default (new DeckStore(handler))
