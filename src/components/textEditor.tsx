// import { Editor } from "@tinymce/tinymce-react";

// interface Props {
//   value: string;
//   OnChangeEditor: (e: string) => void;
// }
// interface BlobInfo {
//   blobUri(): string;
// }

// interface BlobCache {
//   create(name: string, file: File, base64: string): BlobInfo;
//   add(blobInfo: BlobInfo): void;
// }

// interface EditorUpload {
//   blobCache: BlobCache;
// }

// interface ActiveEditor {
//   editorUpload: EditorUpload;
//   insertContent(content: string): void;
// }

// interface TinyMCEInstance {
//   activeEditor: ActiveEditor;
// }


// declare global {
//   interface Window {
//     tinymce: TinyMCEInstance ;
//   }
// }



// const TextEditor = ({ value, OnChangeEditor }: Props) => {
//   console.log(value, "from textEditor");
//   const imageHandler = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
  
//     input.onchange = function () {
//       const file = (this as HTMLInputElement).files?.[0]; 
//       if (file && window.tinymce?.activeEditor?.editorUpload?.blobCache) {
//         const reader = new FileReader();
//         reader.onload = function () {
//           const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
//           const base64 = reader.result?.toString()?.split(",")[1]; 
//           if (file.name && base64) {
//             const blobInfo = blobCache.create(file.name, file, base64);
//             blobCache.add(blobInfo);
//             window.tinymce.activeEditor.insertContent(
//               `<img src="${blobInfo.blobUri()}" alt="${file.name}" />`
//             );
//           } else {
//             console.error("File name or base64 data is undefined.");
//           }
//         };
//         reader.readAsDataURL(file);
//       } else {
//         console.error("TinyMCE is not initialized or file is not selected.");
//       }
//     };
  
//     input.click();
//   };
//   const videoHandler = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "video/*");
//     input.onchange = function () {
//       const file = (this as HTMLInputElement).files?.[0]; 
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = function () {
//           window.tinymce.activeEditor.insertContent(
//             `<video controls src="${reader.result}" title="${file.name}"></video>`
//           );
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };
//   // const audioHandler = () => {
//   //   const input = document.createElement("input");
//   //   input.setAttribute("type", "file");
//   //   input.setAttribute("accept", "audio/*");
//   //   input.click();

//   //   input.onchange = async () => {
//   //     const file = input.files?.[0];
//   //     if (file) {
//   //       const reader = new FileReader();
//   //       reader.onload = function () {
//   //         const audioSrc = reader.result as string;
//   //         window.tinymce.activeEditor?.insertContent(
//   //           `<audio controls src="${audioSrc}" title="${file.name}"></audio>`
//   //         );
//   //       };
//   //       reader.readAsDataURL(file);
//   //     }
//   //   };
//   // };
//   const plugins = [
//     'advlist autolink lists link image charmap print preview anchor',
//     'searchreplace visualblocks code fullscreen',
//     'insertdatetime media table paste code help wordcount',
//     'textcolor' // Remove 'colorpicker' and 'textcolor'
//   ];

//   const toolbar = [
//     "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media audio | removeformat | help",
//   ];

//   return (
//     <div className="editor-container">
//       <Editor
//         initialValue={""}
//         apiKey="36yq0o12un80erkntz2avqgqzo23r7mjk5ooaap7n0qvihss"
//         init={{
//           height: 500,
//           menubar: "file edit view insert format tools table",
//           plugins: plugins.join(" "),
//           toolbar: toolbar.join(" "),
//           file_picker_callback: (
//             _callback,
//             _value,
//             meta
//           ) => {
//             if (meta && meta.filetype === "image") {
//               imageHandler();
//             } else if (meta && meta.filetype === "media") {
//               videoHandler();
//             }
//           },
//         }}
//         value={value}
//         onEditorChange={(content: string) => OnChangeEditor(content)}
//       />
//     </div>
//   );
// };
// export default TextEditor;
import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value: string;
  OnChangeEditor: (content: string) => void;
}

const TextEditor: React.FC<Props> = ({ value, OnChangeEditor }) => {
  const quillRef = useRef<ReactQuill>(null);
  const upload=(content:string)=>{
    OnChangeEditor(content)
  }
  // const uploadVideoHandler = async () => {
  //   try {
  //     const input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', 'video/*');
  //     input.click();

  //     input.onchange = async () => {
  //       const file = input.files?.[0];
  //       if (file) {
  //         const videoUrl = await uploadVideo(file);
  //         if (videoUrl) {
  //           const editor = quillRef.current?.getEditor();
  //           if (editor) {
  //             const range = editor.getSelection();
  //             editor.insertEmbed(range?.index || 0, 'video', videoUrl);
  //           }
  //         }
  //       }
  //     };
  //   } catch (error) {
  //     console.error('Failed to upload video:', error);
  //   }
  // };
  // const uploadImageHandler = async () => {
  //   try {
  //     const input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', 'image/*');
  //     input.click();

  //     input.onchange = async () => {
  //       const file = input.files?.[0];
  //       if (file) {
  //         const imageUrl = await uploadImage(file);
  //         if (imageUrl) {
  //           const editor = quillRef.current?.getEditor();
  //           if (editor) {
  //             const range = editor.getSelection();
  //             editor.insertEmbed(range?.index || 0, 'image', imageUrl);
  //           }
  //         }
  //       }
  //     };
  //   } catch (error) {
  //     console.error('Failed to upload image:', error);
  //   }
  // };
  const modules = {
    toolbar: {
      container: [
        [{ header: [] },  { 'font': [] }, {color:[]}, {background:[]}],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      // handlers: {
      //   image: uploadImageHandler,
      //   video: uploadVideoHandler,
      // },
    },
    
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video',
  ];



  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={upload}
      modules={modules}
      formats={formats}
    />
  );
};

export default TextEditor;


