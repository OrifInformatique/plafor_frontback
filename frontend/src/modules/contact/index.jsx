import React from 'react'

import Logo from '../../ui/logo'
import Link from '../../ui/link'
import Title from '../../ui/title'

const Home = () => {
  return (<>
    <Logo />
    <Title className="pt-4 sm:pt-6 ">Orif Pomy</Title>
    <ul className="text-center pt-4 text-lg">
        <li>Chem. du Mont-de-Brez 2</li>
        <li>1405 Pomy</li>
    </ul>
    <Link className="pt-4 sm:pt-6" to="contact">Home</Link>
  </>)
}

export default Home