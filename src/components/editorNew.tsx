import { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import uploadImage from "../firebase_image/image";
import uploadVideo from "../firebase_video/video";
interface Props {
  value: string;
  OnChangeEditor: (e: string) => void;
}
const NewEditor = ({ value, OnChangeEditor }: Props) => {
  const editor = useRef(null);

  const handleUpload = async (file: File) => {
    let url = "";
    if (file.type.startsWith("image/")) {
      url = await uploadImage("images", file, () => { });
    } else if (file.type.startsWith("video/")) {
      url = await uploadVideo("videos", file, () => { });
    }
    return url;
  };
  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      theme: "light",

      extraButtons: [


        {
          tooltip: "Insert Video",
          icon: "video", // You can use a video-related icon here
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          popup: (editor: any,) => {
            const form = editor.create.fromHTML(
              `<form class="space-y-4 p-2">
       <div class="flex flex-col">
         <label class="text-sm font-medium text-gray-200">Video URL</label>
         <input type="text" 
                placeholder="https://" 
                class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                <span class="text-xs text-gray-200 font-semibold mt-1">Youtube, Vimeo, Dailymotion, Facebook url accepted</span> 
       </div>
       <div class="flex flex-col">
         <label class="text-sm font-medium text-gray-200">Alternative text</label>
         <input type="text" 
                placeholder="Alternative text" 
                class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
       </div>
       <div class="flex justify-end">
         <button type="submit" 
                 class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
           Insert Video
         </button>
       </div>
     </form>`
            );

            editor.e.on(form, "submit", (e: Event) => {
              e.preventDefault();
              const url = form?.querySelector?.(
                "input[placeholder='https://']"
              )?.value;
              const altText = form?.querySelector?.(
                "input[placeholder='Alternative text']"
              )?.value;
              console.log(url, "from video");
              // Embed the video element (using iframe)

              let embedUrl;

              // Check if the URL is a YouTube link
              if (url.includes("youtu.be")) {
                const videoId = url.split("youtu.be/")[1].split("?")[0];
                console.log(videoId);
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
              } else if (url.includes("youtube.com")) {
                const videoId = url.split("v=")[1]?.split("&")[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
              }
              // Check if the URL is a Vimeo link
              else if (url.includes("vimeo.com")) {
                const videoId = url.split("vimeo.com/")[1].split("?")[0];
                embedUrl = `https://player.vimeo.com/video/${videoId}`;
              } else if (url.includes("dailymotion.com")) {
                const videoId = url.split("video/")[1].split("?")[0];
                embedUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
              } else if (url.includes("facebook.com")) {
                const videoId = url.split("video/")[1].split("?")[0];
                embedUrl = `https://www.facebook.com/embed/video/${videoId}`;
              }
              // If it's another URL, try to use it directly
              else {
                embedUrl = url;
              }

              // Insert the iframe with the correct embed URL into the editor
              editor.s.insertHTML(
                `<jodit data-jodit-temp="1"contenteditable="false"draggable="true" data-jodit_iframe_wrapper="1" style="display: block;width: 300px;height: 300px;"data-jodit-wrapper_active="true"><iframe src="${embedUrl}" alt="${altText}"width="295"height="295"frameborder="0"allow="autoplay; encrypted-media"allowfullscreen></iframe></jodit>`
              );
              // close();
            });

            return form;
          },
        },

        {
          tooltip: "Insert Image",
          icon: "image", // You can use an image-related icon here
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          popup: (editor: any, close: () => void) => {
            const form = editor.create.fromHTML(
              `<form class="space-y-4 p-2">
       <div class="flex flex-col">
         <label class="text-sm font-medium text-gray-200">Image URL</label>
         <input type="text" 
                placeholder="https://exp.com/img.png" 
                class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
       </div>
       <div class="flex flex-col">
         <label class="text-sm font-medium text-gray-200">Alternative text</label>
         <input type="text" 
                placeholder="Alternative text" 
                class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
       </div>
       <div class="flex justify-end">
         <button type="submit" 
                 class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
           Insert Image
         </button>
       </div>
     </form>`
            );

            editor.e.on(form, "submit", (e: Event) => {
              e.preventDefault();
              const url = form?.querySelector?.(
                "input[placeholder='https://exp.com/img.png']"
              )?.value;
              const altText = form.querySelector(
                "input[placeholder='Alternative text']"
              ).value;
              console.log(url, "from image");
              // Insert the image element
              // editor.selection.insertImage(url);
              editor.s.insertHTML(`<img src="${url}" alt="${altText}"/>`);
              close();
            });

            return form;
          },
        },

        {
          tooltip: "Uploade Image and Video",
          name: "upload",
          icon: "file",

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exec: async (editor: any) => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*,video/*";
            fileInput.onchange = async () => {
              const file = fileInput.files ? fileInput.files[0] : null;
              if (file) {
                const url = await handleUpload(file);
                if (file.type.startsWith("image/")) {
                  editor.selection.insertImage(url);
                } else if (file.type.startsWith("video/")) {
                  // editor.selection.(url);
                  editor.selection.insertHTML(
                    // `<video src="${url}" controls></video>`
                    `<div class="se-component se-video-container __se__float-none">
                    <figure style="width: 431px; height: 242px; padding-bottom: 242px;">
                    <iframe src=${url} data-proportion="true" style="width: 431px; height: 242px;">
                    </iframe>
                    </figure></div>`
                  );
                }
              }
            };
            fileInput.click();
          },
        },
      ],
    }),
    []
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        config={config}
        value={value}
        onChange={(content) => OnChangeEditor(content)}
      />
    </>
  );
};

export default NewEditor;
