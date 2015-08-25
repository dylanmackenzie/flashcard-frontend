import React from 'react/addons'

const classSet = React.addons.classSet

// A MutableListView represents a single list from which items can be
// added, deleted, and rearranged.
export class MutableListView extends React.Component {
  constructor(props) {
    super(props)

    this.onDragMove = null

    this.state = {
      dragItem: null,
      dragIdx: 0,
      dragOffset: { x: 0, y: 0 }
      dragTransform: { x: 0, y: 0 }
      dragOldPosition: { x: 0, y: 0 }
    }
  }

  _onDragStart(item, e) {
    let el = React.findDOMElement(item)

    this.setState((props, state) => {
      dragItem: item,
      dragIdx: props.items.indexOf(item),
      dragTransform: {x: 0, y: 0},
      dragOffset: mouseOffset(el, e),
      dragOldPosition: { x: e.clientX, y: e.clientY }
    })

    this.onDragMove = this._onDragMove.bind(this, item)
    window.addEventListener('mousemove', this.onDragMove)

  }

  _onDragMove(item, e) {
    this.setState((props, state) => {
      dragIdx: props.items.indexOf(item),
      dragTransform: {
        x: e.clientX - state.dragOldPosition.x + state.dragTransform.x,
        y: e.clientY - state.dragOldPosition.y + state.dragTransform.y
      },
      dragOldPosition: { x: e.clientX, y: e.clientY }
    })
  }

  _onDragEnd(item, e) {
    this.setState((props, state) => {
      dragItem: null,
      dragIdx: 0
    })

    window.removeEventListener('mousemove', this.onDragMove)
  }

  render() {
    let isDraggable = this.props.isDraggable
    let items = this.props.items
    let activeItems = this.props.activeItems
    let onSelect = this.props.onSelect
    let onReorder = this.props.onReorder
    let onDelete = this.props.onDelete

    let stops = this.refs.map(item => {
      let el = React.findDOMNode(item)
      let rect = el.getBoundingClientRect()
      return rect.top()
    })

    let lis = items.map(item => {

      let style = {}
      if (this.state.dragItem != null) {
        if (dragState.item === item) {

        }
        style.visibility = dragState.item === item ? 'hidden' : 'visible'
      }

      let itemProps = {
        key: item.id,
        ref: item.id,
        style,
        onClick: e => onSelect(item.id),
        className: classSet('ReactList-item', {
          'ReactList-item--active': activeItems.indexOf(item.id) > -1,
          'ReactList-item--dragging': this.state.drag === item.id
        }),
      }

      return (
        <li {itemProps}>
          { item.content }
          <button onClick={e => onDelete(item.id)} className='ReactList-delete'>x</button>
        </li>
      )
    })

    return (
      <ul class='ReactList'>
        {lis}
      </ul>
    )
  }
}

MutableListView.defaultProps = {
  activeItems: [],
  isDraggable: true,
  onSelect: () => {},
  onReorder: () => {},
  onDelete: () => {}
}

function outerHeight(el) {
  let styles = window.getComputedStyle(el)
  let margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom'])

  return el.offsetHeight + margin
}

function mouseOffset(el, e) {
  let rect = el.getBoundingClientRect()
  let clientX = e.touches ? e.touches[0].clientX : e.clientX
  let clientY = e.touches ? e.touches[0].clientY : e.clientY
  let x = (clientX - rect.left) / rect.width
  let y = (rect.height - (clientY - rect.top)) / rect.height

  return {x, y}
}
