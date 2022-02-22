import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import Modal, {closeModal, openModal} from "./Modal";
import {string_to_slug} from "../utils/utils";

export default function SectionCard({ project, section, icons }) {
  //Icon
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  //Section
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleIcon = async (e) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // fields check
    if (!name || !slug || !svg) return setError('All fields are required');

    // section structure
    let icons = {
      name,
      slug,
      svg,
      sectionId: section._id,
      projectId: project.id,
      published: false,
      createdAt: new Date().toISOString(),
    };
    // save the section
    let response = await fetch('/api/icons', {
      method: 'POST',
      body: JSON.stringify(icons),
    });

    // get the data
    let data = await response.json();

    if (data.success) {
      // reset the fields
      setName('');
      setSlug('');
      setSvg('');

      // set the message
      setMessage(data.message);
      // redirect to project
      await router.push(`/project/${project.slug}`)
      //Close Modal
      closeModal(`addNewIcon-${section._id}`)
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

  // Publish section
  const publishSection = async (sectionId) => {
    // change publishing state
    setPublishing(true);

    try {
      // Update project
      await fetch('/api/sections', {
        method: 'PUT',
        body: sectionId,
      });

      // reset the publishing state
      setPublishing(false);

      // reload the page
      return router.push(router.asPath);
    } catch (error) {
      // Stop publishing state
      return setPublishing(false);
    }
  };
  // Delete project
  const deleteSection = async (sectionId) => {
    //change deleting state
    setDeleting(true);

    try {
      // Delete project
      await fetch('/api/sections', {
        method: 'DELETE',
        body: sectionId,
      });

      // reset the deleting state
      setDeleting(false);

      // reload the page
      return router.push(router.asPath);
    } catch (error) {
      // stop deleting state
      return setDeleting(false);
    }
  };

  const iconsFiltered = icons.filter(({sectionId}) => sectionId === section._id)

  return (
    <>
      <div className='border-b flex items-center p-4'>
        <div className='flex-grow'>{section.name}</div>
        <div className='mx-[50px]'>
          <Link href={`/project/${section.slug}`}>
            <a className='mt-[50px]'>Edit</a>
          </Link>
        </div>
        <div className='mx-[50px]'>
          {!section.published ? (
            <button type="button" onClick={() => publishSection(section._id)}>
              {publishing ? 'Publishing' : 'Publish'}
            </button>
          ) : null}
        </div>
        <div className='mx-[50px]'>
          <button type="button" onClick={() => deleteSection(section['_id'])}>
            {deleting ? 'Deleting' : 'Delete'}
          </button>
        </div>
      </div>

      <div className='p-4 flex flex-wrap'>
        {iconsFiltered.map(({_id, name})=> (
          <div key={_id} className='border p-2 m-2'>
            {name}
          </div>
        ))}
      </div>
      <div className='p-6 flex'>
        <button onClick={() => openModal(`addNewIcon-${section._id}`)}>Add new Icon</button>
        <Modal modalId={`addNewIcon-${section._id}`}>
          <h2 className='text-3xl mb-[20px]'>Add new Icon</h2>

          <form onSubmit={handleIcon} className='space-y-4'>
            {error ? (
              <div>
                <h3>{error}</h3>
              </div>
            ) : null}
            <div className='flex items-center'>
              <label className='w-[200px]'>Icon Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => handleChange(e.target.value)}
                value={name}
                placeholder="Icon Name"
                className='border shadow-md px-4 py-2'
              />
            </div>
            <div className='flex items-center'>
              <label className='w-[200px]'>Icon Path</label>
              <input
                type="text"
                name="path"
                onChange={(e) => setSvg(e.target.value)}
                value={svg}
                placeholder="Icon Path"
                className='border shadow-md px-4 py-2'
              />
            </div>
            <div>
              {message ? (
                <h3 className='text-green-500 text-bold'>{message}</h3>
              ) : (
                <button type="submit" className='py-2 px-4 bg-black text-white'>Add Icon</button>
              )}
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}