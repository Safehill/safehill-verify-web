'use client';

import { useState } from 'react';
import { useRef } from 'react';
import React, { ChangeEvent } from 'react';
import { FileUploaderProps } from './FileDetailsProps';
import PrimaryButton from '@/components/shared/PrimaryButton';

const FileUploader: React.FC<FileUploaderProps> = ({
  currentFile,
  onFileChange,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);

  const handleFile = (file: File | null) => {
    onFileChange(file);
  };

  const handleDragEnter = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log('File has been added ' + e.dataTransfer.files);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleDragLeave = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDragOver = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('File has been added ' + e.target.files);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const openFileExplorer = async () => {
    inputRef.current.value = '';
    inputRef.current.click();
  };

  if (currentFile != null) {
    return (
      <div
        className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
      >
        <PrimaryButton
          label="Start over"
          onClick={() => {
            handleFile(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
      >
        The truth teller
      </h1>
      <p
        className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        Curious about the history of an image?
      </p>
      <p
        className="mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        Drop it here to match it against our authenticated images!
      </p>
      <div
        className="flex items-center justify-center py-20 mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-l"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        <form
          className={`${
            dragActive ? 'bg-blue-400' : 'bg-gray-100'
          }  p-4 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            multiple={true}
            onChange={handleFileSelected}
            accept="image/*"
          />

          <div className="py-40 px-40">
            Drop a file here or
            <div
              className="font-bold text-blue-600 cursor-pointer"
              onClick={openFileExplorer}
            >
              <u>Select it</u> to verify it
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploader;
