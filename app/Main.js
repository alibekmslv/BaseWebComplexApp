import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { LightTheme, DarkTheme, BaseProvider, styled } from "baseui"
import { ToasterContainer } from "baseui/toast"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// Our componetns
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"

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
            <BrowserRouter>
              <ToasterContainer autoHideDuration={2000}>
                <Header />
                <Switch>
                  <Route path="/">{state.loggedIn ? <Home /> : <HomeGuest />}</Route>
                </Switch>
              </ToasterContainer>
            </BrowserRouter>
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
