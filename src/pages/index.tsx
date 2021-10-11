import { GetStaticProps } from 'next';
import Head from 'next/head';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <div className={styles.posts}>
          {results.map(post => (
            <section className={styles.post} key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar color="var(--info)" size={20} />{' '}
                  {post.first_publication_date}
                </span>
                <span>
                  <FiUser color="var(--info)" size={20} /> {post.data.author}
                </span>
              </div>
            </section>
          ))}
        </div>
        <a href="/" className={styles.loadMore}>
          Carregar mais posts
        </a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', { pageSize: 1 });

  const { next_page, results: res } = postsResponse;

  const results = res.map((post: Post) => {
    const postData = {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM Y',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };

    return postData;
  });

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
  };
};
