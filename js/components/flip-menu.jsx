import React from 'react/addons'

export default class FlipList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0
    }
  }

  _onSwitch(delta) {
    let count = React.Children.count(this.props.children)
    this.setState(state => ({
      active: (state.active + count + delta) % count
    }))
  }

  render() {
    // Find active side
    let side, cnt = 0
    React.Children.map(this.props.children, child => {
      if (this.state.active === cnt++) {
        side = child
      }
    })

    return (
      <div className='FlipMenu'>
        <div className='FlipMenu-controls'>
          <h1 className='FlipMenu-title'>{side.props['data-title']}</h1>
          <button
            className='FlipMenu-switch'
            onClick={e => this._onSwitch(1)}
          ></button>
        </div>
        { side }
      </div>
    )
  }
}
