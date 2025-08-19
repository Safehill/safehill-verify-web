import Link from 'next/link';

export default function BottomNav({ darkTheme }: { darkTheme: boolean }) {
  return (
    <div
      className={`w-full flex justify-center items-center gap-2 py-5 px-5 text-sm ${
        darkTheme ? 'text-gray-200' : 'text-black'
      }`}
    >
      <Link
        href="#howitworks"
        className={`px-6 py-2 font-normal rounded-lg hover:shadow-sm transition-all duration-50 hover:scale-105 ${
          darkTheme ? 'hover:bg-white/30' : 'hover:bg-primary hover:text-white'
        }`}
      >
        Download the App
      </Link>
      <Link
        href="/privacy"
        className={`px-6 py-2 font-normal rounded-lg hover:shadow-sm transition-all duration-50 hover:scale-105 ${
          darkTheme ? 'hover:bg-white/30' : 'hover:bg-primary hover:text-white'
        }`}
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms"
        className={`px-6 py-2 font-normal rounded-lg hover:shadow-sm transition-all duration-50 hover:scale-105 ${
          darkTheme ? 'hover:bg-white/30' : 'hover:bg-primary hover:text-white'
        }`}
      >
        Terms of Use
      </Link>
    </div>
  );
}
