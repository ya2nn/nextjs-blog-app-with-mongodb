import Head from 'next/head';
import Link from "next/link";

import Container from "../components/Container";
import Nav from '../components/Nav';
import ProjectCard from "../components/ProjectCard";

export default function Home({ projects }) {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Nav />

      <main>
        <Container>
          <h1 className='text-3xl mb-[20px]'>Project List</h1>

          <div>
            {projects.length === 0 ? (
              <h2>No added projects</h2>
            ) : (
              projects.map((project, i) => (
                <ProjectCard project={project} key={i} />
              ))
            )}

            <Link href="/project/add-project">
              <button className='mt-[50px]'>Add new project</button>
            </Link>
          </div>
        </Container>
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