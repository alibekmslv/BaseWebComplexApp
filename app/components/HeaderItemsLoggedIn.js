import React, { useEffect, useContext, useState, useRef } from "react"
import { Input } from "baseui/input"
import { Avatar } from "baseui/avatar"
import { Search, Menu, Overflow } from "baseui/icon"
import { Button, KIND, SIZE } from "baseui/button"
import { useStyletron } from "baseui"
import { headerMenu, inline } from "./Style"

import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { useHistory, Link } from "react-router-dom"

function HeaderItemsLoggedIn() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [css, theme] = useStyletron()
  const history = useHistory()
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const wrapperRef = useRef(null)
  const menuToggleRef = useRef(null)

  const headerSearchStyle = css({
    flexBasis: "100%",
    marginTop: theme.sizing.scale400,
    order: 3,
    [theme.mediaQuery.medium]: {
      order: 2,
      flexBasis: "auto",
      marginRight: theme.sizing.scale400,
      marginTop: 0
    }
  })
  const headerMenuNavList = isMenuOpened
    ? css({
        display: "block",
        position: "absolute",
        top: "130px",
        right: theme.sizing.scale800,
        backgroundColor: theme.colors.primaryB,
        paddingTop: theme.sizing.scale500,
        paddingRight: theme.sizing.scale500,
        paddingBottom: theme.sizing.scale500,
        paddingLeft: theme.sizing.scale500,
        ...theme.borders.border600,
        textAlign: "right",
        [theme.mediaQuery.medium]: {
          top: "72px"
        }
      })
    : css({
        display: "none",
        [theme.mediaQuery.large]: {
          display: "block"
        }
      })

  const headerMenuLink = isMenuOpened
    ? css({
        display: "block",
        paddingBottom: theme.sizing.scale400
      })
    : css({
        display: "inline",
        verticalAlign: "top",
        [theme.mediaQuery.medium]: {
          marginRight: theme.sizing.scale400
        }
      })

  const headerMenuToggler = css({
    [theme.mediaQuery.large]: {
      display: "none"
    }
  })

  const handleNav = e => {
    e.preventDefault()
    history.push(e.target.pathname)
    setIsMenuOpened(false)
  }

  const toggleMenuHandler = e => {
    setIsMenuOpened(!isMenuOpened)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuToggleRef.current.contains(event.target)) return
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && isMenuOpened) {
        setIsMenuOpened(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpened])

  return (
    <>
      <div className={headerSearchStyle}>
        <Input startEnhancer={() => <Search />} placeholder="Search" />
      </div>
      <div className={css(headerMenu)}>
        <Button
          title="Chat"
          kind={"secondary"}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                marginRight: $theme.sizing.scale400
              })
            }
          }}
        >
          <Overflow size={20} />
        </Button>
        <nav className={headerMenuNavList} ref={wrapperRef}>
          <ul>
            <li className={headerMenuLink}>
              <Button $as={"a"} href="/create-post" onClick={handleNav} kind={"secondary"}>
                Create Post
              </Button>
            </li>
            <li className={headerMenuLink}>
              <Link to={`/profile/${appState.user.username}`} onClick={() => setIsMenuOpened(false)}>
                <img src={appState.user.avatar} alt={appState.user.username} className={css({ width: theme.sizing.scale1200 })} />
              </Link>
            </li>
            <li className={css(inline)}>
              <Button
                title="Logout"
                onClick={() => {
                  appDispatch({ type: "logout" })
                }}
              >
                Logout
              </Button>
            </li>
          </ul>
        </nav>

        <Button kind={KIND.secondary} className={headerMenuToggler} ref={menuToggleRef}>
          <Menu size={20} onClick={toggleMenuHandler} />
        </Button>
      </div>
    </>
  )
}

export default HeaderItemsLoggedIn
