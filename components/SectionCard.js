import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

export default function SectionCard({ section }) {
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Publish project
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
  return (
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
  );
}