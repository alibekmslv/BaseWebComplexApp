import React from "react"
import { StyledSpinnerNext } from "baseui/spinner"
import { useStyletron } from "baseui"

function LoadingCircleIcon() {
  const [css, theme] = useStyletron()
  const spinnerStyle = css({
    display: "flex",
    justifyContent: "center",
    flexGrow: "1"
  })
  const spinnerInner = css({
    marginTop: theme.sizing.scale1200,
    marginRight: "auto",
    marginLeft: "auto"
  })

  return (
    <div className={spinnerStyle}>
      <StyledSpinnerNext className={spinnerInner} />
    </div>
  )
}

export default LoadingCircleIcon
