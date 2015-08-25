import actionTypes from 'actions/types'
import Dispatcher from 'dispatchers/dispatcher'

import ajax from 'utils/wiki-ajax'
import * as wikiParser from 'utils/wiki-parser'

class DeckActionCreator {
  constructor() {}

  createDeck(name, words) {
    let deckId = name.toLowerCase()
    Dispatcher.dispatch({
      type: actionTypes.createDeck,
      id: deckId
    })

    for (let word of words) {
      this.addCard(word, deckId)
    }

    return deckId
  }

  addCard(word, deckId) {
    ajax.lookup(word).then(pages => {
      let page = pages[0]
      let pos = wikiParser.getPartsOfSpeech('en', 'de', page)
      let info = wikiParser.parseWord('en', 'de', pos[0], page)

      Dispatcher.dispatch({
        type: actionTypes.editDeck,
        action: 'add',
        deck: deckId,
        word: word,
        info: info
      })

      this.changeActiveCard(word)
    }).catch(err => {
      console.log(err)
    })
  }

  removeCard(word, deckId) {
    Dispatcher.dispatch({
      type: actionTypes.editDeck,
      action: 'remove',
      deck: deckId,
      word: word
    })
  }

  reorderCard(from, to, deckId) {
    Dispatcher.dispatch({
      type: actionTypes.editDeck,
      action: 'reorder',
      deck: deckId,
      from,
      to
    })
  }

  changeActiveDeck(id) {
    Dispatcher.dispatch({
      type: actionTypes.changeActiveDeck,
      id,
    })
  }

  changeActiveCard(id) {
    Dispatcher.dispatch({
      type: actionTypes.changeActiveCard,
      id,
    })
  }

  setActiveSide(side) {
    Dispatcher.dispatch({
      type: actionTypes.changeActiveSide,
      side,
    })
  }
}

export default new DeckActionCreator
