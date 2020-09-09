import React, { useState, useEffect, useContext, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useImmer } from "use-immer"
import Axios from "axios"

import { Input } from "baseui/input"
import { Block } from "baseui/block"
import { Search as SearchIcon } from "baseui/icon"
import { StyledSpinnerNext } from "baseui/spinner"
import { useStyletron } from "baseui"

import Post from "./Post"

function Search() {
  const [css, theme] = useStyletron()
  const searchRef = useRef(null)
  const location = useLocation()

  const initialState = {
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  }

  const [state, setState] = useImmer(initialState)

  useEffect(() => {
    setState(() => initialState)
  }, [location])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading"
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++
        })
      }, 750)

      return () => {
        clearInterval(delay)
      }
    } else {
      setState(draft => {
        draft.show = "neither"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    if (state.requestCount) {
      async function sendRequest() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.results = response.data
            draft.show = "results"
          })
        } catch (e) {
          console.log("There was a problem or request has been canceled")
        }
      }
      sendRequest()
    }
    return () => ourRequest.cancel()
  }, [state.requestCount])

  function handleInput(e) {
    const value = e.target.value
    setState(draft => {
      draft.searchTerm = value
    })
  }

  const searchResultsBlock = css({
    ...theme.borders.border400,
    borderRadius: theme.borders.radius200,
    position: "absolute",
    top: "60px",
    right: "0px",
    minWidth: "272px",
    padding: theme.sizing.scale500,
    zIndex: 100,
    backgroundColor: theme.colors.backgroundPrimary,
    display: state.show !== "neither" ? "block" : "none",
    [theme.mediaQuery.medium]: {
      minWidth: "380px",
      padding: theme.sizing.scale600
    }
  })
  const tooltipRhombus = css({
    position: "absolute",
    width: theme.sizing.scale550,
    height: theme.sizing.scale550,
    backgroundColor: theme.colors.backgroundPrimary,
    ...theme.borders.border400,
    right: 0,
    top: "-8px",
    transform: "rotate(-45deg)",
    borderBottom: "none",
    borderLeft: "none",
    right: theme.sizing.scale900
  })

  return (
    <>
      <Input id="live-search-field" value={state.searchTerm} onChange={handleInput} startEnhancer={() => <SearchIcon size={20} />} placeholder="Search" ref={searchRef} clearable clearOnEscape />
      <Block className={searchResultsBlock}>
        <div className={tooltipRhombus}></div>
        {state.show == "loading" ? <StyledSpinnerNext className={css({ margin: "0 auto" })} /> : null}
        {Boolean(state.results.length) && state.show !== "neither" && (
          <div>
            <span>Search results: {state.results.length}</span>
            <Block marginTop={["scale500"]}>
              {state.results.map(post => {
                return <Post post={post} key={post._id} />
              })}
            </Block>
          </div>
        )}
        {!Boolean(state.results.length) && state.show === "results" && <Block marginTop={["scale500"]}>Sorry, we could not find any results for that search</Block>}
      </Block>
    </>
  )
}

export default Search
