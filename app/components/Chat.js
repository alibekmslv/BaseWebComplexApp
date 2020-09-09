import React, { useEffect, useContext, useRef } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import io from "socket.io-client"
import { Link } from "react-router-dom"
import { Block } from "baseui/block"
import { useStyletron } from "baseui"
import { ChevronDown } from "baseui/icon"
import { Input } from "baseui/input"

function Chat() {
  const socket = useRef(null)
  const chatLog = useRef(null)
  const chatField = useRef(null)
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [css, theme] = useStyletron()
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  })

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
      appDispatch({ type: "clearUnreadChatCount" })
    }
  }, [appState.isChatOpen])

  useEffect(() => {
    socket.current = io("http://localhost:8080")

    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })

    return () => {
      appDispatch({ type: "toggleChat" })
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" })
    }
  }, [state.chatMessages])

  function handleFieldChange(e) {
    const value = e.target.value
    setState(draft => {
      draft.fieldValue = value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (state.fieldValue) {
      // Send message to chat server
      socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })
      setState(draft => {
        // Add message to state collection of messages
        draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
        draft.fieldValue = ""
      })
    }
  }

  const chatContainer = css({
    display: appState.isChatOpen ? "flex" : "none",
    flexDirection: "column",
    width: "290px",
    height: "350px",
    position: "fixed",
    bottom: "0",
    right: "20px",
    zIndex: "5",
    backgroundColor: theme.colors.backgroundSecondary,
    ...theme.typography.ParagraphXSmall,
    ...theme.borders.border500
  })
  const chatTitleBar = css({
    backgroundColor: theme.colors.accent400,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: theme.sizing.scale400
  })
  const chatLogStyle = css({
    flex: "1",
    padding: theme.sizing.scale400,
    overflow: "auto"
  })

  const chatSelf = css({
    ...theme.typography.ParagraphXSmall,
    display: "flex",
    alignItems: "center",
    marginBottom: theme.sizing.scale300,
    paddingLeft: "25%"
  })

  const chatOther = css({
    ...theme.typography.ParagraphXSmall,
    display: "flex",
    alignItems: "center",
    marginBottom: theme.sizing.scale300,
    paddingRight: "25%"
  })

  const chatMessage = css({
    flex: "1",
    display: "flex",
    justifyContent: "flex-end"
  })

  const chatMessageOther = css({
    flex: "1",
    display: "flex",
    justifyContent: "flex-start"
  })

  const chatInner = css({
    paddingTop: theme.sizing.scale100,
    paddingBottom: theme.sizing.scale100,
    paddingLeft: theme.sizing.scale200,
    paddingRight: theme.sizing.scale200,
    borderRadius: theme.borders.radius400,
    textAlign: "right",
    backgroundColor: theme.colors.accent
  })

  const chatInnerOther = css({
    paddingTop: theme.sizing.scale100,
    paddingBottom: theme.sizing.scale100,
    paddingLeft: theme.sizing.scale200,
    paddingRight: theme.sizing.scale200,
    borderRadius: theme.borders.radius400,
    textAlign: "left",
    backgroundColor: theme.colors.primary600 //
  })

  const chatAvatar = css({
    width: theme.sizing.scale800,
    height: theme.sizing.scale800,
    borderRadius: "50%",
    marginLeft: theme.sizing.scale200
  })
  const chatAvatarOther = css({
    width: theme.sizing.scale800,
    height: theme.sizing.scale800,
    borderRadius: "50%",
    marginRight: theme.sizing.scale200
  })

  return (
    <Block className={chatContainer}>
      <div className={chatTitleBar}>
        Chat <ChevronDown className={css({ cursor: "pointer" })} onClick={() => appDispatch({ type: "toggleChat" })} size={20} />
      </div>
      <div className={chatLogStyle} ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className={chatSelf}>
                <div className={chatMessage}>
                  <div className={chatInner}>{message.message}</div>
                  <img src={appState.user.avatar} className={chatAvatar} />
                </div>
              </div>
            )
          }
          return (
            <div key={index} className={chatOther}>
              <Link to={`/profile/${message.username}`}>
                <img src={message.avatar} className={chatAvatarOther} />
              </Link>
              <div className={chatMessageOther}>
                <div className={chatInnerOther}>{message.message}</div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          inputRef={chatField}
          onChange={handleFieldChange}
          value={state.fieldValue}
          placeholder="Type a message..."
          overrides={{
            Input: {
              style: ({ $theme }) => {
                return {
                  ...$theme.typography.ParagraphXSmall
                }
              }
            }
          }}
        />
      </form>
    </Block>
  )
}

export default Chat
