import { useRef } from "react";
import JoditEditor from "jodit-react";
interface Props {
  value: string;
  OnChangeEditor: (e: string) => void;
}
const NewEditor = ({ value, OnChangeEditor }: Props) => {
  const editor = useRef(null);

  return (
    <>
      <JoditEditor
        ref={editor}
        value={value}
        onChange={(content) => OnChangeEditor(content)}
      />
    </>
  );
};

export default NewEditor;
