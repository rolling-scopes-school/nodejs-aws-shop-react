import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const getTokenFromLocalStorage = (): string | null => {
    return localStorage.getItem("authorization_token");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      console.log("file", file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    try {
      const authToken = getTokenFromLocalStorage();
      if (!authToken) {
        console.error("Authorization token not found in localStorage");
        return;
      }

      const headers = {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      };

      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url,
        headers,
        params: {
          name: encodeURIComponent((file as File).name),
        },
      });
      console.log("File to upload: ", (file as File).name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data.url, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
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
