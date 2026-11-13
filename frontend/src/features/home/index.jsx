import React from 'react'
import { useTranslation } from 'react-i18next'
import Items from '../../template/items/items'
import {
    Title
} from '@orif-informatique/react-components-library';

const Home = () => {
  const { t } = useTranslation("home", "common");
  return (
  <>
    <Title>{t("home_title")}</Title>
    <Items />
  </>
  )
}

export default Home