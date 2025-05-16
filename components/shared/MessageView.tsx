const MessageView = ({
  message,
  sizeClass,
}: {
  message: string;
  sizeClass: number;
}) => {
  return (
    <div
      className={
        'opacity-95 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-' +
        sizeClass +
        'xl tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-' +
        sizeClass +
        'xl md:leading-[5rem]'
      }
    >
      {message}
    </div>
  );
};

export default MessageView;
