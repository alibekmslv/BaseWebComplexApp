import React from "react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"

function OverallPageContainer({ children }) {
  const [css, theme] = useStyletron()

  const appStyle = css({
    overflow: "hidden",
    minHeight: "100vh",
    maxWidth: "100vw",
    backgroundColor: theme.colors.primaryB,
    color: theme.colors.primaryA,
    display: "flex",
    flexDirection: "column"
  })

  return <Block className={appStyle}>{children}</Block>
}

export default OverallPageContainer
