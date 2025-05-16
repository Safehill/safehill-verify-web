## Install

```
brew install pnpm
pnpm install
pnpm run dev
```

## Rebuilding OpenCV JS + WASM

### Prerequisites:

- Xcode: Install Xcode from the Mac App Store.
- Homebrew: Install Homebrew using the instructions on their website.
- CMake: Install CMake using Homebrew: `brew install cmake`
- Enscriptem: Install Enscriptem using Homebrew: `brew install emscripten`

### Steps:

1. Download OpenCV and opencv_contrib

   - Download the source code for OpenCV and opencv_contrib from Github in a suitable location on your system (say `~/code`).

2. Create a build directory:

   - Navigate to the extracted OpenCV directory in your terminal.

   - Create a new directory for the build files with the same root folder: `mkdir -p ~/code/build`

   - Navigate into the build directory: `cd ~/code/build`

3. Configure CMake:

   - Run the following command to configure CMake:

   ```
   emmake cmake \
    -DWASM=ON -DCMAKE_CXX_FLAGS="-msimd128" -DCMAKE_C_FLAGS="-msimd128" \
    -DWITH_TBB=OFF -DWITH_ITT=OFF -DWITH_OPENMP=OFF -DWITH_PTHREADS_PF=OFF -DBUILD_SHARED_LIBS=OFF \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_TOOLCHAIN_FILE=/opt/homebrew//Cellar/emscripten/3.1.74/libexec/cmake/Modules/Platform/Emscripten.cmake \
    -DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules \
    -DBUILD_LIST=img_hash \
    -DBUILD_SHARED_LIBS=OFF \
    -DBUILD_opencv_js=ON \
    -DBUILD_TESTS=OFF \
    -DBUILD_PERF_TESTS=OFF \
    -DBUILD_DOCS=OFF \
    -DWITH_WEBP=ON \
    -DWITH_PNG=ON \
    -DWITH_JPEG=ON \
    -DWITH_IMGCODEC_HDR=ON \
    -DWITH_IMGCODEC_PFM=ON \
    -DWITH_IMGCODEC_PXM=ON \
    -DWITH_IMGCODEC_SUNRASTER=ON \
    -DENABLE_PIC=ON \
    ../opencv
   ```

   - Ensure the -DCMAKE_TOOLCHAIN_FILE path is set correctly based on your enscriptem installation. If you used homebrew and the default installation directory `/opt/homebrew`, you can find the right path using the following command `find /opt/homebrew/ | grep /cmake/Modules/Platform/Emscripten.cmake`.

   - Install the right list of contrib modules via comma-separated values in `DBUILD_LIST`. Minimize the dependencies to reduce the size of the output. Don't include unnecessary modules.

4. Build and Install:

   - Build the OpenCV library: `emmake make -j$(nproc)`

   - Install the library: `emmake make install`

5. Make sure the output files were added/update in the safehill-verify project
   - After the build is complete, you can find the output files in the `safehill-verify/deps` directory. Key files include:
     - opencv.js: The generated JavaScript file.
     - opencv.wasm: The WebAssembly binary.
     - These files can now be included in your React project.
