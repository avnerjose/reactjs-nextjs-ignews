import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";
import styles from "../../styles/pages/posts.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostPageProp {
  posts: Post[];
}

const Posts: NextPage<PostPageProp> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(({ slug, excerpt, title, updatedAt }, index) => (
            <Link href={`/posts/${slug}`} key={index}>
              <a>
                <time>{updatedAt}</time>
                <strong>{title}</strong>
                <p>{excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const { results } = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["title", "content"],
      pageSize: 100,
    }
  );

  const posts = results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(
          (content: { type: string }) => content.type === "paragraph"
        )?.text ?? "",
      updatedAt:
        new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(String(post.last_publication_date))) ?? "",
    };
  });
  //console.log(JSON.stringify(response.results, null, 2));

  return {
    props: {
      posts,
    },
  };
};
