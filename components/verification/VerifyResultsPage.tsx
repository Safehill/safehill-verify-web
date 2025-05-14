'use client'

import {useRouter} from 'next/navigation'
import MessageView from '@/components/shared/MessageView'
import PrimaryButton from '@/components/shared/PrimaryButton'
import ProvidedImage from "@/components/verification/ProvidedImage";
import ImageDetails from "@/components/verification/ImageDetails";
import {FileDetails, ImageMatch} from "@/components/verification/FileDetailsProps";
import {Button} from "@/components/shared/button";
import {ArrowLeft, Trash2} from "lucide-react";
import React from "react";

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

  const bestMatch = matches[0];
  return (
    <div className="space-y-7">
      {matches.length == 0 ? (
        <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
          <div className="my-5">
            <MessageView
              message="Sorry, we couldn't find any matches"
              sizeClass={4}
            />
          </div>
          <ProvidedImage file={fileDetails.file} imageData={fileDetails.imageData} />
        </div>
      ) : (
        <ImageDetails
          file={fileDetails.file}
          imageData={fileDetails.imageData}
          author={bestMatch.author}
          people="people"
          issuedAt={bestMatch.issuedAt}
          distance={bestMatch.distance}
        />
      )}

      <div className="py-10">
        <PrimaryButton
          label="Start a new search"
          onClick={onBack}
        />
      </div>
    </div>
  );
}

export default VerifyResultsPage;