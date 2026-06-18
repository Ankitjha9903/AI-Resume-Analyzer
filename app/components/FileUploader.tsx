import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onfileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onfileSelect }: FileUploaderProps) => {
  //   const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const File = acceptedFiles[0] || null;
      onfileSelect?.(File);
    },
    [onfileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf, .doc,.docx, .jpeg , .jpg"] },
      maxSize: 20 * 1024 * 1024,
    });
  const file = acceptedFiles[0] || null;
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          <div className="mx-auto w-16 h-16 flex items-center justify-center ">
            <img src="/icons/info.svg" alt="Upload" className="size-20" />
          </div>
          {file ? (
            <div>
              <p className="text-sm font-medium">{file.name}</p>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-500">
                <span className="click to upload"></span>
                Drag and Drop
              </p>
              <p className="text-lg text-gray-500">PDF (Max size 20PX)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
