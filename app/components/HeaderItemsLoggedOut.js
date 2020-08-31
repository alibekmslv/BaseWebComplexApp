import React, { useEffect, useContext } from "react"
import { Button } from "baseui/button"
import { useStyletron } from "baseui"
import { headerMenu } from "./Style"
import DispatchContext from "../DispatchContext"

function HeaderItemsLoggedOut() {
  const [css, theme] = useStyletron()
  const appDispatch = useContext(DispatchContext)

  return (
    <div className={css(headerMenu)}>
      <Button
        onClick={() => {
          appDispatch({ type: "handleTheme" })
        }}
      >
        Switch
      </Button>
    </div>
  )
}

export default HeaderItemsLoggedOut
