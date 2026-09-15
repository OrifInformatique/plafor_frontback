import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx';

const Link = ({ to, children, className }) => {
  return (<>
    <RouterLink className={clsx("text-primary hover:underline focus:underline", className)} to={to}>{children}</RouterLink>
  </>)
}

export default Link