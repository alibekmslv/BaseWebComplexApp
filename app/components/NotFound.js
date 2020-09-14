import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'
import { H2, Paragraph1 } from 'baseui/typography'
import { useStyletron } from 'baseui'

function NotFound() {
    const [css, theme] = useStyletron()

    const linkStyle = css({
        color: theme.colors.primaryA
    })

    return (
        <Page title="Not Found">
            <div className={css({textAlign: 'center'})}>
                <H2>Whoops, we cannot find that page.</H2>
                <Paragraph1>
                    You can always visit the <Link to="/" className={linkStyle}>homepage</Link> to get fresh start.
                </Paragraph1>
            </div>
        </Page>
    )
}

export default NotFound
