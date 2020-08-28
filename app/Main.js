import React from "react"
import ReactDOM from "react-dom"

function Main() {
  return <h1>This is React App Boilerplate</h1>
}

ReactDOM.render(<Main />, document.querySelector("#app"))

// Hot module Reload
if (module.hot) {
  module.hot.accept()
}
