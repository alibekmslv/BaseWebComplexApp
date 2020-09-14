import React, { useContext, useEffect, useRef } from 'react'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { Card, StyledBody, StyledAction } from 'baseui/card'
import { FormControl } from 'baseui/form-control'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import { toaster } from 'baseui/toast'

import DispatchContext from '../DispatchContext'

function SignInForm() {
    const initialState = {
        username: {
            value: '',
            hasErrors: false,
            message: ''
        },
        password: {
            value: '',
            hasErrors: false,
            message: ''
        },
        submitCount: 0
    }

    function ourReducer(draft, action) {
        switch (action.type) {
        case 'usernameImmidiately':
            draft.username.hasErrors = false
            draft.username.value = action.value
            if (!draft.username.value) {
                draft.username.hasErrors = true
                draft.username.message = 'You must provide username'
            }
            break
        case 'passwordImmidiately':
            draft.password.hasErrors = false
            draft.password.value = action.value
            if (!draft.password.value) {
                draft.password.hasErrors = true
                draft.password.message = 'You must provide password'
            }
            break
        case 'invalidUsernamePassword':
            draft.username.value = ''
            draft.username.hasErrors = true
            draft.username.message = draft.password.message = 'Invalid value, please check again'
            draft.password.value = ''
            draft.password.hasErrors = true
            break
        case 'submitForm':
            if (!draft.username.hasErrors && !draft.password.hasErrors) {
                draft.submitCount++
            }
            return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)
    const history = useHistory()
    const [css] = useStyletron()
    const appDispatch = useContext(DispatchContext)
    const usernameField = useRef(null)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResults() {
            try {
                const response = await Axios.post('/login', { username: state.username.value, password: state.password.value })
                if (response.data) {
                    appDispatch({ type: 'login', data: response.data })
                    toaster.positive('You have succefully logged in.')
                } else {
                    usernameField.current.focus()
                    dispatch({ type: 'invalidUsernamePassword' })
                    toaster.negative('Invalid Username/Password')
                }
            } catch (e) {
                toaster.warning('Something went wrong')
            }
        }
        
        if (state.submitCount) {
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [state.submitCount])

    async function handleSubmit(e) {
        e.preventDefault()
        dispatch({ type: 'usernameImmidiately', value: state.username.value })
        dispatch({ type: 'passwordImmidiately', value: state.password.value })
        dispatch({ type: 'submitForm' })
    }

    function handleNavigation(e) {
        e.preventDefault()
        history.push(e.target.pathname)
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <StyledBody>
                    <FormControl label="Username" error={state.username.hasErrors ? state.username.message : null}>
                        <Input
                            onChange={e => {
                                dispatch({ type: 'usernameImmidiately', value: e.target.value })
                            }}
                            value={state.username.value}
                            name="username"
                            required
                            error={state.username.hasErrors}
                            inputRef={usernameField}
                        />
                    </FormControl>
                    <FormControl label="Password" error={state.password.hasErrors ? state.password.message : null}>
                        <Input
                            onChange={e => {
                                dispatch({ type: 'passwordImmidiately', value: e.target.value })
                            }}
                            value={state.password.value}
                            type="password"
                            name="password"
                            required
                            error={state.password.hasErrors}
                        />
                    </FormControl>
                </StyledBody>
                <StyledAction>
                    <Button onClick={handleSubmit} type="submit" overrides={{ BaseButton: { style: { width: '100%' } } }}>
                        Sign In
                    </Button>
                    <Block className={css({ textAlign: 'center' })} marginTop={['scale300']}>
                        or
                        <br />
                        <StyledLink href="/login" onClick={handleNavigation}>
                            Sign Up
                        </StyledLink>
                    </Block>
                </StyledAction>
            </form>
        </Card>
    )
}

export default SignInForm
