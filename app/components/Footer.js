import React from "react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Link } from "react-router-dom"

function Footer() {
  const [css, theme] = useStyletron()

  const appFooter = css({
    ...theme.typography.ParagraphMedium,
    width: "100%",
    position: "sticky",
    bottom: "0",
    marginTop: theme.sizing.scale1400,
    paddingTop: theme.sizing.scale500,
    paddingBottom: theme.sizing.scale500,
    textAlign: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.contentPrimary,
    flexShrink: "0",
    [theme.mediaQuery.medium]: {
      paddingTop: theme.sizing.scale1600,
      paddingBottom: theme.sizing.scale1600
    }
  })

  const footerLink = css({
    textDecoration: "none",
    cursor: "pointer",
    display: "inline-block",
    marginLeft: theme.sizing.scale900,
    color: theme.colors.contentPrimary,
    ":first-child": {
      marginLeft: "0"
    }
  })

  const footerLogo = css({
    textDecoration: "none",
    cursor: "pointer",
    ...theme.typography.LabelLarge,
    color: theme.colors.contentPrimary
  })

  return (
    <footer className={appFooter}>
      <Block className={css({ paddingBottom: theme.sizing.scale1000 })}>
        <Link className={footerLink} to="/about-us">
          About Us
        </Link>
        <Link className={footerLink} to="/privacy-policy">
          Privacy and Policy
        </Link>
      </Block>
      <Link className={footerLogo} to="/">
        Base Web App
      </Link>
    </footer>
  )
}

export default Footer
