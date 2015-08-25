import React from 'react/addons'

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup // eslint-disable-line no-unused-vars

class CardView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSide: 0
    }
  }

  _flip(delta) {
    this.setState(function (state, props) {
      let len = props.sides.length
      return {
        activeSide: (state.activeSide + delta + len) % len
      }
    })
  }

  render() {
    let card = this.props.card
    let side = this.props.sides[this.state.activeSide]
    let lang = side.lang
    let name = side.name
    let text = ''
    if (card != null) {
      text = side.func(card)
    } else {
      console.error('No card passed to CardView')
    }

    return (
      <div className='Card' onClick={() => this._flip(1)} >
        <ReactCSSTransitionGroup transitionName='Card-face-'>
          <div className='Card-face' data-language={lang} key={name} >
            <p className='Card-text'>
                {text}
            </p>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default CardView
