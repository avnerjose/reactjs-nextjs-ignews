import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "../styles/pages/home.module.scss";
import Image from "next/image";
import { stripe } from "../services/stripe";
interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ignews</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <br /> <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <div>
          <Image src="/images/avatar.svg" alt="Girl coding" layout="fill" />
        </div>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1Jwxe0HUj7Bc9E8lJ1wjKR1e", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price.unit_amount) / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 24 * 60 * 60, //24 hours
  };
};
