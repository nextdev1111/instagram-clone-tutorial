import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { uploadPost as uploadPostAction } from "../redux/actions/postActions";
import { RootState, useAsyncDispatch } from "../redux/store";
import { postLoading } from "../utils/enums";

type Props = {};

function CreatePost({}: Props) {
  const { error, loading } = useSelector((state: RootState) => state.post);
  const [toastId, setToastId] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  );
  const filePickerRef = useRef(null);

  const asyncDispatch = useAsyncDispatch();

  const router = useRouter();

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files) {
      return;
    }

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      if (!readerEvent.target) {
        return;
      }
      setSelectedFile(readerEvent.target.result?.toString());
    };
  };

  const uploadPost = () => {
    if (!selectedFile) {
      return toast.error("Please add an image to upload a post.");
    }
    asyncDispatch(uploadPostAction({ caption, imageUrl: selectedFile }));
  };

  useEffect(() => {
    if (loading === postLoading.CREATE) {
      const toastId = toast.loading("Creating post");
      setToastId(toastId);
    }

    if (error && toastId) {
      toast.error(error, {
        id: toastId,
      });
    }

    if (loading === postLoading.IDLE && toastId && !error) {
      toast.success("Post Created", {
        id: toastId,
      });

      setSelectedFile(undefined);
      setCaption("");
    }
  }, [loading]);

  return (
    <div className="mt-10">
      <div className="rounded-lg bg-zinc-100 p-3 space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Post</h1>
          <button
            className="font-medium bg-sky-500 rounded-md px-3 py-1 text-white"
            onClick={uploadPost}
          >
            Create
          </button>
        </div>

        {/* File Selector */}
        <div onClick={() => setSelectedFile(undefined)}>
          {selectedFile ? (
            <img
              src={selectedFile}
              alt=""
              className="rounded-md cursor-pointer max-w-full"
            />
          ) : (
            <>
              {/* Add Post Button */}
              <button
                className="rounded-md px-3 py-1 bg-stone-200 text-black font-medium cursor-pointer"
                onClick={() =>
                  filePickerRef.current
                    ? (filePickerRef.current as any).click()
                    : null
                }
              >
                Add Image
              </button>

              {/* hidden input */}
              <input
                type="file"
                hidden
                ref={filePickerRef}
                onChange={addImageToPost}
              />
            </>
          )}
        </div>

        {/* caption */}
        <div>
          <input
            type="text"
            className="outline-none p-3 rounded-md w-full font-medium placeholder:font-normal"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
