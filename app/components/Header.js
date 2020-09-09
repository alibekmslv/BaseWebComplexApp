import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import { useStyletron } from "baseui"
import { StyledLink } from "baseui/link"

import { appHeaderLogo } from "./Style"
import StateContext from "../StateContext"
import HeaderItemsLoggedIn from "./HeaderItemsLoggedIn"
import HeaderItemsLoggedOut from "./HeaderItemsLoggedOut"

function Header(props) {
  const appState = useContext(StateContext)
  const [css, theme] = useStyletron()
  const history = useHistory()
  const headerContent = appState.loggedIn ? <HeaderItemsLoggedIn /> : <HeaderItemsLoggedOut />

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
    paddingRight: theme.sizing.scale800,
    flexShrink: "0"
  })

  return (
    <header className={appHeader}>
      <div className={css(appHeaderLogo)}>
        <StyledLink href="/" onClick={handleNav}>
          Base Web App
        </StyledLink>
      </div>
      {!props.staticEmpty ? headerContent : null}
    </header>
  )
}

export default Header
