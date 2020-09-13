import React, { useState, useContext } from 'react'
import Axios from 'axios'
import { Block } from 'baseui/block'
import { Grid, Cell } from 'baseui/layout-grid'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { Button } from 'baseui/button'
import { ParagraphMedium } from 'baseui/typography'

import { withRouter } from 'react-router-dom'
import StateContext from '../StateContext'

import Page from './Page'
import SignInForm from './SignInForm'

function CreatePost(props) {
    const [title, setTitle] = useState()
    const [body, setBody] = useState()

    const appState = useContext(StateContext)

    if (!appState.loggedIn) {
        return (
            <Page title="Welcome">
                <Block paddingTop={['scale600', 'scale600', 'scale900']}>
                    <Grid>
                        <Cell skip={[0, 1, 2]} span={[4, 6, 8]}>
                            <ParagraphMedium>To create post you need to Sign In</ParagraphMedium>
                            <SignInForm />
                        </Cell>
                    </Grid>
                </Block>
            </Page>
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await Axios.post('/create-post', { title, body, token: appState.user.token })
            //Redirect to new post url
            props.history.push(`/post/${response.data}`)
            // appDispatch({ type: "flashMessage", value: "Congrats, you succefully created a post." })
            console.log('Post has been succefully created')
        } catch (e) {
            console.log('Some error happened')
        }
    }

    return (
        <Page title="Create Post">
            <Grid>
                <Cell skip={[0, 1, 2]} span={[4, 6, 8]}>
                    <Block marginTop={['scale600', 'scale600', 'scale900']}>
                        <form onSubmit={handleSubmit}>
                            <FormControl label="Post Title">
                                <Input
                                    id="post-title"
                                    type="text"
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                />
                            </FormControl>
                            <FormControl label="Body Content">
                                <Textarea
                                    id="post-body"
                                    onChange={e => {
                                        setBody(e.target.value)
                                    }}
                                    value={body}
                                />
                            </FormControl>
                            <Button onClick={handleSubmit}>Save New Post</Button>
                        </form>
                    </Block>
                </Cell>
            </Grid>
        </Page>
    )
}

export default withRouter(CreatePost)
