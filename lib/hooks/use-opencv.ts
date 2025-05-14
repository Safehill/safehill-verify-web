import { useState, useEffect } from 'react';
// import cv from '../../deps/opencv_version';
import cv from '@techstark/opencv-js';

export function useOpenCV() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    cv.onRuntimeInitialized = () => {
      setIsLoaded(true);
    };
  }, []);
  
  const calculatePHash = (imageData: ImageData): string => {
    if (!isLoaded) {
      throw new Error('OpenCV is not loaded yet');
    }

    const img = cv.matFromImageData(imageData);
    const grayImg = new cv.Mat();
    cv.cvtColor(img, grayImg, cv.COLOR_RGBA2GRAY);
    
    const resizedImg = new cv.Mat();
    cv.resize(grayImg, resizedImg, new cv.Size(32, 32));
    
    const floatImg = new cv.Mat();
    resizedImg.convertTo(floatImg, cv.CV_32F);
    
    const dct = dct2dMat(floatImg);
    
    const subDct = dct.roi(new cv.Rect(0, 0, 8, 8));
    const mean = cv.mean(subDct)[0];
    
    let hash = '';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        hash += subDct.floatAt(i, j) > mean ? '1' : '0';
      }
    }
    
    img.delete();
    grayImg.delete();
    resizedImg.delete();
    floatImg.delete();
    dct.delete();
    subDct.delete();
    
    return binaryToHex(hash);
  };

  function binaryToHex(binaryString: string): string {
    // Ensure the binary string length is a multiple of 4
    while (binaryString.length % 4 !== 0) {
      binaryString = '0' + binaryString;
    }
  
    let hexString = '';
    for (let i = 0; i < binaryString.length; i += 4) {
      const chunk = binaryString.substr(i, 4);
      const hexDigit = parseInt(chunk, 2).toString(16);
      hexString += hexDigit;
    }
  
    return hexString;
  }

  function binaryToUint8List(binaryString: string): number[] {
    // Pad the binary string with leading zeros if needed
    while (binaryString.length % 8 !== 0) {
      binaryString = '0' + binaryString;
    }
  
    // Convert each 8-bit chunk to an integer
    const uint8List = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      const byte = binaryString.substr(i, 8);
      uint8List.push(parseInt(byte, 2));
    }
  
    return uint8List;
  }
  
  
  /**
  * Perform a 1D Discrete Cosine Transform (DCT-II).
  * @param input - An array of real numbers.
  * @returns An array containing the DCT coefficients.
  */
  function dct(input: number[]): number[] {
    const N = input.length;
    const result = new Float64Array(N); // Memory-efficient array for results
    const factor = Math.PI / N; // Precompute the factor to save computations
    
    for (let k = 0; k < N; k++) {
      let sum = 0;
      for (let n = 0; n < N; n++) {
        sum += input[n] * Math.cos(factor * (n + 0.5) * k);
      }
      result[k] = sum * (k === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N)); // Normalize
    }
    
    return Array.from(result); // Convert to array for flexibility
  }
  
  /**
  * Perform a 2D Discrete Cosine Transform (DCT-II).
  * @param input - A 2D array of real numbers (NxN matrix).
  * @returns A 2D array containing the DCT coefficients.
  */
  function dct2d(input: number[][]): number[][] {
    const N = input.length;
    const temp = Array.from({ length: N }, () => new Float64Array(N));
    const result = Array.from({ length: N }, () => new Float64Array(N));
    
    // Apply DCT to rows
    for (let i = 0; i < N; i++) {
      const row = input[i];
      const dctRow = dct(row);
      for (let j = 0; j < N; j++) {
        temp[i][j] = dctRow[j];
      }
    }
    
    // Apply DCT to columns
    for (let j = 0; j < N; j++) {
      const column = temp.map((row) => row[j]);
      const dctColumn = dct(column);
      for (let i = 0; i < N; i++) {
        result[i][j] = dctColumn[i];
      }
    }
    
    return result.map((row) => Array.from(row)); // Convert to 2D array
  }
  
  /**
  * Perform a 2D DCT on an OpenCV Mat object and return the result as a new Mat.
  * @param matInput - A single-channel OpenCV Mat object.
  * @returns A new OpenCV Mat containing the 2D DCT result.
  */
  function dct2dMat(matInput: cv.Mat): cv.Mat {
    if (matInput.channels() !== 1) {
      throw new Error('Input Mat must be single-channel.');
    }
    
    const rows = matInput.rows;
    const cols = matInput.cols;
    
    // Convert Mat to a 2D JavaScript array
    const input2D: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row = matInput.row(i).data32F; // Extract row as Float32Array
      input2D.push(Array.from(row));
    }
    
    // Perform the 2D DCT
    const dctResult2D = dct2d(input2D);
    
    // Flatten the 2D array back to a 1D array for Mat
    const flattened = dctResult2D.flat();
    
    // Convert the flattened array back to a Mat
    const matOutput = cv.matFromArray(rows, cols, cv.CV_32F, flattened);
    
    return matOutput;
  }
  
  return { isLoaded, calculatePHash };
}
