import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { useCallback, useState } from 'react';
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

const formatPost = (post: Post): Post => ({
  uid: post.uid,
  first_publication_date: post.first_publication_date,
  data: {
    title: post.data.title,
    subtitle: post.data.subtitle,
    author: post.data.author,
  },
});

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const loadMorePosts = useCallback(() => {
    fetch(nextPage)
      .then(res => res.json())
      .then(json => {
        const formattedData: Post[] = json.results.map((post: Post) =>
          formatPost(post)
        );

        setPosts([...posts, ...formattedData]);
        setNextPage(json.next_page);
      });
  }, [nextPage, posts]);

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <div className={styles.posts}>
          {posts.map(post => (
            <section className={styles.post} key={post.uid}>
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a>{post.data.title}</a>
              </Link>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar color="var(--info)" size={20} />
                  {format(new Date(post.first_publication_date), 'dd MMM Y', {
                    locale: ptBR,
                  })}
                </span>
                <span>
                  <FiUser color="var(--info)" size={20} /> {post.data.author}
                </span>
              </div>
            </section>
          ))}
        </div>
        {nextPage && (
          <button
            type="button"
            className={styles.loadMore}
            onClick={loadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', { pageSize: 1 });

  const { next_page, results: res } = postsResponse;

  const results = res.map((post: Post) => formatPost(post));

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
  };
};
