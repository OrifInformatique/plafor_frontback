import React from 'react'
import clsx from 'clsx'

const Title = ({children, className}) => {
  return (<>
    <h1 className={clsx("text-2xl sm:text-5xl text-center font-light", className)}>{children}</h1>
  </>)
}

export default Title