import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 my-10 py-5 px-5">
      <Link
        href="/privacy"
        className="px-6 py-2 bg-white/5 font-display text-gray-200 text-base rounded-lg shadow-md transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-white/100 hover:text-teal-800"
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms"
        className="px-6 py-2 bg-white/5 font-display text-gray-200 text-base rounded-lg shadow-md transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-white/100 hover:text-teal-800"
      >
        Terms of Use
      </Link>
      <Link
        href="/authenticate"
        className="px-6 py-2 bg-purple-100/80 font-display text-black text-base rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-purple/80 hover:text-gray-800"
      >
        Authenticator Tool
      </Link>
      <Link
        href="https://tally.so/r/3qoGxg"
        className="px-6 py-2 bg-orange-100/80 font-display text-black text-base rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
      >
        Book a demo
      </Link>
    </div>
  );
}
