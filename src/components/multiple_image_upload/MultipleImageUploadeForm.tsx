import { useEffect, useState } from "react";
import uploadMultipleImage from "../../firebase_image/multipleImag";

interface StateProps {
  image: string[];
  imageNames: string[];
}



interface SetImageData {
  image: string[];
  imageSrc: File[];
  options: string[];
  result: string;
  content: string;
}

interface Props {
  imge: string[];
  setImageData: React.Dispatch<React.SetStateAction<SetImageData>>;
}
const MultipleImageUploadeForm = ({ setImageData, imge }:Props) => {
  console.log(imge);

  const extractImageName = (url:string) => {
    const parts = url.split(/\/|%2F/);
    const imagePart = parts[parts.length - 1];
    return imagePart.split("?")[0];
  };

  const [imageData, setimageData] = useState<StateProps>({
    image: imge.length !== 0 ? [...imge] : [],
    imageNames: imge.length !== 0 ? imge.map(extractImageName) : [],
  });
  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  useEffect(() => {
    if (imge.length !== 0) {
      setimageData({
        image: [...imge],
        imageNames: imge.map((url: string) => {
          const parts = url.split("/").pop()?.split("?");
          return parts ? parts[0] : "";
        }),
      });
    }
  }, [imge]);

  const handleImageChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    const folderName = "Test_Question"; // folder name

    if (selectedFiles) {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const imageUrl = await uploadMultipleImage(
          folderName,
          file,
          setProgressStatus
        );
        return { imageUrl, file };
      });

      const imagesData = await Promise.all(uploadPromises);

      setimageData((prev) => ({
        ...prev,
        image: imagesData.map((data) => data?.imageUrl),
        imageNames: imagesData.map((data) => data?.file?.name),
      }));

      setImageData((prev) => ({
        ...prev,
        image: imagesData.map((data) => data.imageUrl),
        imageSrc: imagesData.map((data) => data.file),
      }));
    }
  };

  return (
    // <form>
    <div className="relative grid items-center w-full h-full grid-cols-1 col-span-1 gap-2 md:gap-4 md:col-span-2 md:grid-cols-2">
      <input
        type="file"
        name="image"
        multiple
        onChange={handleImageChange}
        className={`px-2 py-[5px] ${
          progressStatus ? "pb-2" : ""
        } w-full text-sm border border-gray-400 focus-within:border-sky-400 rounded-md placeholder:text-gray-500 outline-none`}
        placeholder="Image URL"
        required
      />
      {progressStatus !== null && (
        <div className="absolute inset-0 z-10 flex items-end">
          <div
            className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
            style={{ width: `${progressStatus}%` }}
          ></div>
        </div>
      )}
      <ul className="text-sm font-semibold list-disc list-inside font-gray-600 font-mavenPro ">
        {imageData.imageNames.map((name, index) => (
          <li key={index}>{name.split("%20")?.[1]}</li>
        ))}
      </ul>
    </div>
    // </form>
  );
};

export default MultipleImageUploadeForm;
