import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { Block } from "baseui/block"
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid"
import { FormControl } from "baseui/form-control"
import { Input } from "baseui/input"
import { Textarea } from "baseui/textarea"
import { Button } from "baseui/button"

import { withRouter } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

import Page from "./Page"

function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(title, body)
    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token })
      //Redirect to new post url
      props.history.push(`/post/${response.data}`)
      // appDispatch({ type: "flashMessage", value: "Congrats, you succefully created a post." })
      console.log("Post has been succefully created")
    } catch (e) {
      console.log("Some error happened")
    }
  }

  return (
    <Page title="Create Post">
      <Grid>
        <Cell skip={[0, 1, 2]} span={[4, 6, 8]}>
          <Block marginTop={["scale600", "scale600", "scale900"]}>
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
