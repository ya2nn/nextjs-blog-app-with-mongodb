import Link from 'next/link';

export default function Nav() {
  return (
    <header className='sticky top-0 left-0 z-50 p-4 shadow-md w-full flex items-center bg-white mb-[20px]'>
      <div className='mx-[20px]'>Burger</div>
      <Link href="/">
        <div className='mx-[20px] text-2xl cursor-pointer hover:underline'>Projects</div>
      </Link>
      <div className='mx-[20px]'>Order Filter</div>
    </header>
  );
}