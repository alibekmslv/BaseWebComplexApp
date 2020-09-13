import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingCircleIcon from './LoadingCircleIcon'
import StateContext from '../StateContext'
import Post from './Post'
import { Paragraph1 } from 'baseui/typography'
import { useStyletron } from 'baseui'

function ProfilePosts() {
    const appState = useContext(StateContext)

    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    const [css, theme] = useStyletron()

    const ourRequest = Axios.CancelToken.source()

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
                setIsLoading(false)
                setPosts(response.data)
            } catch (e) {
                console.log('There was a problem or request has been canceled')
            }
        }
        fetchPosts()

        return () => {
            ourRequest.cancel()
        }
    }, [username])

    if (isLoading) return <LoadingCircleIcon />

    return (
        <>
            {posts.length == 0 && appState.loggedIn && appState.user.username == username && (
                <>
                    <Paragraph1>You have not created posts yet.</Paragraph1>
                    <Paragraph1>
                        Tell what is going on right now{' '}
                        <Link to="/create-post" className={css({ color: theme.colors.primaryA })}>
                            Create Post
                        </Link>
                    </Paragraph1>
                </>
            )}
            {posts.length == 0 && appState.loggedIn && appState.user.username != username && <Paragraph1>{username} have not created posts yet</Paragraph1>}
            {posts.length > 0 && (
                <div>
                    {posts.map(post => {
                        return <Post post={post} key={post._id} noAuthor={true} />
                    })}
                </div>
            )}
        </>
    )
}

export default ProfilePosts
