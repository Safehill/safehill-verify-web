'use client'

import {useRouter} from 'next/navigation'
import MessageView from '@/components/shared/MessageView'
import PrimaryButton from '@/components/shared/PrimaryButton'
import ProvidedImage from "@/components/verification/ProvidedImage";
import ImageDetails from "@/components/verification/ImageDetails";
import {FileDetails, ImageMatch} from "@/components/verification/FileDetailsProps";
import React from "react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {Button} from "@/components/shared/button";
import {ArrowLeft} from "lucide-react";
import {DownloadAppButtons} from "@/components/home/DownloadAppButtons";

const VerifyResultsPage = ({
  fileDetails,
  matches,
  onBack,
}: {
  fileDetails: FileDetails;
  matches: ImageMatch[] | null;
  onBack: () => void;
}) => {
  const router = useRouter();

  if (!matches) {
    return (
      <div className="text-center p-10">
        <MessageView message="An unexpected error occurred" sizeClass={4} />
        <div className="mt-4">
          <PrimaryButton label="Go back" onClick={() => router.push('/verify')} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7 pt-10 w-full">
      {matches.length == 0 ? (
        <>
          <div className="z-10 w-full px-2">
            <div className="my-10 w-full flex flex-col items-center justify-center text-center">
              <ExclamationTriangleIcon className="w-16 h-16 opacity-90 text-orange-300" />
              <MessageView
                message="No matches in our records"
                sizeClass={4}
              />
              <div className="text-center p-5 opacity-80 text-sm md:text-lg text-neutral-600">
                Nothing similar has been claimed via Safehill yet
              </div>
            </div>

            <ProvidedImage file={fileDetails.file} properties={[{
              key: "File name",
              icon: null,
              value: (<span>{fileDetails.file.name}</span>)
            },{
              key: "Image size",
              icon: null,
              value: (<span>{fileDetails.imageData.width + ' X ' + fileDetails.imageData.height}</span>)
            }]} />
          </div>
          <div className="w-full flex flex-col items-center py-10 opacity-95 gap-8">
            <div className="bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-center font-display text-md md:text-xl text-transparent">
              Do you want to claim rights to this image?
              <br />
              Download the Safehill app!
            </div>
            <div className="text-sm md:text-md">
              We will verify its authenticity and make you the owner
            </div>
            <div className="flex flex-col sm:flex-row justify-start gap-4">
              <DownloadAppButtons className="w-[160px] sm:w-[200px]"/>
            </div>
          </div>
        </>
      ) : (
        <ImageDetails
          file={fileDetails.file}
          imageData={fileDetails.imageData}
          matches={matches}
        />
      )}

      <div className="w-full flex flex-col items-center py-10 opacity-95 gap-5">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="w-14 h-14"/>
          Authenticate something else
        </Button>
      </div>
    </div>
  );
}

export default VerifyResultsPage;