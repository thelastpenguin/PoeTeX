import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import brace from 'brace'

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
    const parent = ReactDOM.findDOMNode(this)
    const editorElem = parent.firstElementChild
    const previewElem = document.createElement('div')
    parent.appendChild(previewElem)

    var editor = brace.edit(editorElem);
    editor.getSession().setMode('ace/mode/latex');
    editor.setTheme('ace/theme/tomorrow');

    const getMathModes = line => {
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

    function forEachLineElement(iter) {
      return (e, renderer) => {
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
                iter(row, lineElement)
            }
            row++;
        }
      }
    }

    const lineCache = {}
    editor.renderer.on('afterRender', forEachLineElement((lineNo, element) => {
      if (!lineCache[lineNo]) {
        lineCache[lineNo] = {
          lastText: null,
          preview: null
        }
      }

      const cache = lineCache[lineNo]

      const text = editor.session.getLine(lineNo)
      const nextLine = editor.session.getLine(lineNo + 1)
      const nextNextLine = editor.session.getLine(lineNo + 2)
      if (text + '-' + nextLine + '-' + nextNextLine === cache.lastText) {
        if (cache.preview.parentNode != element) {
          element.appendChild(cache.preview)
        }
        return
      }
      cache.lastText = nextLine

      if (cache.preview && cache.preview.parentNode) {
        cache.preview.parentNode.removeChild(cache.preview)
      }
      cache.preview = document.createElement('div')

      if (nextLine.trim().length !== 0) return // no preview if there isn't any room

      // cache.preview.style.marginLeft = '10px'

      const linePosition = element.getBoundingClientRect()
      const editorPosition = editorElem.getBoundingClientRect()

      cache.preview.style.position = 'absolute'
      cache.preview.style.left = (linePosition.left - editorPosition.left) + 'px'
      cache.preview.style.top = (linePosition.bottom - editorPosition.top) + 'px'
      if (nextNextLine.trim().length === 0) {
        cache.preview.style.fontSize = "2em"
      } else {
        cache.preview.style.fontSize = "1em"
      }

      const mathModes = getMathModes(text)
      if (mathModes.length > 0 && nextLine.trim().length === 0) {
        try {
          const renderedMath = katex.render(text.substring(mathModes[0].start, mathModes[0].end), cache.preview);
        } catch (e) { }
      }
      element.appendChild(cache.preview)
    }))
  }

  render() {
    return (
      <div>
        <div style={{position: "absolute", height: "100%", width: "100%"}}></div>
      </div>
    )
  }

}

export default LatexEditor
