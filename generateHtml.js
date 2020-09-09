import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "fs"
import { Provider as StyletronProvider } from "styletron-react"
import { Server as Styletron } from "styletron-engine-atomic"
import { DarkTheme, BaseProvider } from "baseui"
import OverallPageContainer from "./app/components/OverallPageContainer"
import Header from "./app/components/Header"
import Footer from "./app/components/Footer"
import LoadingCircleIcon from "./app/components/LoadingCircleIcon"
import { StaticRouter as Router } from "react-router-dom"
import StateContext from "./app/StateContext"

const engine = new Styletron()

function Shell() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <StateContext.Provider value={{ loggedIn: false }}>
          <OverallPageContainer>
            <Router>
              <Header staticEmpty={true} />
              <LoadingCircleIcon />
              <Footer />
            </Router>
          </OverallPageContainer>
        </StateContext.Provider>
      </BaseProvider>
    </StyletronProvider>
  )
}

function html(x) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>OurApp</title>
      <link rel="stylesheet" href="/main.css" />
      ${engine.getStylesheetsHtml()}
    </head>
    <body>
      <div id="app">
      ${x}
      </div>
    </body>
  </html>
  `
}

/*
  We can use ReactDomServer (you can see how we imported
  that at the very top of this file) to generate a string
  of HTML text. We simply give it a React component and
  here we are using the JSX syntax.
*/
const reactHtml = ReactDOMServer.renderToString(<Shell />)

/*
  Call our "html" function which has the skeleton or
  boilerplate HTML, and give it the string that React
  generated for us. Our "html" function will insert
  the React string inside the #app div. So now we will
  have a variable in memory with the exact string we
  want, we just need to save it to a file.

*/
const overallHtmlString = html(reactHtml)

/*
  This course is not about Node, but here we are simply
  saving our generated string into a file named
  index-template.html. Please note that this Node task
  will fail if the directory we told it to live within
  ("app" in this case) does not already exist.
*/
const fileName = "./app/index-template.html"
const stream = fs.createWriteStream(fileName)
stream.once("open", () => {
  stream.end(overallHtmlString)
})
