import Head from 'next/head';
import Nav from '../components/Nav';

export default function Henry({ projects }) {
  return (
    <div>
      <Head>
        <title>Henry</title>
      </Head>

      <Nav />

      <main>
        <div>
          Henry
        </div>
      </main>
    </div>
  );
}
