import React, { useEffect, useContext } from "react"
import { Button, KIND, SHAPE } from "baseui/button"
import { ALIGN, StyledNavigationItem, StyledNavigationList } from "baseui/header-navigation"
import Search from "baseui/icon/search"
import Overflow from "baseui/icon/overflow"
import { Avatar } from "baseui/avatar"
import { StyledLink } from "baseui/link"

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function HeaderLoggedIn() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function handleSignOut() {
    appDispatch({ type: "logout" })
  }
  return (
    <StyledNavigationList $align={ALIGN.right}>
      <StyledNavigationItem>
        <Button kind={KIND.tertiary} shape={SHAPE.pill}>
          <Search title="Search" />
        </Button>
        <Button kind={KIND.tertiary} shape={SHAPE.pill}>
          <Overflow title="Chat" />
        </Button>
      </StyledNavigationItem>
      <StyledNavigationItem>
        <Avatar name={appState.user.username} src={appState.user.avatar} />
      </StyledNavigationItem>
      <StyledNavigationItem>
        <StyledLink href="#">Create Post</StyledLink>
      </StyledNavigationItem>
      <StyledNavigationItem>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </StyledNavigationItem>
    </StyledNavigationList>
  )
}

export default HeaderLoggedIn
