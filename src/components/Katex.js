import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import 'katex/dist/katex.min.css'
import katex from 'katex/dist/katex.min.js'

class Katex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latex: props.latex
    }
  }

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this)
    const renderedMath = katex.render(this.state.latex, element);
  }

  render() {
    return (<div />)
  }
}

Katex.propTypes = {
  latex: PropTypes.string.isRequired
}
export default Katex
