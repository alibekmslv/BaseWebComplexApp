import React, { useContext } from "react"
import { useStyletron } from "baseui"
import { useHistory } from "react-router-dom"
import { StyledLink } from "baseui/link"
import { appHeaderLogo } from "./Style"

import HeaderItemsLoggedIn from "./HeaderItemsLoggedIn"
import HeaderItemsLoggedOut from "./HeaderItemsLoggedOut"

import StateContext from "../StateContext"

function HeaderFlex() {
  const appState = useContext(StateContext)
  const [css, theme] = useStyletron()
  const history = useHistory()

  const handleNav = e => {
    e.preventDefault()
    history.push(e.target.pathname)
  }

  const appHeader = css({
    display: "flex",
    flexWrap: "wrap",
    ...theme.typography.ParagraphMedium,
    borderBottomColor: theme.colors.contentInverseSecondary,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    paddingTop: theme.sizing.scale500,
    paddingBottom: theme.sizing.scale500,
    paddingLeft: theme.sizing.scale800,
    paddingRight: theme.sizing.scale800
  })

  return (
    <header className={appHeader}>
      <div className={css(appHeaderLogo)}>
        <StyledLink href="/" onClick={handleNav}>
          Base Web App
        </StyledLink>
      </div>
      {appState.loggedIn ? <HeaderItemsLoggedIn /> : <HeaderItemsLoggedOut />}
    </header>
  )
}

export default HeaderFlex
