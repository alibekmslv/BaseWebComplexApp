import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import LoadingCircleIcon from "./LoadingCircleIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"
import { withRouter } from "react-router-dom"
import { Block } from "baseui/block"
import { Grid, Cell } from "baseui/layout-grid"
import { FormControl } from "baseui/form-control"
import { Input } from "baseui/input"
import { Textarea } from "baseui/textarea"
import { Button } from "baseui/button"
import { toaster } from "baseui/toast"

function EditPost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "You must provide a title"
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "You must provide a body content"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            toaster.negative("You do not have permission to edit this post.")
            // redirect to homepage
            props.history.push("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or request has been canceled")
      }
    }
    fetchPost()

    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          toaster.positive("Post was succefully updated.")
        } catch (e) {
          console.log("There was a problem or request has been canceled")
        }
      }
      fetchPost()

      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "submitRequest" })
  }

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingCircleIcon />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`}>&laquo; Back to post permalink</Link>
      <Grid>
        <Cell skip={[0, 1, 2]} span={[4, 6, 8]}>
          <Block marginTop={["scale600", "scale600", "scale900"]}>
            <form onSubmit={submitHandler}>
              <FormControl label="Post Title" caption={state.title.hasErrors && state.title.message}>
                <Input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} value={state.title.value} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} id="post-title" type="text" />
              </FormControl>
              <FormControl label="Body Content" label={state.body.hasErrors && state.body.message}>
                <Textarea id="post-body" onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} value={state.body.value} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} />
              </FormControl>
              <Button onClick={submitHandler} disabled={state.isSaving}>
                Save Updates
              </Button>
            </form>
          </Block>
        </Cell>
      </Grid>
    </Page>
  )
}

export default withRouter(EditPost)
