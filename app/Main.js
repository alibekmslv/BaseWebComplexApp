import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { LightTheme, DarkTheme, BaseProvider, styled } from "baseui"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

import App from "./App"

const engine = new Styletron()

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("baseWebAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("baseWebAppToken"),
      username: localStorage.getItem("baseWebAppUsername"),
      avatar: localStorage.getItem("baseWebAppAvatar")
    },
    lightTheme: true
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        draft.user = null
        return
      case "handleTheme":
        draft.lightTheme = !draft.lightTheme
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("baseWebAppToken", state.user.token)
      localStorage.setItem("baseWebAppUsername", state.user.username)
      localStorage.setItem("baseWebAppAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("baseWebAppToken")
      localStorage.removeItem("baseWebAppUsername")
      localStorage.removeItem("baseWebAppAvatar")
    }
  }, [state.loggedIn])

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={state.lightTheme ? LightTheme : DarkTheme}>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <App />
          </DispatchContext.Provider>
        </StateContext.Provider>
      </BaseProvider>
    </StyletronProvider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

// Hot module Reload
if (module.hot) {
  module.hot.accept()
}
