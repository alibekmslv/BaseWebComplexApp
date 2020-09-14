import React, { useContext, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ToasterContainer } from 'baseui/toast'

import StateContext from './StateContext'

// Our componetns
import Home from './components/Home'
import HomeGuest from './components/HomeGuest'
const CreatePost = React.lazy(() => import('./components/CreatePost'))
import Header from './components/Header'
import Footer from './components/Footer'
const AboutUs = React.lazy(() => import('./components/AboutUs'))
import Privacy from './components/Privacy'
const ViewSinglePost = React.lazy(() => import('./components/ViewSinglePost'))
import Profile from './components/Profile'
const EditPost = React.lazy(() => import('./components/EditPost'))
const Chat = React.lazy(() => import('./components/Chat'))
import LoadingCircleIcon from './components/LoadingCircleIcon'
import OverallPageContainer from './components/OverallPageContainer'
import NotFound from './components/NotFound'

const toasterOverride = {
    Root: {
        style: ({$theme}) => {
            return { 
                zIndex: 100, 
                marginTop: $theme.sizing.scale200,
                [$theme.mediaQuery.medium]: {
                    marginTop: '84px'
                }
            }
        }
    }
}

function App() {
    const appState = useContext(StateContext)

    return (
        <BrowserRouter>
            <OverallPageContainer>
                <ToasterContainer autoHideDuration={3000} placement={'topRight'} overrides={toasterOverride}>
                    <Header />
                    <Suspense fallback={<LoadingCircleIcon />}>
                        <Switch>
                            <Route path="/profile/:username">
                                <Profile />
                            </Route>
                            <Route path="/post/:id" exact>
                                <ViewSinglePost />
                            </Route>
                            <Route path="/post/:id/edit" exact>
                                <EditPost />
                            </Route>
                            <Route path="/create-post" exact>
                                <CreatePost />
                            </Route>
                            <Route path="/about-us" exact>
                                <AboutUs />
                            </Route>
                            <Route path="/privacy-policy" exact>
                                <Privacy />
                            </Route>
                            <Route path="/login" exact>
                                <HomeGuest />
                            </Route>
                            <Route path="/" exact>
                                {appState.loggedIn ? <Home /> : <HomeGuest />}
                            </Route>
                            <Route>
                                <NotFound />
                            </Route>
                        </Switch>
                    </Suspense>
                    <Suspense fallback={''}>{appState.loggedIn ? <Chat /> : null}</Suspense>
                    <Footer />
                </ToasterContainer>
            </OverallPageContainer>
        </BrowserRouter>
    )
}

export default App
