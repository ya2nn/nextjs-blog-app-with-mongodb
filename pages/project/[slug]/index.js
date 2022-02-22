import Link from 'next/link';
import Head from "next/head";

import Container from "../../../components/Container";
import Nav from "../../../components/Nav";
import SectionCard from "../../../components/SectionCard";
import Modal, {closeModal, openModal} from "../../../components/Modal";
import {useRouter} from "next/router";
import {string_to_slug} from "../../../utils/utils";
import {useState} from "react";

const Project = ({ project, sections, icons }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter()

  const handleSection = async (e) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // fields check
    if (!name || !slug) return setError('All fields are required');

    // section structure
    let section = {
      name,
      slug,
      projectId: project.id,
      published: false,
      createdAt: new Date().toISOString(),
    };
    // save the section
    let response = await fetch('/api/sections', {
      method: 'POST',
      body: JSON.stringify(section),
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
      await router.push(`/project/${project.slug}`)
      //Close Modal
      closeModal('addNewSection')
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
                <SectionCard project={project} section={section} icons={icons} key={i} />
              ))
            )}

            {/*<Link href={`/project/${project.slug}/add-section`}>*/}
            {/*  <button className='mt-[50px]'>Add new section</button>*/}
            {/*</Link>*/}
            <button className='mt-[50px]' onClick={() => openModal('addNewSection')}>Add new section</button>
            <Modal modalId='addNewSection'>
              <h2 className='text-3xl mb-[20px]'>Create new section</h2>

              <form onSubmit={handleSection} className='space-y-4'>
                {error ? (
                  <div>
                    <h3>{error}</h3>
                  </div>
                ) : null}
                <div className='flex items-center'>
                  <label className='w-[200px]'>Section Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => handleChange(e.target.value)}
                    value={name}
                    placeholder="Section Name"
                    className='border shadow-md px-4 py-2'
                  />
                </div>
                <div>
                  {message ? (
                    <h3 className='text-green-500 text-bold'>{message}</h3>
                  ) : (
                    <button type="submit" className='py-2 px-4 bg-black text-white'>Add Section</button>
                  )}
                </div>
              </form>
            </Modal>
          </div>
        </Container>
      </main>
    </div>
  );
};

export async function getServerSideProps({ params }) {
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

  // request icons to projectID from api
  let iconsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/icons/${_id}`);
  // extract the data
  let iconsData = await iconsResponse.json();

  return {
    props: {
      project: {
        id: _id || '',
        name: name || '',
        slug: slug || ''
      },
      sections: sectionsData['message'],
      icons: iconsData['message']
    },
  };
}

export default Project;