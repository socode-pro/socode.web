import React from "react"
import Search from "./components/search"
import Drawer from "./components/drawer"
import ExtArrow from "./components/extarrow"
import { isInStandaloneMode } from "./utils/assist"
import "./styles/app.global.scss"

const Home: React.FC = () => {
  return (
    <>
      <Search />
      <Drawer />
      {!isInStandaloneMode && <ExtArrow />}
    </>
  )
}

export default Home
