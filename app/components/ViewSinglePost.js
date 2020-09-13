import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { H1, Paragraph3 } from 'baseui/typography'
import { Button } from 'baseui/button'
import Delete from 'baseui/icon/delete'
import { useStyletron } from 'baseui'

import StateContext from '../StateContext'
import Page from './Page'
import NotFound from './NotFound'
import LoadingCircleIcon from './LoadingCircleIcon'

function ViewSinglePost(props) {
    const appState = useContext(StateContext)
    const [post, setPost] = useState()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [css, theme] = useStyletron()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log('There was a problem or request has been canceled')
            }
        }
        fetchPost()

        return () => {
            ourRequest.cancel()
        }
    }, [id])

    if (!isLoading && !post) {
        return <NotFound />
    }

    if (isLoading) return <LoadingCircleIcon />

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    function isOwner() {
        if (appState.loggedIn) {
            return appState.user.username == post.author.username
        }
        return false
    }

    async function deleteHandler() {
        const areYouSure = window.confirm('Do you really want to delete this post?')
        if (areYouSure) {
            try {
                // const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
                const response = await Axios({
                    method: 'delete',
                    url: `/post/${id}`,
                    data: {
                        token: appState.user.token
                    }
                })
                if (response.data == 'Success') {
                    // 1. display a flash message
                    // appDispatch({ type: "flashMessage", value: "Post was succefully deleted" })

                    // 2. redirect to home page
                    props.history.push(`/profile/${appState.user.username}`)
                }
            } catch (e) {
                console.log('There was a problem')
                console.log(e.response)
            }
        }
    }

    const avatarStyle = css({ width: theme.sizing.scale900, verticalAlign: 'middle', marginRight: '10px', borderRadius: '50%', position: 'relative', top: '-1px' })
    const postContainerStyle = css({
        paddingRight: theme.sizing.scale800,
        paddingLeft: theme.sizing.scale800,
        maxWidth: '800px',
        margin: '0 auto'
    })
    const markDownStyle = css({
        ...theme.typography.ParagraphLarge
    })
    const linkStyle = css({
        color: theme.colors.primaryA,
        ...theme.typography.ParagraphMedium
    })
    const editDeletePanelStyle = css({
        display: 'block',
        [theme.mediaQuery.medium]: {
            position: 'absolute',
            top: theme.sizing.scale0,
            right: '0'
        }
    })

    return (
        <Page title="Single Post">
            <H1 className={css({ textAlign: 'center' })}>{post.title}</H1>

            <div className={postContainerStyle}>
                <Paragraph3 className={css({ textAlign: 'center', position: 'relative' })}>
                    <Link to={`/profile/${post.author.username}`}>
                        <img src={post.author.avatar} className={avatarStyle} />
                    </Link>
          Posted by{' '}
                    <Link to={`/profile/${post.author.username}`} className={linkStyle}>
                        {post.author.username}
                    </Link>{' '}
          on {dateFormatted}
                    {isOwner() && (
                        <span className={editDeletePanelStyle}>
                            <Link to={`/post/${id}/edit`} className={linkStyle}>
                Edit
                            </Link>
                            <Button onClick={deleteHandler} size="mini" kind={'tertiary'} className={css({ marginLeft: theme.sizing.scale400, backgroundColor: theme.colors.backgroundNegative })}>
                Delete <Delete size={16} />
                            </Button>
                        </span>
                    )}
                </Paragraph3>

                <div className={markDownStyle}>
                    <ReactMarkdown source={post.body} allowedTypes={['paragraph', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem']} />
                </div>
            </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost)
