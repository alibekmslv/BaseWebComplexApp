import React, { useEffect, useContext } from 'react'
import Page from './Page'
import Post from './Post'
import { useImmer } from 'use-immer'
import StateContext from '../StateContext'
import Axios from 'axios'
import { H2 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { useStyletron } from 'baseui'
import LoadingCircleIcon from './LoadingCircleIcon'

function Home() {
    const appState = useContext(StateContext)
    const [css] = useStyletron()
    const [state, setState] = useImmer({
        isLoading: true,
        feed: []
    })

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchPosts() {
            try {
                const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                    draft.isLoading = false
                    draft.feed = response.data
                })
            } catch (e) {
                console.log('There was a problem or reques has been canceled')
            }
        }
        fetchPosts()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (state.isLoading) {
        return <LoadingCircleIcon />
    }

    const contentContainerStyle = css({
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        flexWrap: 'wrap'
    })

    return (
        <Page title="You Feed">
            {state.feed.length > 0 && (
                <>
                    <H2 className={css({ textAlign: 'center' })}>The Latest From Those You Follow</H2>
                    <Block className={contentContainerStyle}>
                        {state.feed.map(post => {
                            return <Post key={post._id} post={post} />
                        })}
                    </Block>
                </>
            )}
        </Page>
    )
}

export default Home
