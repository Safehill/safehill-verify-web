'use client';

import LineSeparator from '@/components/home/LineSeparator';
import UserView from '@/components/shared/UserView';
import { useUsers } from '@/lib/hooks/use-users';
import { formattedDate } from '@/lib/utils';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import MessageView from '../shared/MessageView';
import type { ImageMatch, ImageMetadataProps } from './FileDetailsProps';
import ImageMetadata from './ImageMetadata';
import ImageView from './ImageView';
import ProvidedImage from './ProvidedImage';

const ImageDetails: React.FC<ImageMetadataProps> = ({
  file,
  imageData,
  matches,
}) => {
  const authorIds = matches.map((match) => match.author);
  const {
    data: users,
    isLoading: usersLoading,
    error: usersFetchError,
  } = useUsers(authorIds);

  const resolveUser = (id: string) =>
    users?.find((u) => u.identifier === id) ?? null;

  return (
    <div className="z-10 w-full px-5 xl:px-0">
      <ProvidedImage
        file={file}
        properties={[
          {
            key: 'File name',
            icon: null,
            value: <span>{file.name}</span>,
          },
          {
            key: 'Image size',
            icon: null,
            value: <span>{imageData.width + ' X ' + imageData.height}</span>,
          },
        ]}
      />

      <MessageView
        message={
          matches.length === 1
            ? '1 similar matches'
            : matches.length + ' similar matches'
        }
        sizeClass={2}
      />

      <LineSeparator />

      <div className="my-10">
        {matches.map((match: ImageMatch, index: number) => {
          const author = resolveUser(match.author);

          return (
            <div
              key={match.globalIdentifier}
              className="grid w-full grid-cols-2 gap-5 px-5 xl:px-0 py-2 mb-10 opacity-95"
            >
              {/* Image section (flex-grow, full height) */}
              <div className="col-span-1 flex justify-end">
                <div className="h-[300px]">
                  <ImageView file={file} height={300} isConfidential={true} />
                </div>
              </div>

              {/* Metadata section */}
              <div className="w-[360px] col-span-1">
                <ImageMetadata
                  title={
                    index === 0 ? (
                      <span className="text-2xl font-semibold tracking-wide text-green-300">
                        Best Match
                      </span>
                    ) : (
                      <span className="text-2xl font-semibold tracking-wide text-orange-300">
                        Similar Match
                      </span>
                    )
                  }
                  properties={[
                    {
                      key: 'Fingerprinted by',
                      icon: <FingerPrintIcon className="w-5 h-5" />,
                      value: (
                        <div className="flex items-center justify-between w-full h-[21px] gap-3">
                          {author ? (
                            <UserView user={author} />
                          ) : (
                            <span>Loading…</span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formattedDate(match.issuedAt)}
                          </span>
                        </div>
                      ),
                      date: null,
                      color: null,
                    },
                    {
                      key: 'Shared with',
                      icon: null,
                      value: (
                        <>
                          {author ? (
                            <UserView user={author} />
                          ) : (
                            <span>Loading…</span>
                          )}
                        </>
                      ),
                      date: match.issuedAt,
                      color: null,
                    },
                    //   {
                    //   key: "",
                    //   icon: null,
                    //   value: (
                    //     <div className="flex items-center justify-between w-full h-[21px] gap-3 text-black font-semibold">
                    //       <div className="flex items-center justify-start h-[21px] gap-1">
                    //         <EyeIcon className="h-10"/>
                    //         <span>Made public by</span>
                    //       </div>
                    //       {author ? (<UserView user={author}/>) : (<span>Loading…</span>)}
                    //     </div>
                    //   ),
                    //   date: match.issuedAt,
                    //   color: "bg-green-500"
                    // }
                  ]}
                  confidence={(1 - match.distance) * 100}
                />
              </div>
            </div>
          );
        })}
        ;
      </div>
    </div>
  );
};

export default ImageDetails;
