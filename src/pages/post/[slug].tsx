/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useMemo } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const estimatedReadTime = useMemo(() => {
    const time = Math.ceil(
      post.data.content.reduce(
        (acc, content) =>
          acc + (RichText.asText(content.body).split(' ')?.length ?? 0),
        0
      ) / 200
    );

    return `${time} min`;
  }, [post]);

  const publicationDate = useMemo(
    () =>
      format(new Date(post.first_publication_date), 'dd MMM Y', {
        locale: ptBR,
      }),
    [post]
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.details}>
            <span>
              <FiCalendar color="var(--info)" size={20} /> {publicationDate}
            </span>
            <span>
              <FiUser color="var(--info)" size={20} /> {post.data.author}
            </span>
            <span>
              <FiClock color="var(--info)" size={20} /> {estimatedReadTime}
            </span>
          </div>

          {post.data.content.map(paragraph => (
            <div
              key={`${paragraph.heading}, ${Date.now()}`}
              className={styles.paragraph}
            >
              <h2>{paragraph.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(paragraph.body),
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('');

  const paths = postsResponse.results.map(post => ({
    params: { slug: post.uid },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 1,
  };
};
