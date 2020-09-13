import React, { useEffect } from 'react'
import { Block } from 'baseui/block'
import { useStyletron } from 'baseui'

function Page(props) {
    const [css, theme] = useStyletron()

    const pageStyle = css({
        marginTop: theme.sizing.scale300,
        paddingTop: theme.sizing.scale400,
        display: 'flex',
        justifyContent: 'center',
        flexGrow: '1'
    })

    const mainStyle = css({
        boxSizing: 'border-box',
        maxWidth: '95vw',
        width: '100%',
        display: 'block',
        position: 'relative',
        outline: 'none',
        paddingRight: theme.sizing.scale300,
        paddingLeft: theme.sizing.scale300,
        [theme.mediaQuery.medium]: {
            maxWidth: '800px',
            paddingRight: theme.sizing.scale800,
            paddingLeft: theme.sizing.scale800
        }
    })

    useEffect(() => {
        document.title = props.title + ' | Base Web App'
        window.scrollTo(0, 0)
    }, [props.title])

    return (
        <Block className={pageStyle}>
            <main className={mainStyle}>{props.children}</main>
        </Block>
    )
}

export default Page
