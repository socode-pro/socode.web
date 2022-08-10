import React from "react"

const NoMatch: React.FC<Window> = ({ location }) => (
  <div>
    <h3>
      No match for
      <code>{location.pathname}</code>
    </h3>
    <p>
      <a href="/">Go to the home page</a>
    </p>
  </div>
)

export default NoMatch
