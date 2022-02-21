import Head from "next/head";
import { useRouter } from 'next/router'
import { useState } from 'react';

import {string_to_slug} from "../../utils/utils";

import Container from "../../components/Container";
import Nav from '../../components/Nav';

export default function AddProject() {
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
        <title>Add new project</title>
      </Head>

      <Nav />

      <main>
        <Container>
          <h1 className='text-3xl mb-[20px]'>Create new project</h1>

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
        </Container>
      </main>
    </div>
  );
}