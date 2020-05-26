import React, { useState, useEffect } from "react"
import cs from "classnames"
// import matches from 'dom101/matches'
import { useStoreActions, useStoreState } from "../Store"
import { splitwords, permutateString } from "../utils/permutate"
// import { nextUntil } from '../utils/dom'
import css from "./learnxiny.module.scss"

let learnxinyElements: NodeListOf<Element> | null = null

interface Props {
  query: string
}

function permutate(data: { slug?: string; category?: string }): string[] {
  let words: string[] = []
  if (data.slug) {
    words = words.concat(permutateString(data.slug))
  }
  if (data.category) {
    words = words.concat(permutateString(data.category))
  }
  return words
}

const Learnxiny: React.FC<Props> = ({ query }: Props): JSX.Element => {
  const [elements, setElements] = useState<NodeListOf<Element> | null>(null)

  const learnxinyHtml = useStoreState<string>((state) => state.learnxiny.html)
  const getLearnxinyHtml = useStoreActions((actions) => actions.learnxiny.getHtml)
  useEffect(() => {
    getLearnxinyHtml()
  }, [getLearnxinyHtml])

  useEffect(() => {
    if (learnxinyElements) {
      setTimeout(() => setElements(learnxinyElements), 0) // setTimeout avoid black box when switching
      return
    }
    const doc = new DOMParser().parseFromString(learnxinyHtml, "text/html")
    const els = doc.querySelectorAll(".container>table")
    learnxinyElements = els
    setElements(els)
  }, [learnxinyHtml])

  // https://www.reddit.com/r/reactjs/comments/8k49m3/can_i_render_a_dom_element_inside_jsx/dz5cexl/
  return (
    <>
      <div className={cs(css.learnxiny)} ref={(ref) => elements && elements.forEach((e) => ref?.appendChild(e))} />
      <p className={cs(css.powered, { "dis-none": !elements })}>
        <a href="https://learnxinyminutes.com/" target="_blank" rel="noopener noreferrer">
          powered by learnxinyminutes.com
        </a>
      </p>
    </>
  )
}

export default Learnxiny
