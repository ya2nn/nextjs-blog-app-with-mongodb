import { useState } from 'react';

import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';

export default function AddProject() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleProject = async (e) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // fields check
    if (!name || !slug) return setError('All fields are required');

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
      return setMessage(data.message);
    } else {
      // set the error
      return setError(data.message);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <form onSubmit={handleProject} className={styles.form}>
          {error ? (
            <div className={styles.formItem}>
              <h3 className={styles.error}>{error}</h3>
            </div>
          ) : null}
          {message ? (
            <div className={styles.formItem}>
              <h3 className={styles.message}>{message}</h3>
            </div>
          ) : null}
          <div className={styles.formItem}>
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Project Name"
            />
          </div>
          <div className={styles.formItem}>
            <label>Project Slug</label>
            <textarea
              name="slug"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
              placeholder="Project slug"
            />
          </div>
          <div className={styles.formItem}>
            <button type="submit">Add Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}