'use client';

import ImageMetadata from './ImageMetadata';
import ImageView from './ImageView';
import {ImageMatch, ImageMetadataProps} from './FileDetailsProps';
import MessageView from '../shared/MessageView';
import ProvidedImage from './ProvidedImage';
import {FingerPrintIcon} from "@heroicons/react/24/outline";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/shared/avatar";
import {formattedDate} from "@/lib/utils";
import LineSeparator from "@/components/home/LineSeparator";

const ImageDetails: React.FC<ImageMetadataProps> = ({
  file,
  imageData,
  matches
}) => {
  return (
    <div className="z-10 w-full px-5 xl:px-0">
      <ProvidedImage file={file} properties={[{
        key: "File name",
        icon: null,
        value: (<span>{file.name}</span>)
      },{
        key: "Image size",
        icon: null,
        value: (<span>{imageData.width + ' X ' + imageData.height}</span>)
      }]} />

      <MessageView
        message={matches.length == 1 ? "1 similar matches" : matches.length + " similar matches"}
        sizeClass={2} />

      <LineSeparator />

      <div className="my-10">
        {matches.map((match: ImageMatch, index: number) => (
          <div key={match.globalIdentifier}
               className="grid w-full grid-cols-2 gap-5 px-5 xl:px-0 py-2 mb-10 opacity-95">
            {/* Image section (flex-grow, full height) */}
            <div className="col-span-1 flex justify-end">
              <div className="h-[300px]">
                <ImageView file={file} height={300} />
              </div>
            </div>

            {/* Metadata section (fixed width) */}
            <div className="w-[360px] h-[450px] col-span-1">
              <ImageMetadata
                title={
                  index == 0
                    ? (<span className="text-2xl font-semibold tracking-wide text-green-300">Best Match</span>)
                    : (<span className="text-2xl font-semibold tracking-wide text-orange-300">Similar Match</span>)
                }
                properties={[{
                  key: "Fingerprinted by",
                  icon: (<FingerPrintIcon className="w-5 h-5" />),
                  value: (<>
                    <div className="flex flex-cols justify-start items-center gap-2" style={{height: "21px"}}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={match.author} />
                        <AvatarFallback>{match.author}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{match.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formattedDate(match.issuedAt)}</span>
                  </>),
                  date: null
                }, {
                  key: "Shared with",
                  icon: null,
                  value: (<>
                    <div className="flex flex-cols justify-start items-center gap-2" style={{height: "21px"}}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={match.author} />
                        <AvatarFallback>{match.author}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">Frank Galoppo</span>
                    </div>
                  </>),
                  date: match.issuedAt
                }]}
                confidence={match.distance * 10}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDetails;
