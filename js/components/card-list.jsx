import React from 'react/addons'
import { List, ListItem } from 'react-mutable-list'
import classSet from 'classnames'
import FlipMenu from 'components/flip-menu'
import DeckStore from 'stores/deck'
import DeckActionCreator from 'actions/deck'

export default class CardListView extends React.Component {
  constructor(props) {
    super(props)

    this._onKeyDown = this._onKeyDown.bind(this)
    this._onInputChange = this._onInputChange.bind(this)
    this._save = this._save.bind(this)
    this.state = {
      value: ''
    }
  }

  _reorder(o, n) {
    DeckActionCreator.reorderCard(o, n, DeckStore.activeDeck)
  }

  _save() {
    DeckActionCreator.addCard(this.state.value, DeckStore.activeDeck)
    this.setState({
      value: ''
    })
  }

  _removeCard(word, e) {
    e.stopPropagation()
    DeckActionCreator.removeCard(word, DeckStore.activeDeck)
  }

  _onInputChange(e) {
    this.setState({
      value: e.target.value
    })
  }

  _onKeyDown(e) {
    // enter key
    if (e.keyCode === 13) {
      this._save()
    }
  }

  render() {
    let words = DeckStore.wordsFromDeck(DeckStore.activeDeck) || []
    let wordList = words.map((word, i) => {
      let props = {
        key: word,
        onClick: DeckActionCreator.changeActiveCard.bind(null, word),
        onRemove: this._removeCard.bind(this, word),
        className: classSet('CardList-item', {
          'CardList-item--active': word === this.props.activeCard
        }),
      }

      return (
        <ListItem {...props}>
          {word}
        </ListItem>
      )
    })

    return (
      <FlipMenu>
        <div data-title='Cards' className='FlipMenu-menu'>
          <input
            type='text'
            placeholder='German Word...'
            className='FlipMenu-input'
            onKeyDown={this._onKeyDown}
            onChange={this._onInputChange}
            value={this.state.value}
          />
          <List
            enableDeleteTransitions={true}
            isDraggable={false}
            onReorder={(from, to) => this._reorder(from, to)}
            className='CardList'
          >
            { wordList }
          </List>
        </div>
      </FlipMenu>
    )
  }
}
