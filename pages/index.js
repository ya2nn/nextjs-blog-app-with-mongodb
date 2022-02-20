import Head from 'next/head';

import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';
import ProjectCard from "../components/ProjectCard";

export default function Home({ projects }) {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Nav />

      <main>
        <div className={styles.container}>
          {projects.length === 0 ? (
            <h2>No added projects</h2>
          ) : (
            <ul>
              {projects.map((project, i) => (
                <ProjectCard project={project} key={i} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request projects from api
  let projectsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/projects`);
  // extract the data
  let projectsData = await projectsResponse.json();

  return {
    props: {
      projects: projectsData['message'],
    },
  };
}