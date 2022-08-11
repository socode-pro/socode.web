import React, { useEffect } from "react"
import { useStoreActions, useStoreState } from "./Store"
import Search from "./components/search"
import Drawer from "./components/drawer"
import ExtArrow from "./components/extarrow"
import { isInStandaloneMode } from "./utils/assist"

const Home: React.FC = () => {
  const judgeRegion = useStoreActions((actions) => actions.storage.judgeRegion)
  const initialMetas = useStoreActions((actions) => actions.storage.initialMetas)
  const judgeInsideFirewall = useStoreActions((actions) => actions.storage.judgeInsideFirewall)
  const injectParams = useStoreActions((actions) => actions.profile.injectParams)
  const loadProfile = useStoreActions((actions) => actions.profile.loadProfile)
  const insideFirewall = useStoreState<boolean>((state) => state.storage.insideFirewall)

  useEffect(() => {
    judgeRegion()
    initialMetas()
    judgeInsideFirewall()
    injectParams()
    loadProfile()
  }, [judgeRegion, judgeInsideFirewall, injectParams, loadProfile, initialMetas])

  return (
    <>
      <Search />
      <Drawer />
      {/* {!isInStandaloneMode && <ExtArrow />} */}
      {/* {insideFirewall && (
        <a className="china-record" href="https://beian.miit.gov.cn/">
          苏ICP备18044337号-2
        </a>
      )} */}
    </>
  )
}

export default Home
