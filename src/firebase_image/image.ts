import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadTaskSnapshot,
  StorageError,
} from "firebase/storage";
import { storage } from "../../firebase";


const uniqueIdentifier = `image_${Date.now()}_${Math.floor(
  Math.random() * 10000
)}`;

const uploadImage = async (
  fileName: string,
  file: File,
  setProgressStatus: (progress: number | null) => void
): Promise<string> => {
  try {
    const storageRef = ref(
      storage,
      `${fileName.replace(/\s+/g, "")}/${uniqueIdentifier}_${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgressStatus(progress);
      },
      (error: StorageError) => {
        console.error("Error uploading image:", error);
        throw error;
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProgressStatus(null);
        return downloadURL;
      }
    );
    await uploadTask;

    return getDownloadURL(uploadTask.snapshot.ref);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
