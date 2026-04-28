import React from 'react'
import clsx from 'clsx'

const Logo = ({ className }) => {
  return (
    <a href="/">
      <img className={clsx("w-32 sm:w-56", className)} src="images/logo.svg" />
    </a>
  );
}

export default Logo