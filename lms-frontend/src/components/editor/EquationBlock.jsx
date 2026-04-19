import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const EquationBlock = ({ latex, display = true }) => {
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex || '', ref.current, {
          displayMode: display,
          throwOnError: false
        })
      } catch (e) {
        ref.current.textContent = latex
      }
    }
  }, [latex, display])

  return (
    <div
      ref={ref}
      style={{
        padding: display ? '8px 0' : 0,
        display: display ? 'block' : 'inline'
      }}
    />
  )
}

export default EquationBlock