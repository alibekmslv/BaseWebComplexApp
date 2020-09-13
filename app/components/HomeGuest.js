import React from 'react'
import { useLocation } from 'react-router-dom'
import { Heading, HeadingLevel } from 'baseui/heading'
import { Paragraph3 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { Grid, Cell } from 'baseui/layout-grid'

import SingInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { useStyletron } from 'baseui'
import Page from './Page'

function HomeGuest() {
    const [css] = useStyletron()
    const { pathname } = useLocation()

    return (
        <Page title="Welcome">
            <Block paddingTop={['scale600', 'scale600', 'scale900']}>
                <Grid>
                    <Cell span={[0, 4, 6]}>
                        <div
                            className={css({
                                display: 'flex'
                            })}
                        >
                            <div>
                                <HeadingLevel>
                                    <Heading>Remember Writing?</Heading>
                                    <Paragraph3>Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</Paragraph3>
                                </HeadingLevel>
                            </div>
                        </div>
                    </Cell>
                    <Cell span={[4, 4, 6]}>
                        <Block
                            className={css({
                                display: 'flex',
                                justifyContent: 'center'
                            })}
                            marginTop={['scale600', 'scale600', '0']}
                        >
                            {pathname === '/login' ? <SignUpForm /> : <SingInForm />}
                        </Block>
                    </Cell>
                </Grid>
            </Block>
        </Page>
    )
}

export default HomeGuest
