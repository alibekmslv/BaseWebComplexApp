import React, { useEffect, useContext } from "react"
import { withRouter } from "react-router-dom"
import { HeaderNavigation, ALIGN, StyledNavigationList, StyledNavigationItem } from "baseui/header-navigation"
import { StyledLink } from "baseui/link"

import StateContext from "../StateContext"

import HeaderLoggedIn from "./HeaderLoggedIn"
import HeaderLoggedOut from "./HeaderLoggedOut"

function Header({ history }) {
  const appState = useContext(StateContext)

  function handleNav(e) {
    e.preventDefault()
    history.push(e.target.pathname)
  }

  return (
    <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
          <StyledLink href="/" onClick={handleNav}>
            Base Web App
          </StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} />
      {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
    </HeaderNavigation>
  )
}

export default withRouter(Header)
