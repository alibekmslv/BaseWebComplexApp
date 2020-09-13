import React, { useContext } from 'react'
import { Button } from 'baseui/button'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

function HeaderLoggedOut({ className }) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    return (
        <div className={className}>
            <Button
                kind="minimal"
                onClick={() => {
                    appDispatch({ type: 'handleTheme' })
                }}
            >
                {appState.lightTheme ? '🌚' : '🌝'}
            </Button>
        </div>
    )
}

export default HeaderLoggedOut
