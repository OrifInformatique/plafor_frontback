import React from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../../common/ui/title'
import Items from '../items/items'
import UserList from '../users'

const Home = () => {
  const { t } = useTranslation("home", "common");
  return (
  <>
    <Title>{t("home_title")}</Title>
    <Items />

    <UserList />
  </>
  )
}

export default Home