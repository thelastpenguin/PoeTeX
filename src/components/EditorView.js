import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Dimensions from 'react-dimensions'

import spdf from "simple-react-pdf"

import LatexEditor from './LatexEditor'

const AutosizePDF = Dimensions()(spdf.SimplePDF)

class EditorView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filename: props.filename,
      pathOnDisk: props.pathOnDisk || null
    }
  }

  render() {
    return (
      <div className="pane-group">
        <div className="pane">
          <LatexEditor />
        </div>
        <div className="pane">
          <AutosizePDF
              file="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
              width={this.props.containerWidth}
              height={this.props.containerHeight}
              />
        </div>
      </div>
    )
  }
}

export default EditorView
