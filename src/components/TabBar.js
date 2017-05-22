import React, { Component } from 'react'
import PropTypes from 'prop-types';

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: props.tabs,
      activeTabIndex: props.activeTabIndex,
      onSwitchTab: props.onSwitchTab,
      onCloseTab: props.onCloseTab,
      onNewTab: props.onNewTab,
      showNewTab: props.showNewTab !== false
    }
  }

  removeTabAtIndex(idx) {
    this.setState((state) => {
      state.tabs.splice(idx, 1)
      if (idx <= state.activeTabIndex && state.activeTabIndex > 0) {
        state.activeTabIndex = state.activeTabIndex - 1
      }
      return state
    })
  }

  render() {
    if (!this.state.tabs || this.state.tabs.length === 0) {
      return (
        <div />
      )
    }

    const renderedTabs = this.state.tabs.map((tabname, idx) => {
        return (
          <div className={idx === this.state.activeTabIndex ? "tab-item active" : "tab-item"}
               onClick={this.state.onSwitchTab.bind(this, this.state.activeTabIndex, idx)}
               key={""+idx}>
            <span className="icon icon-cancel icon-close-tab"
                  onClick={this.state.onCloseTab.bind(this, idx)}></span>
            {tabname}
          </div>
        )
      })

    const newTab = this.state.showNewTab ? (
      <div className="tab-item tab-item-fixed" onClick={this.state.onNewTab.bind(this)} key="plus-button">
        <span className="icon icon-plus"></span>
      </div>
    ) : (
      <div />
    )
    renderedTabs.push(newTab)

    return (
      <div className="tab-group">
        {renderedTabs}
      </div>
    )
  }
}

TabBar.propTypes = {
  tabs: PropTypes.array,
  activeTabIndex: PropTypes.number.isRequired,
  onSwitchTab: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onNewTab: PropTypes.func,
  showNewTab: PropTypes.bool
}

export default TabBar
