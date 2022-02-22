import Head from 'next/head';
import Link from "next/link";

import Container from "../components/Container";
import Nav from '../components/Nav';
import ProjectCard from "../components/ProjectCard";
import Modal, {openModal} from "../components/Modal";
import {useState} from "react";
import {useRouter} from "next/router";
import {string_to_slug} from "../utils/utils";

export default function Home({ projects }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter()

  const handleProject = async (e) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // fields check
    if (!name || !slug) return setError('Field is required');

    // project structure
    let project = {
      name,
      slug,
      published: false,
      createdAt: new Date().toISOString(),
    };
    // save the project
    let response = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });

    // get the data
    let data = await response.json();

    if (data.success) {
      // reset the fields
      setName('');
      setSlug('');

      // set the message
      setMessage(data.message);
      // redirect to project
      await router.push(`/project/${slug}`)
    } else {
      // set the error
      return setError(data.message);
    }
  };

  const handleChange = (name) => {
    const slug = string_to_slug(name)

    setName(name)
    setSlug(slug)
  }

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

            {/*<Link href="/project/add-project">*/}
            {/*  <button >Add new project</button>*/}
            {/*</Link>*/}
            <button className='mt-[50px]' onClick={() => openModal('addNewProject')}>Add new project</button>
            <Modal modalId='addNewProject'>
              <h2 className='text-3xl mb-[20px]'>Create new project</h2>

              <form onSubmit={handleProject} className='space-y-4'>
                {error ? (
                  <div>
                    <h3 className='text-red-500 text-bold'>{error}</h3>
                  </div>
                ) : null}
                <div className='flex items-center'>
                  <label className='w-[200px]'>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => handleChange(e.target.value)}
                    value={name}
                    placeholder="Project Name"
                    className='border shadow-md px-4 py-2'
                  />
                </div>
                <div>
                  {message ? (
                    <h3 className='text-green-500 text-bold'>{message}</h3>
                  ) : (
                    <button type="submit" className='py-2 px-4 bg-black text-white'>Add Project</button>
                  )}
                </div>
              </form>
            </Modal>
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