import React, { useEffect, useContext, useState, useRef, Suspense } from 'react'
import { Menu } from 'baseui/icon'
import { Button, KIND } from 'baseui/button'
import { useStyletron } from 'baseui'
import { headerMenu, inline } from './Style'

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'
import { useHistory, Link } from 'react-router-dom'
import { toaster } from 'baseui/toast'
const Search = React.lazy(() => import('./Search'))

function HeaderLoggedIn() {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const [css, theme] = useStyletron()
    const history = useHistory()
    const [isMenuOpened, setIsMenuOpened] = useState(false)
    const wrapperRef = useRef(null)
    const menuToggleRef = useRef(null)

    const headerSearchStyle = css({
        position: 'relative',
        flexBasis: '100%',
        marginTop: theme.sizing.scale400,
        order: 3,
        [theme.mediaQuery.medium]: {
            order: 2,
            flexBasis: 'auto',
            marginRight: theme.sizing.scale400,
            marginTop: 0
        }
    })
    const headerMenuNavList = isMenuOpened
        ? css({
            display: 'block',
            position: 'absolute',
            top: '130px',
            right: theme.sizing.scale800,
            backgroundColor: theme.colors.primaryB,
            paddingTop: theme.sizing.scale500,
            paddingRight: theme.sizing.scale500,
            paddingBottom: theme.sizing.scale500,
            paddingLeft: theme.sizing.scale500,
            ...theme.borders.border600,
            textAlign: 'right',
            [theme.mediaQuery.medium]: {
                top: '72px'
            }
        })
        : css({
            display: 'none',
            [theme.mediaQuery.large]: {
                display: 'block'
            }
        })

    const headerMenuLink = isMenuOpened
        ? css({
            display: 'block',
            paddingBottom: theme.sizing.scale400
        })
        : css({
            display: 'inline',
            verticalAlign: 'top',
            [theme.mediaQuery.medium]: {
                marginRight: theme.sizing.scale400
            }
        })

    const headerMenuToggler = css({
        [theme.mediaQuery.large]: {
            display: 'none'
        }
    })

    const chatUnreadLabel = css({
        position: 'absolute',
        top: '10px',
        right: '6px',
        backgroundColor: theme.colors.backgroundAccent,
        width: '11px',
        height: '11px',
        borderRadius: '50%'
    })

    const handleNav = e => {
        e.preventDefault()
        history.push(e.target.pathname)
        setIsMenuOpened(false)
    }

    const toggleMenuHandler = () => {
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
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpened])

    return (
        <>
            <div className={headerSearchStyle}>
                <Suspense fallback={''}>
                    <Search />
                </Suspense>
            </div>
            <div className={css(headerMenu)}>
                <Button
                    title="Chat"
                    kind="minimal"
                    overrides={{
                        BaseButton: {
                            style: ({ $theme }) => ({
                                marginRight: $theme.sizing.scale400
                            })
                        }
                    }}
                    onClick={() => {
                        appDispatch({ type: 'toggleChat' })
                    }}
                    className={css({ position: 'relative' })}
                >
          💬
                    {appState.unreadChatCount ? <span className={chatUnreadLabel}></span> : null}
                </Button>
                <nav className={headerMenuNavList} ref={wrapperRef}>
                    <ul>
                        <li className={headerMenuLink}>
                            <Button $as={'a'} href="/create-post" onClick={handleNav} kind={'secondary'}>
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
                                    history.push('/')
                                    toaster.show('You have succefully logged out.')
                                    appDispatch({ type: 'logout' })
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

export default HeaderLoggedIn
