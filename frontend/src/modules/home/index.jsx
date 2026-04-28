import React from 'react'

import Logo from '../../ui/logo'
import Link from '../../ui/link'
import Title from '../../ui/title'

const Home = () => {
  return (<>
    <Logo />
    <Title className="pt-4 sm:pt-6 ">Section Informatique</Title>
    <Link className="pt-4 sm:pt-6" to="contact">Contact</Link>
  </>)
}

export default Home