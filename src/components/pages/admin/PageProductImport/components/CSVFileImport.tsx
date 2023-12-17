import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestHeaders } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

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

    const auth_token = localStorage.getItem("authorization_token");
    console.log("auth_token", auth_token);

    const headers: AxiosRequestHeaders = {};
    if (auth_token) {
      headers["Authorization"] = `Basic ${auth_token}`;
    }

    if (!file) {
      console.log("No file to upload");
      return;
    }

    // Get the presigned URL
    try {
      const response = await axios({
        method: "GET",
        url,
        headers: {
          ...headers,
        },
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      console.log('response', response.data);

      const presignedUrl = new URL(response.data);
      if (!presignedUrl) {
        console.error("Url not exist!");
        return;
      }

      console.log("PresignedUrl: ", presignedUrl);
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });

      console.log("Result: ", result);
      setFile(undefined);
    } catch (error: any) {
      console.error('ERROR:',  error);
      console.error('ERROR data:',  error.data);
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
