export default function Footer({ darkTheme }: { darkTheme: boolean }) {
  return (
    <div className="absolute w-full py-5 text-center">
      <p className={darkTheme ? 'text-gray-200' : 'text-gray-600'}>
        © 2024 by Safehill.
      </p>
    </div>
  );
}
