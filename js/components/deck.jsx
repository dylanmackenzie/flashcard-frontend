import React from 'react/addons'
import Card from 'components/card' // eslint-disable-line no-unused-vars
import CardList from 'components/card-list' // eslint-disable-line no-unused-vars
import DeckStore from 'stores/deck'
import DeckActionCreator from 'actions/deck'

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup // eslint-disable-line no-unused-vars

class DeckViewController extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      decks: DeckStore.decks,
      activeDeck: DeckStore.activeDeck,
      activeCard: DeckStore.activeCard,
      activeSide: DeckStore.activeSide,
      reverseAnimation: false
    }

    this._onDeckChange = () => {
      this.setState({
        decks: DeckStore.decks,
        activeDeck: DeckStore.activeDeck,
        activeCard: DeckStore.activeCard,
        activeSide: DeckStore.activeSide,
      })
    }
  }

  componentDidMount() {
    DeckStore.on('change', this._onDeckChange)
  }

  componentWillUnmount() {
    DeckStore.removeListener('change', this._onDeckChange)
  }

  _changeCard(delta) {
    let words = DeckStore.wordsFromDeck(this.state.activeDeck)
    let len = words.length
    let idx = words.indexOf(this.state.activeCard)
    let newWord = words[(idx + len + delta) % len]

    this.setState({
      reverseAnimation: delta > 0 ? false : true
    })

    DeckActionCreator.changeActiveCard(newWord)
  }

  render() {
    let words = DeckStore.wordsFromDeck(this.state.activeDeck)
    let cards = DeckStore.cardsFromDeck(this.state.activeDeck)
    let card = cards[words.indexOf(this.state.activeCard)] || cards[0]

    let sides = [
      { func: c => c.word, lang: 'german', name: 'word' },
      { func: c => c.en.defs[0], lang: 'english', name: 'defs' }
    ]
    let transitionName = 'Card-'
    transitionName += this.state.reverseAnimation ? '-backward' : '-forward'

    return (
      <div className='Deck'>
        <CardList
          deckNames={this.state.deckNames}
          activeCard={this.state.activeCard}
          activeDeck={this.state.activeDeck}
        />
        <div className='Deck-cards'>
          <button className='Deck-prev' onClick={() => this._changeCard(-1)}> &lt; </button>
          <ReactCSSTransitionGroup component='div' className='Deck-cardWrapper' transitionName={transitionName}>
            <Card card={card} sides={sides} key={card ? card.word : ''}/>
          </ReactCSSTransitionGroup>
          <button className='Deck-next' onClick={() => this._changeCard(1)}> &gt; </button>
        </div>
      </div>
    )
  }
}

export default DeckViewController
