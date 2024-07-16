import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "../../firebase";


const uniqueIdentifier = `video_${Date.now()}_${Math.floor(
  Math.random() * 10000
)}`;

const uploadVideo = async (
  fileName: string,
  file: File,
  setProgressStatus: (progress: number | null) => void
): Promise<string> => {
  try {
    const storageRef = ref(
      storage,
      `${fileName.replace(/\s+/g, "")}/${uniqueIdentifier}_${file.name}`
    );

    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // Update the progress status
          setProgressStatus(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading video:", error);
          setProgressStatus(null);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProgressStatus(null);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setProgressStatus(null);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

export default uploadVideo;
