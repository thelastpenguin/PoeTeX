import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions'

import brace from 'brace'

import spdf from "simple-react-pdf";

import Katex from './Katex'

import 'katex/dist/katex.min.css'
import katex from 'katex/dist/katex.min.js'

import 'brace/mode/latex'
import 'brace/theme/tomorrow'

class LatexEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: props.theme || "tomorrow"
    }
  }

  componentDidMount() {
    var element = ReactDOM.findDOMNode(this)
    console.log(element)
    var editor = brace.edit(element);
    editor.getSession().setMode('ace/mode/latex');
    editor.setTheme('ace/theme/tomorrow');

    function getMathModes(line) {
      let offset = 0

      let mathModes = []

      while (true) {
        offset = line.indexOf('$', offset)
        if (offset === -1) break
        if (offset == line.length - 1) break

        let start
        let endOfBlock
        if (line.charAt(offset + 1) === '$') {
          start = offset + 2
          endOfBlock = line.indexOf('$$', start)
          offset = endOfBlock + 2
        } else {
          start = offset + 1
          endOfBlock = line.indexOf('$', start)
          offset = endOfBlock + 1
        }

        if (endOfBlock === -1) {
          mathModes.push({
            "start": start,
            "end": line.length
          })
          break
        }

        mathModes.push({
          "start": start,
          "end": endOfBlock
        })
      }
      return mathModes
    }

    editor.session.selection.on('changeCursor', () => {
      const cursor = editor.session.selection.getCursor()
      const line = editor.session.getLine(cursor.row)

      // const inMath = checkCursorInMathMode(line, cursor.column)
      // console.log(inMath)
    })

    let rowcache = {}
    function updatePreviews(e, renderer) {
        var textLayer = renderer.$textLayer;

        var config = textLayer.config;
        var session = textLayer.session;

        var first = config.firstRow;
        var last = config.lastRow;

        var lineElements = textLayer.element.childNodes;
        var lineElementsIdx = 0;

        var row = first;
        var foldLine = session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        var useGroups = textLayer.$useLineGroups();

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row + 1;
                foldLine = textLayer.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > last)
                break;

            var lineElement = lineElements[lineElementsIdx++];
            if (lineElement) {
                if (useGroups) lineElement = lineElement.lastChild;
                var widget, a = rowcache[row]
                const line = editor.session.getLine(row)
                if (!a || a.text != line || !a.element) {
                    widget = document.createElement("span");
                    const internal = document.createElement("span")
                    internal.style = "margin-left: 5px"
                    widget.appendChild(internal)

                    const mathModes = getMathModes(line)
                    if (mathModes.length > 0) {
                      try {
                        katex.render(line.substring(mathModes[0].start, mathModes[0].end), internal)
                      } catch (e) { console.log(e) }
                    }
                    // widget.textContent = a.display;
                    // widget.className = "widget stack-message" + (a.more ? " more" : "");
                    // widget.annotation = a;
                    a = {}
                    rowcache[row] = a
                    a.element = widget
                    a.text = line
                }
                else widget = a.element;
                lineElement.appendChild(widget);
            }
            row++;
        }
    }

    editor.renderer.on('afterRender', updatePreviews)
  }

  render() {
    return (<div style={{position: "absolute", height: "100%", width: "100%"}}> helo world this is a test</div>)
  }

}

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
