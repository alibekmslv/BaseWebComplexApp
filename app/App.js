import React, { useEffect, useContext } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { Block } from "baseui/block"
import { ToasterContainer } from "baseui/toast"
import { useStyletron } from "baseui"

import StateContext from "./StateContext"

// Our componetns
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import CreatePost from "./components/CreatePost"
import HeaderFlex from "./components/HeaderFlex"

function App() {
  const [css, theme] = useStyletron()
  const appState = useContext(StateContext)

  const appStyle = css({
    overflow: "hidden",
    minHeight: "100vh",
    maxWidth: "100vw",
    backgroundColor: theme.colors.primaryB,
    color: theme.colors.primaryA
  })

  return (
    <BrowserRouter>
      <Block className={appStyle}>
        <ToasterContainer autoHideDuration={2000}>
          <HeaderFlex />
          <Switch>
            <Route path="/create-post" exact>
              <CreatePost />
            </Route>
            <Route path="/">{appState.loggedIn ? <Home /> : <HomeGuest />}</Route>
          </Switch>
        </ToasterContainer>
      </Block>
    </BrowserRouter>
  )
}

export default App
