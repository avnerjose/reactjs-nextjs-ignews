import type { NextPage } from "next";
import style from '../styles/home.module.scss';

const Home: NextPage = () => {
  return <h1 className={style.title}>Hello World</h1>;
};

export default Home;
