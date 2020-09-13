import React, { useEffect, useContext } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import { useStyletron } from 'baseui'
import { Card, StyledBody } from 'baseui/card'
import { StyledLink } from 'baseui/link'
import { FormControl } from 'baseui/form-control'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import { Check, Alert } from 'baseui/icon'
import { toaster } from 'baseui/toast'

import DispatchContext from '../DispatchContext'

function SignUpForm() {
    const appDispatch = useContext(DispatchContext)
    const [css, theme] = useStyletron()
    const history = useHistory()

    const initialState = {
        username: {
            value: '',
            hasErrors: false,
            message: '',
            isUnique: false,
            checkCount: 0
        },
        email: {
            value: '',
            hasErrors: false,
            message: '',
            isUnique: false,
            checkCount: 0
        },
        password: {
            value: '',
            hasErrors: false,
            message: ''
        },
        submitCount: 0
    }
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    function ourReducer(draft, action) {
        const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        switch (action.type) {
        case 'usernameImmidiately':
            draft.username.hasErrors = false
            draft.username.value = action.value
            if (draft.username.value.length > 30) {
                draft.username.hasErrors = true
                draft.username.message = 'Username cannot exceed 30 characters'
            }
            if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
                draft.username.hasErrors = true
                draft.username.message = 'Username can only contain letters and numbers'
            }
            break
        case 'usernameAfterDelay':
            if (draft.username.value.length < 3) {
                draft.username.hasErrors = true
                draft.username.message = 'Username must be at least 3 characters'
            }
            if (!draft.username.hasErrors && !action.noRequest) {
                draft.username.checkCount++
            }
            if (draft.username.message && action.noRequest && !draft.username.isUnique) {
                draft.username.hasErrors = true
            }
            return
        case 'usernameUniqueResults':
            if (action.value) {
                draft.username.hasErrors = true
                draft.username.isUnique = false
                draft.username.message = 'That username is already taken'
            } else {
                draft.username.isUnique = true
            }
            return
        case 'emailImmidiately':
            draft.email.hasErrors = false
            draft.email.value = action.value
            break
        case 'emailAfterDelay':
            if (!regExpEmail.test(draft.email.value)) {
                draft.email.hasErrors = true
                draft.email.message = 'You must provide a valid email address'
            }
            if (!draft.email.hasErrors && !action.noRequest) {
                draft.email.checkCount++
            }
            if (draft.email.message && action.noRequest && !draft.email.isUnique) {
                draft.email.hasErrors = true
            }
            return
        case 'emailUniqueResults':
            if (action.value) {
                draft.email.hasErrors = true
                draft.email.isUnique = false
                draft.email.message = 'That email is already being used'
            } else {
                draft.email.isUnique = true
            }
            return
        case 'passwordImmediately':
            draft.password.hasErrors = false
            draft.password.value = action.value
            if (draft.password.value.length > 50) {
                draft.password.hasErrors = true
                draft.password.message = 'Password cannot exceed 50 characters.'
            }
            return
        case 'passwordAfterDelay':
            if (draft.password.value.length < 12) {
                draft.password.hasErrors = true
                draft.password.message = 'Password must be at least 12 characters'
            }
            return
        case 'submitForm':
            if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
                draft.submitCount++
            } else {
                console.log(!draft.username.hasErrors, draft.username.isUnique, !draft.email.hasErrors, draft.email.isUnique, !draft.password.hasErrors)
            }
            return
        }
    }

    const positiveUsername = !state.username.hasErrors && state.username.isUnique && state.username.value
    const negativeUsername = state.username.hasErrors && !state.username.isUnique && state.username.value
    const positiveEmail = !state.email.hasErrors && state.email.isUnique && state.email.value
    const negativeEmail = state.email.hasErrors && !state.email.isUnique && state.email.value
    const positivePassword = !state.password.hasErrors && state.password.value.length >= 12 && state.password.value.length <= 50
    const negativePassword = state.password.hasErrors && state.password.value

    useEffect(() => {
        if (state.username.value) {
            const delay = setTimeout(() => dispatch({ type: 'usernameAfterDelay' }), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.username.value])

    useEffect(() => {
        if (state.email.value) {
            const delay = setTimeout(() => dispatch({ type: 'emailAfterDelay' }), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.email.value])

    useEffect(() => {
        if (state.password.value) {
            const delay = setTimeout(() => dispatch({ type: 'passwordAfterDelay' }), 1000)
            return () => clearTimeout(delay)
        }
    }, [state.password.value])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResult() {
            try {
                const response = await Axios.post('/doesUsernameExist', { username: state.username.value }, { cancelToken: ourRequest.token })
                dispatch({ type: 'usernameUniqueResults', value: response.data })
            } catch (e) {
                console.log('There was a problem or the reques was canceled')
                toaster.negative('Something went wrong')
            }
        }

        if (state.username.checkCount) {
            
            fetchResult()
            return () => ourRequest.cancel()
        }
    }, [state.username.checkCount])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResult() {
            try {
                const response = await Axios.post('/doesEmailExist', { email: state.email.value }, { cancelToken: ourRequest.token })
                dispatch({ type: 'emailUniqueResults', value: response.data })
            } catch (e) {
                toaster.negative('Something went wrong')
                console.log('something went wrong')
            }
        }

        if (state.email.checkCount) {
            fetchResult()
            return () => ourRequest.cancel()
        }
    }, [state.email.checkCount])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function sendRequest() {
            try {
                const response = await Axios.post('/register', { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
                console.log('SUBMIT')
                appDispatch({ type: 'login', data: response.data })
                toaster.positive('You have succefully created account')
            } catch (e) {
                console.log('something went wrong')
                toaster.negative('There was a problem or the reques was canceled')
            }
        }

        if (state.submitCount) {
            sendRequest()
            return () => ourRequest.cancel()
        }
    }, [state.submitCount])

    function handleNav(e) {
        e.preventDefault()
        history.push(e.target.pathname)
    }
    function handleSubmit(e) {
        e.preventDefault()
        dispatch({ type: 'usernameImmidiately', value: state.username.value })
        dispatch({ type: 'usernameAfterDelay', value: state.username.value, noRequest: true })
        dispatch({ type: 'emailImmidiately', value: state.email.value })
        dispatch({ type: 'emailAfterDelay', value: state.email.value, noRequest: true })
        dispatch({ type: 'passwordImmediately', value: state.password.value })
        dispatch({ type: 'passwordAfterDelay', value: state.password.value })
        dispatch({ type: 'submitForm' })
    }
    function Positive() {
        return (
            <div
                className={css({
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: theme.sizing.scale500,
                    color: theme.colors.positive400
                })}
            >
                <Check size="18px" />
            </div>
        )
    }
    function Negative() {
        return (
            <div
                className={css({
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: theme.sizing.scale500,
                    color: theme.colors.negative400
                })}
            >
                <Alert size="18px" />
            </div>
        )
    }

    return (
        <Card>
            <StyledBody>
                <form onSubmit={handleSubmit}>
                    <FormControl label="Username" error={state.username.hasErrors ? state.username.message : null}>
                        <Input
                            onChange={e => {
                                dispatch({ type: 'usernameImmidiately', value: e.target.value })
                            }}
                            name="username"
                            error={state.username.hasErrors}
                            overrides={positiveUsername ? { After: Positive } : negativeUsername ? { After: Negative } : {}}
                        />
                    </FormControl>
                    <FormControl label="Email" error={state.email.hasErrors ? state.email.message : null}>
                        <Input
                            name="email"
                            type="email"
                            onChange={e => {
                                dispatch({ type: 'emailImmidiately', value: e.target.value })
                            }}
                            error={state.email.hasErrors}
                            overrides={positiveEmail ? { After: Positive } : negativeEmail ? { After: Negative } : {}}
                        />
                    </FormControl>
                    <FormControl label="Password" error={state.password.hasErrors ? state.password.message : null}>
                        <Input
                            name="password"
                            type="password"
                            onChange={e => {
                                dispatch({ type: 'passwordImmediately', value: e.target.value })
                            }}
                            error={state.password.hasErrors}
                            overrides={positivePassword ? { After: Positive } : negativePassword ? { After: Negative } : {}}
                        />
                    </FormControl>
                    <Button onClick={handleSubmit}>Sign Up</Button> or{' '}
                    <StyledLink href="/" onClick={handleNav}>
            Sign In
                    </StyledLink>
                </form>
            </StyledBody>
        </Card>
    )
}

export default SignUpForm
