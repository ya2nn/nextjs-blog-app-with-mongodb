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
      setMessage('');
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
        <div>
          Hellooooooooo
        </div>
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