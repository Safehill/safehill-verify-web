import FingerprintIcon from '@/components/shared/FingerprintIcon';
import { useMemo } from 'react';

const COLORS = [
  'text-red-200',
  'text-red-500',
  'text-green-500',
  'text-green-800',
  'text-blue-500',
  'text-yellow-500',
  'text-yellow-800',
  'text-purple-500',
  'text-pink-500',
  'text-pink-200',
  'text-orange-500',
  'text-orange-200',
  'text-cyan-500',
];

const curatedImages = [
  'https://unsplash.com/photos/9M66C_w_ToM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzUwNzI5NDk4fDA&force=true',
  'https://unsplash.com/photos/BteCp6aq4GI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8ZmFzaGlvbnxlbnwwfHx8fDE3NTA2NzkyMjB8MA&force=true',
  'https://unsplash.com/photos/IwVRO3TLjLc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGZhc2hpb258ZW58MHx8fHwxNzUwNjc5MjIwfDA&force=true',
  'https://unsplash.com/photos/RnCPiXixooY/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NDJ8fGRlc2lnbnxlbnwwfHx8fDE3NTA3NDc4OTh8MA&force=true',
  'https://unsplash.com/photos/C_dRtsnBOQA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NjB8fGRlc2lnbnxlbnwwfHx8fDE3NTA3NDc4OTh8MA&force=true',
  'https://unsplash.com/photos/9mPl0Zo7_gQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NTJ8fGRlc2lnbnxlbnwwfHx8fDE3NTA3NDc4OTh8MA&force=true',
  'https://unsplash.com/photos/D4jRahaUaIc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fGZhc2hpb258ZW58MHx8fHwxNzUwNjc5MjIwfDA&force=true',
  'https://unsplash.com/photos/ki9hBSNe9ws/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzI4fHxmYXNoaW9uJTIwZGVzaWdufGVufDB8fHx8MTc1MDc4MDIyMXww&force=true',
  'https://unsplash.com/photos/_1mfFUHkSfo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTg2fHxpbmR1c3RyaWFsJTIwZGVzaWdufGVufDB8fHx8MTc1MDc3NzE0OHww&force=true',
  'https://unsplash.com/photos/s2JorqV3ND4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTkyfHxmYXNoaW9uJTIwZGVzaWdufGVufDB8fHx8MTc1MDc3ODIwNHww&force=true',
  'https://unsplash.com/photos/5MG8cQbw-T8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzUwNzI5NDk4fDA&force=true',
  'https://unsplash.com/photos/sv8oOQaUb-o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGRlc2lnbnxlbnwwfHx8fDE3NTA3Njk5NzR8MA&force=true',
];

const generateImages = () =>
  curatedImages.map((url) => ({
    url: `${url}?w=800&h=600&fit=crop`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

export const ImageCarousel = () => {
  const images = useMemo(() => generateImages(), []);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative w-full">
        <div
          className="flex animate-scroll-x gap-2"
          style={{ width: 'max-content' }}
        >
          {[...images, ...images].map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/2] h-[200px] md:h-[300px] lg:h-[400px] bg-gray-200 rounded-xl overflow-hidden -ml-[2px] shadow-lg"
            >
              <img
                src={img.url}
                alt={`Image ${idx}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute top-2 right-2">
                <FingerprintIcon color={img.color} size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
