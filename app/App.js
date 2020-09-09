import React, { useEffect, useContext } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { Block } from "baseui/block"
import { ToasterContainer } from "baseui/toast"
import { useStyletron } from "baseui"

import StateContext from "./StateContext"

// Our componetns
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import CreatePost from "./components/CreatePost"
import HeaderFlex from "./components/HeaderFlex"
import Footer from "./components/Footer"
import AboutUs from "./components/AboutUs"
import Privacy from "./components/Privacy"
import ViewSinglePost from "./components/ViewSinglePost"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import Chat from "./components/Chat"

function App() {
  const [css, theme] = useStyletron()
  const appState = useContext(StateContext)

  const appStyle = css({
    overflow: "hidden",
    minHeight: "100vh",
    maxWidth: "100vw",
    backgroundColor: theme.colors.primaryB,
    color: theme.colors.primaryA,
    display: "flex",
    flexDirection: "column"
  })

  return (
    <BrowserRouter>
      <Block className={appStyle}>
        <ToasterContainer autoHideDuration={2000}>
          <HeaderFlex />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post" exact>
              <CreatePost />
            </Route>
            <Route path="/about-us">
              <AboutUs />
            </Route>
            <Route path="/privacy-policy">
              <Privacy />
            </Route>
            <Route path="/">{appState.loggedIn ? <Home /> : <HomeGuest />}</Route>
          </Switch>
          {appState.loggedIn ? <Chat /> : null}
          <Footer />
        </ToasterContainer>
      </Block>
    </BrowserRouter>
  )
}

export default App
