import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { LightTheme, DarkTheme, BaseProvider, styled } from "baseui"
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || ""

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

import App from "./App"

const engine = new Styletron({
  hydrate: document.getElementsByClassName("_styletron_hydrate_")
})

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("baseWebAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("baseWebAppToken"),
      username: localStorage.getItem("baseWebAppUsername"),
      avatar: localStorage.getItem("baseWebAppAvatar")
    },
    isChatOpen: false,
    unreadChatCount: 0,
    lightTheme: Boolean(JSON.parse(localStorage.getItem("baseWebAppTheme")))
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
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
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

  useEffect(() => {
    localStorage.setItem("baseWebAppTheme", state.lightTheme)
  }, [state.lightTheme])

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
