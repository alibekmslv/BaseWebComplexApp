import React, { useEffect, useContext, useState } from "react"
import { Button, KIND } from "baseui/button"
import { ALIGN, StyledNavigationItem, StyledNavigationList } from "baseui/header-navigation"

import DispatchContext from "../DispatchContext"

function HeaderLoggedOut() {
  const appDispatch = useContext(DispatchContext)

  return (
    <StyledNavigationList $align={ALIGN.right}>
      <StyledNavigationItem>
        <Button
          kind={KIND.tertiary}
          onClick={() => {
            appDispatch({ type: "handleTheme" })
          }}
        >
          Switch to Dark
        </Button>
      </StyledNavigationItem>
    </StyledNavigationList>
  )
}

export default HeaderLoggedOut
