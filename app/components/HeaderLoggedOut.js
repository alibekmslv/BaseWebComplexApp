import React, { useEffect, useContext, useState } from "react"
import { Input } from "baseui/input"
import { Button } from "baseui/button"
import { StyledNavigationItem } from "baseui/header-navigation"
import Axios from "axios"

import DispatchContext from "../DispatchContext"

function HeaderLoggedOut() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const appDispatch = useContext(DispatchContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password })
      if (response.data) {
        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: "You have succefully logged in." })
      } else {
        console.log("Incorrect username/passworf")
        appDispatch({ type: "flashMessage", value: "Invalid username/password" })
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }

  return (
    <>
      <StyledNavigationItem>
        <Input onChange={e => setUsername(e.target.value)} placeholder="Username" type="username" />
      </StyledNavigationItem>
      <StyledNavigationItem>
        <Input onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      </StyledNavigationItem>
      <StyledNavigationItem>
        <Button onClick={handleSubmit}>Sign In</Button>
      </StyledNavigationItem>
    </>
  )
}

export default HeaderLoggedOut
