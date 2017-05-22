import React, { Component } from 'react'

// import logo from './logo.svg' // worth noting that this is a thing you can do

import update from 'immutability-helper'

import TabBar from './TabBar'
import EditorView from './EditorView'

import '../css/App.css'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="window">
        <TabBar
          tabs={["unnamed.tex"]}
          activeTabIndex={0}
          onSwitchTab = {function(from, to) {
            if (this.closingtab)
              return this.closingtab = false
            this.setState(update(this.state, {activeTabIndex: {$set: to}}))
          }}
          onCloseTab = {function(idx) {
            this.closingtab = true
            this.removeTabAtIndex(idx)
          }}
          onNewTab = {function() {
            this.setState((state) => {
              return update(state, {
                activeTabIndex: {$set: this.state.tabs.length},
                tabs: {$push: ["new tab"]}
              })
            })
          }}
          showNewTab = {true}
          />

        <div className="window-content">
          <EditorView />
        </div>
      </div>
    )
  }
}

export default App;
