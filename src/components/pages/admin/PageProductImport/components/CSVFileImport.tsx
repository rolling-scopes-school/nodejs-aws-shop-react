import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useImportFile } from "~/queries/products";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | undefined>();
  const { data, refetch, remove } = useImportFile(
    encodeURIComponent((file as File)?.name)
  );

  useEffect(() => {
    const upload = async () => {
      const result = await fetch(data?.uploadUrl as string, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
      remove();
    };
    if (file && data) {
      upload();
    }
  }, [data?.uploadUrl]);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    await refetch();
    console.log("File to upload: ", (file as File).name);
    console.log("Uploading to: ", data?.uploadUrl);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
