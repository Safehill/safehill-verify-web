'use client';

import { FileUp, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Card, CardContent } from '@/components/shared/card';
import { Input } from '@/components/shared/input';
import ImageView from '@/components/verification/ImageView';
import type { FileUploaderProps } from './FileDetailsProps';

function typeOf(file: File): string | null {
  let suffix = null;
  const index = file.name.lastIndexOf('.');
  if (index > -1) {
    suffix = file.name.substring(index + 1);
  }
  return file.type || suffix;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  isLoading,
  setIsLoading,
  onSubmit,
}) => {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const addFiles = (eventFiles: File[]) => {
    if (eventFiles.length < 1) {
      return;
    }

    setIsLoading(true);
    onSubmit(eventFiles);
    return;

    // const existingFileNames: string[] = stagedFiles.map((f: File) => { return f.name });
    //
    // let newFiles = stagedFiles
    // eventFiles.forEach((f: File) => {
    //   if (existingFileNames.includes(f.name)) {
    //     return;
    //   }
    //   newFiles = [...newFiles, f];
    // });
    // setStagedFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (file: File) => {
    const newFiles = stagedFiles.filter((f) => {
      return f.name !== file.name;
    });
    setStagedFiles(newFiles);
  };

  const authenticateFiles = () => {
    setIsLoading(true);
    onSubmit(stagedFiles);
  };

  return (
    <div className="z-10 w-full max-w-3xl px-5 xl:px-0 pt-32">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-semibold text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] pb-10"
        style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
      >
        Image Authentication
      </h1>
      <p
        className="mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        Drop an image to discover its history
      </p>
      <div
        className="flex items-center justify-center py-10 mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-l w-full"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        <Card className="w-full border-0 shadow-none">
          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".png,.jpg,.heic"
                multiple
              />
              <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">Drop your image here</h3>
              <p className="text-sm text-muted-foreground mb-2">
                or click to select a file
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .png, .jpg and .heic files up to 500MB
              </p>
            </div>

            {stagedFiles.length > 0 && (
              <div className="border rounded-md overflow-hidden shadow-sm">
                {/* Header row */}
                <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 md:text-sm text-xs font-semibold text-left px-5">
                  <div className="col-span-5">Ready for authentication</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* File rows */}
                <div className="divide-y">
                  {stagedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="grid grid-cols-6 gap-4 p-3 items-center text-sm text-left"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                          <ImageView
                            file={file}
                            height={35}
                            isConfidential={false}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeOf(file)} •{' '}
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <div className="col-span-1 flex gap-1 pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          {/*<CardFooter className="flex justify-end">*/}
          {/*  <Button*/}
          {/*    onClick={authenticateFiles}*/}
          {/*    disabled={stagedFiles.length === 0 || isLoading}*/}
          {/*  >*/}
          {/*    {isLoading ? (*/}
          {/*      <>*/}
          {/*        <Loader2 className="h-4 w-4 animate-spin" />*/}
          {/*        Authenticating image...*/}
          {/*      </>*/}
          {/*    ) : stagedFiles.length > 0 ? (*/}
          {/*      <>*/}
          {/*        <Wand2 className="h-4 w-4" />*/}
          {/*        Authenticate {stagedFiles.length} Image{stagedFiles.length == 1 ? "" : "s"}*/}
          {/*      </>*/}
          {/*    ) : (*/}
          {/*      <>No file selected</>*/}
          {/*    )}*/}
          {/*  </Button>*/}
          {/*</CardFooter>*/}
        </Card>
      </div>
    </div>
  );
};

export default FileUploader;
