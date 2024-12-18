'use client';

function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
      style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
    >
      <button
        className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
        onClick={onClick}
      >
        <p>{label}</p>
      </button>
    </div>
  );
}

export default PrimaryButton;
