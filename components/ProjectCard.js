import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

export default function ProjectCard({ project }) {
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Publish project
  const publishProject = async (projectId) => {
    // change publishing state
    setPublishing(true);

    try {
      // Update project
      await fetch('/api/projects', {
        method: 'PUT',
        body: projectId,
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
  const deleteProject = async (projectId) => {
    //change deleting state
    setDeleting(true);

    try {
      // Delete project
      await fetch('/api/projects', {
        method: 'DELETE',
        body: projectId,
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
      <div className='flex-grow'>{project.name}</div>
      <div className='mx-[50px]'>
        <Link href={`/project/${project.slug}`}>
          <a className='mt-[50px]'>Edit</a>
        </Link>
      </div>
      <div className='mx-[50px]'>
        {!project.published ? (
          <button type="button" onClick={() => publishProject(project._id)}>
            {publishing ? 'Publishing' : 'Publish'}
          </button>
        ) : null}
      </div>
      <div className='mx-[50px]'>
        <button type="button" onClick={() => deleteProject(project['_id'])}>
          {deleting ? 'Deleting' : 'Delete'}
        </button>
      </div>
    </div>
  );
}