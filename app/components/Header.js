import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useStyletron } from 'baseui'
import { StyledLink } from 'baseui/link'
import { Skeleton } from 'baseui/skeleton'

import { appHeaderLogo } from './Style'
import StateContext from '../StateContext'
import HeaderLoggedIn from './HeaderLoggedIn'
import HeaderLoggedOut from './HeaderLoggedOut'

function Header(props) {
    const appState = useContext(StateContext)
    const [css, theme] = useStyletron()
    const history = useHistory()

    const handleNav = e => {
        e.preventDefault()
        history.push(e.target.pathname)
    }

    const appHeader = css({
        display: 'flex',
        flexWrap: 'wrap',
        ...theme.typography.ParagraphMedium,
        borderBottomColor: theme.colors.contentInverseSecondary,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        paddingTop: theme.sizing.scale500,
        paddingBottom: theme.sizing.scale500,
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        flexShrink: '0'
    })

    const loggedOutContainerStyle = css({
        display: 'flex',
        alignItems: 'flex-start',
        order: 2,
        postion: 'relative',
        zIndex: '100'
    })

    const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut className={loggedOutContainerStyle} />

    return (
        <header className={appHeader}>
            <div className={css(appHeaderLogo)}>
                <StyledLink href="/" onClick={handleNav}>
          Base Web App
                </StyledLink>
            </div>
            {!props.staticEmpty ? headerContent : <HeaderLoggedInSkeleton className={loggedOutContainerStyle} />}
        </header>
    )
}

function HeaderLoggedInSkeleton(props) {
    return (
        <div className={props.className}>
            <Skeleton height="50px" width="100px" />
        </div>
    )
}

export default Header
