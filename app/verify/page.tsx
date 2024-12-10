import ImageUploader from "./ImageUploader";

export default async function VerifyPage() {

    return (
        <>
          <div className="z-10 w-full max-w-xl px-5 xl:px-0">
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              Time for some truth
            </h1>
            <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Safehill lets you verify the history and provenance of any image, if it was authenticated by anyone.
        </p>
        <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
 Choose a file from this device
        </p>
            <ImageUploader />
          </div>
        </>
      );
}