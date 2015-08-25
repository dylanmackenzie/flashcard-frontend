import React from 'react/addons'
import Deck from 'components/deck' // eslint-disable-line no-unused-vars
import DeckActionCreator from 'actions/deck'

DeckActionCreator.createDeck('demo', ['Hallo', 'Leute', 'wie', 'geht', 'es', 'Heute'])

React.render(
  <Deck />,
  document.querySelector('body')
)
