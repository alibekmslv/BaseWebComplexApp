import React, { useEffect, useState } from "react"
import Axios from "axios"
import { Block } from "baseui/block"
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid"
import { FormControl } from "baseui/form-control"
import { Input } from "baseui/input"
import { Textarea } from "baseui/textarea"
import { Button } from "baseui/button"

function CreatePost() {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  function handleSubmit(e) {
    e.preventDefault()
    console.log("form sent")
  }

  return (
    <Grid>
      <Cell skip={[0, 2, 4]} span={[4]}>
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
  )
}

export default CreatePost
