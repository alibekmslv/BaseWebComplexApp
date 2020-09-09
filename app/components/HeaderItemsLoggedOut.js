import React, { useEffect, useContext } from "react"
import { Button } from "baseui/button"
import { useStyletron } from "baseui"
import { headerMenu } from "./Style"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderItemsLoggedOut() {
  const [css, theme] = useStyletron()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <div className={css(headerMenu)}>
      <Button
        kind="minimal"
        onClick={() => {
          appDispatch({ type: "handleTheme" })
        }}
      >
        {appState.lightTheme ? "🌚" : "🌝"}
      </Button>
    </div>
  )
}

export default HeaderItemsLoggedOut
