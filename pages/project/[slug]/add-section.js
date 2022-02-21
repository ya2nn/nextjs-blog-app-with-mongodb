import Head from "next/head";
import { useRouter } from 'next/router'
import { useState } from 'react';

import {string_to_slug} from "../../../utils/utils";

import Container from "../../../components/Container";
import Nav from '../../../components/Nav';

export default function AddSection({projectId, projectSlug}) {
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
      projectId,
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
      await router.push(`/project/${projectSlug}`)
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
        <title>Add new section</title>
      </Head>

      <Nav />

      <main>
        <Container>
          <h1 className='text-3xl mb-[20px]'>Create new section</h1>

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
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request projects from api
  let projectsResponse = await fetch(`${dev ? DEV_URL : PROD_URL}/api/projects/${params.slug}`);
  // extract the data
  let projectsData = await projectsResponse.json();

  const { _id, slug } = projectsData['message'][0] || {}

  return {
    props: {
      projectId: _id || '',
      projectSlug: slug || ''
    },
  };
}
