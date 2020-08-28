import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { HeaderNavigation, ALIGN, StyledNavigationList, StyledNavigationItem } from "baseui/header-navigation"
import { StyledLink } from "baseui/link"
import { Input } from "baseui/input"

import StateContext from "../StateContext"

import HeaderLoggedIn from "./HeaderLoggedIn"
import HeaderLoggedOut from "./HeaderLoggedOut"

function Header() {
  const appState = useContext(StateContext)

  return (
    <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
          <Link to="/">Base Web App</Link>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} />
      <StyledNavigationList $align={ALIGN.right}>{appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</StyledNavigationList>
    </HeaderNavigation>
  )
}

export default Header
