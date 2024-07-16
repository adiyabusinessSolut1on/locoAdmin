import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const uniqueIdentifier = `image_${Date.now()}_${Math.floor(
  Math.random() * 10000
)}`;

const uploadMultipleImage = async (
  folderName: string, 
  file: File, 
  setProgressStatus: (progress: number | null) => void
): Promise<string> => {
  try {
    const storageRef = ref(
      storage,
      `${folderName}/${uniqueIdentifier} ${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgressStatus(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
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
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadMultipleImage;
