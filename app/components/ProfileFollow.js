import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingCircleIcon from "./LoadingCircleIcon"
import { Button } from "baseui/button"
import { Paragraph1 } from "baseui/typography"

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useStyletron } from "baseui"

function ProfileFollow(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [follow, setFollow] = useState([])
  const [css, theme] = useStyletron()

  const ourRequest = Axios.CancelToken.source()

  useEffect(() => {
    async function fetchFollow() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, { cancelToken: ourRequest.token })
        setIsLoading(false)
        setFollow(response.data)
      } catch (e) {
        console.log("There was a problem or request has been canceled")
      }
    }
    fetchFollow()

    return () => {
      ourRequest.cancel()
    }
  }, [username, props.action])

  if (isLoading) return <LoadingCircleIcon />

  const avatarStyle = css({ width: theme.sizing.scale900, verticalAlign: "middle", marginRight: "10px", borderRadius: "50%", position: "relative", top: "-1px" })
  const postListItem = css({
    display: "block",
    maxWidth: "400px",
    padding: theme.sizing.scale300,
    marginBottom: theme.sizing.scale600,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.colors.borderOpaque,
    ...theme.typography.ParagraphSmall,
    color: theme.colors.primaryA,
    textDecoration: "none",
    ":last-child": {
      marginBottom: "0"
    }
  })
  const textCentered = css({
    textAlign: "center"
  })
  return (
    <>
      {follow.length == 0 && props.action == "followers" && appState.loggedIn && appState.user.username == username && (
        <Paragraph1 className={textCentered}>
          You have no followers. Start writing interesting stories and following other people to make them follow you back.
          <br />
          <Link to="/create-post">Create Post</Link>
        </Paragraph1>
      )}
      {follow.length == 0 && props.action == "followers" && appState.loggedIn && appState.user.username != username && (
        <Paragraph1 className={textCentered}>
          {username} have no followers. Be {username}'s first follower
        </Paragraph1>
      )}
      {follow.length == 0 && props.action == "following" && appState.loggedIn && appState.user.username == username && (
        <Paragraph1 className={textCentered}>
          You following nobody. Search interesting posts and start follow their author
          <br />
          <Button
            kind={"secondary"}
            size="mini"
            onClick={() => {
              appDispatch({ type: "openSearch" })
            }}
            className={css({ marginTop: theme.sizing.scale500 })}
          >
            Search
          </Button>
        </Paragraph1>
      )}
      {follow.length == 0 && props.action == "following" && appState.loggedIn && appState.user.username != username && <p className="text-center">{username} follows nobody :(</p>}
      {follow.length > 0 && (
        <div>
          {follow.map((follow, index) => {
            return (
              <Link key={index} to={`/profile/${follow.username}`} className={postListItem}>
                <img src={follow.avatar} className={avatarStyle} /> {follow.username}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

export default ProfileFollow
