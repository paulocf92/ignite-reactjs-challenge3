import { GetStaticProps } from 'next';
import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <div className={styles.posts}>
          <section className={styles.post}>
            <strong>Como utilizar hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <span>
                <FiCalendar color="var(--info)" size={20} /> 15 Mar 2021
              </span>
              <span>
                <FiUser color="var(--info)" size={20} /> Joseph Oliveira
              </span>
            </div>
          </section>
          <section className={styles.post}>
            <strong>Como utilizar hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <span>15 Mar 2021</span>
              <span>Joseph Oliveira</span>
            </div>
          </section>
          <section className={styles.post}>
            <strong>Como utilizar hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <span>15 Mar 2021</span>
              <span>Joseph Oliveira</span>
            </div>
          </section>
          <section className={styles.post}>
            <strong>Como utilizar hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <span>15 Mar 2021</span>
              <span>Joseph Oliveira</span>
            </div>
          </section>
        </div>
        <a href="/" className={styles.loadMore}>
          Carregar mais posts
        </a>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
