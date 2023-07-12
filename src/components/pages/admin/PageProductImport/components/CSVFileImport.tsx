import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestConfig } from 'axios';

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

    if(file) {
      const token = localStorage.getItem('authorization_token');
      const requestParams: AxiosRequestConfig<any> = {
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        }
      };
      if(token) {
        requestParams.headers = requestParams.headers ? {...requestParams.headers, Authorization: `Basic ${token}`} : {Authorization: `Basic ${token}`};
      }

      const response = await axios(requestParams);

      console.log("Uploading to: ", response.data.message);
      const result = await fetch(response.data.message, {
        method: "PUT",
        body: file,
      });

      console.log("Result: ", result);
      setFile(undefined);
    } else {
      console.log('error while uploading, file is undefined');
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
