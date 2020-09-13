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

function App() {
    const appState = useContext(StateContext)

    return (
        <BrowserRouter>
            <OverallPageContainer>
                <ToasterContainer autoHideDuration={2000}>
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
                            <Route path="/create-post">
                                <CreatePost />
                            </Route>
                            <Route path="/about-us">
                                <AboutUs />
                            </Route>
                            <Route path="/privacy-policy">
                                <Privacy />
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
