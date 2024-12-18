const MessageView = ({
  message,
  sizeClass,
}: {
  message: string;
  sizeClass: number;
}) => {
  return (
    <h1
      className={
        'animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-' +
        sizeClass +
        'xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-' +
        sizeClass +
        'xl md:leading-[5rem]'
      }
      style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
    >
      {message}
    </h1>
  );
};

export default MessageView;
