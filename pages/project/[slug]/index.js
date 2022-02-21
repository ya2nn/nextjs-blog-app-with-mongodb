import Link from 'next/link';
import Head from "next/head";

import Container from "../../../components/Container";
import Nav from "../../../components/Nav";
import SectionCard from "../../../components/SectionCard";

const Project = ({ project, sections }) => {
  return (
    <div>
      <Head>
        <title>{project.name} - Project Detail</title>
      </Head>

      <Nav />

      <main>
        <Container>
          <h1 className='text-3xl mb-[30px]'>{project.name}</h1>

          <div>
            {sections.length === 0 ? (
              <h2>No added Sections</h2>
            ) : (
              sections.map((section, i) => (
                <SectionCard section={section} key={i} />
              ))
            )}

            <Link href={`/project/${project.slug}/add-section`}>
              <button className='mt-[50px]'>Add new section</button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
};

export async function getStaticPaths() {
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request projects from api
  let projectsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/projects`);
  // extract the data
  let projectsData = await projectsResponse.json();

  return {
    paths: projectsData['message'].map(({slug}) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request projects from api
  let projectsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/projects/${params.slug}`);
  // extract the data
  let projectsData = await projectsResponse.json();

  const { _id, name, slug } = projectsData['message'][0] || {}

  // request sections to projectID from api
  let sectionsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/sections/${_id}`);
  // extract the data
  let sectionsData = await sectionsResponse.json();

  return {
    props: {
      project: {
        id: _id || '',
        name: name || '',
        slug: slug || ''
      },
      sections: sectionsData['message']
    },
  };
}

export default Project;