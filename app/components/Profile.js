import React, { useEffect, useContext } from 'react'
import Page from './Page'
import { useParams, NavLink, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
import StateContext from '../StateContext'
import ProfilePosts from './ProfilePosts'
import { useImmer } from 'use-immer'
import ProfileFollow from './ProfileFollow'
import { H2 } from 'baseui/typography'
import { Button } from 'baseui/button'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import NotFound from './NotFound'

function FollowUnfollowButton(props) {
    const [css, theme] = useStyletron()
    const color = props.color === 'negative' ? theme.colors.backgroundNegative : theme.colors.backgroundPositive
    return (
        <Button
            onClick={props.onClick}
            disabled={props.disabled}
            size="mini"
            kind="tertiary"
            className={css({
                backgroundColor: color
            })}
        >
            {props.children}
        </Button>
    )
}

function Profile() {
    const [css, theme] = useStyletron()

    const { username } = useParams()
    const appState = useContext(StateContext)
    const [state, setState] = useImmer({
        isLoading: true,
        followActionLoading: false,
        startFollowingRequesCount: 0,
        stopFollowingRequestCount: 0,
        profileData: {
            profileUsername: '...',
            profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
            isFollowing: false,
            counts: { postCount: '', followerCount: '', followingCount: '' }
        }
    })

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                    draft.profileData = response.data
                    draft.isLoading = false
                })
            } catch (e) {
                console.log('There was a problem or request has been canceled')
            }
        }
        fetchData()

        return () => {
            ourRequest.cancel()
        }
    }, [username])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchData() {
            try {
                await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                    draft.profileData.isFollowing = true
                    draft.profileData.counts.followerCount++
                    draft.followActionLoading = false
                })
            } catch (e) {
                console.log('There was a problem or request has been canceled')
            }
        }

        if (state.startFollowingRequesCount) {
            setState(draft => {
                draft.followActionLoading = true
            })

            fetchData()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.startFollowingRequesCount])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchData() {
            try {
                await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                    draft.profileData.isFollowing = false
                    draft.profileData.counts.followerCount--
                    draft.followActionLoading = false
                })
            } catch (e) {
                console.log('There was a problem or request has been canceled')
            }
        }

        if (state.stopFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true
            })

            fetchData()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.stopFollowingRequestCount])

    function startFollowing() {
        setState(draft => {
            draft.startFollowingRequesCount++
        })
    }

    function stopFollowing() {
        setState(draft => {
            draft.stopFollowingRequestCount++
        })
    }

    const blockStyle = css({
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'center',
        marginTop: '36px'
    })
    const activeLinkStyle = css({
        borderTopColor: theme.colors.primary + '!important',
        borderLeftColor: theme.colors.primary + '!important',
        borderRightColor: theme.colors.primary + '!important'
    })
    const linkStyle = css({
        display: 'inline-block',
        color: theme.colors.primary,
        paddingTop: theme.sizing.scale400,
        paddingBottom: theme.sizing.scale400,
        paddingRight: theme.sizing.scale500,
        paddingLeft: theme.sizing.scale500,
        textDecoration: 'none',
        borderWidth: theme.sizing.scale0,
        borderStyle: 'solid',
        borderColor: 'transparent'
    })

    if (!state.profileData && !state.isLoading) {
        return <NotFound />
    }

    return (
        <Page title={`${username}'s Profile`}>
            <div className={css({ display: 'flex', alignItems: 'center', flexDirection: 'column' })}>
                <img src={state.profileData.profileAvatar} className={css({ width: theme.sizing.scale1200, borderRadius: '50%' })} />
                <H2 className={css({ marginBottom: theme.sizing.scale500, marginTop: theme.sizing.scale500 })}>{state.profileData.profileUsername}</H2>
                {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
                    <FollowUnfollowButton onClick={startFollowing} disabled={state.followActionLoading} color="positive">
            Follow
                    </FollowUnfollowButton>
                )}
                {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
                    <FollowUnfollowButton onClick={stopFollowing} disabled={state.followActionLoading} color="negative">
            Stop Following
                    </FollowUnfollowButton>
                )}
            </div>
            <div className={css({ ...theme.typography.ParagraphMedium, textAlign: 'center', marginTop: theme.sizing.scale1200 })}>
                <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className={linkStyle} activeClassName={activeLinkStyle}>
          Posts: {state.profileData.counts.postCount}
                </NavLink>
                <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className={linkStyle} activeClassName={activeLinkStyle}>
          Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className={linkStyle} activeClassName={activeLinkStyle}>
          Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>

            <Switch>
                <Route exact path="/profile/:username">
                    <Block className={blockStyle}>
                        <ProfilePosts />
                    </Block>
                </Route>
                <Route path="/profile/:username/followers">
                    <Block className={blockStyle}>
                        <ProfileFollow action="followers" />
                    </Block>
                </Route>
                <Route path="/profile/:username/following">
                    <Block className={blockStyle}>
                        <ProfileFollow action="following" />
                    </Block>
                </Route>
            </Switch>
        </Page>
    )
}

export default Profile
