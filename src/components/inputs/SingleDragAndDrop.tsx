import React, { FC, useState, useEffect } from "react";
import { CloudArrowUp, X } from "@phosphor-icons/react";
import { uploadToAWSAndGetLink } from "@/utils";
import { ToastContainer, toast } from "react-toastify";
import { S3 } from "aws-sdk";

interface SingleDragAndDropProps {
  //   statements?: any;
  setFile?: any;
}

const SingleDragAndDrop: FC<SingleDragAndDropProps> = ({ setFile }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile.type !== "text/csv") {
      toast("Only csv file is allowed");
    } else {
      // console.log(droppedFiles);
      setSelectedFile(droppedFile);
    }
  };

  const handleInputChange = (e: any) => {
    const selected = e.target.files[0];
    console.log(selected);
    setSelectedFile(selected);
  };

  useEffect(() => {
    console.log(selectedFile);

    const uploadFile = async () => {
      if (!selectedFile) return;

      try {
        const s3 = new S3({
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
          region: process.env.NEXT_PUBLIC_AWS_S3_REGION_NAME,
        });

        const initialFileName = selectedFile.name.replace(/\s/g, "");
        const fileNameParts = initialFileName.split(".");
        const fileName = fileNameParts[0]; // File name without extension
        const fileExtension = fileNameParts[1]; // File extension

        // Generate a random string
        const randomString = String(Date.now()); // Replace with your random string generation logic

        // Create the new file name with the random string appended
        const newFileName = `${fileName}${randomString}.${fileExtension}`;

        // Define the S3 bucket name and key for the uploaded file
        const bucketName = "monehqapi-publics";
        const key = `upload/${newFileName}`;

        // Prepare the parameters for the upload
        const params: S3.Types.PutObjectRequest = {
          Bucket: bucketName,
          Key: key,
          Body: selectedFile,
          ACL: "public-read", // Set the ACL to make the uploaded file publicly accessible
        };

        // Upload the file to AWS S3
        await s3.upload(params).promise();

        // Generate the file link using the bucket name and key
        const fileLink = `https://${bucketName}.s3.amazonaws.com/${key}`;

        // const link = await uploadToAWSAndGetLink(selectedFile);
        console.log(fileLink);
        setFile({ name: fileName, ext: fileExtension, link: fileLink });
      } catch (error: any) {
        console.log(error.message);
      }
    };

    uploadFile();
  }, [selectedFile, setFile]);

  return (
    <div
      className={`flex flex-col gap-y-2 justify-center items-center gap-x-2 p-3 h-[166px] rounded-sm border-[1px] border-dashed border-[#B3B5CE]`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CloudArrowUp size={32} color="#707070" />
      <p className="text-[#04050F] font-medium text-[14px] leading-[20px]">
        <label htmlFor="upload" className="text-[#00085A] cursor-pointer">
          Click to upload
        </label>{" "}
        <input
          id="upload"
          className="hidden"
          type="file"
          accept=".xlsx"
          onChange={handleInputChange}
        />
        or drag your file here
      </p>
      <p className="text-[#00085A] text-[12px] leading-[18px]">
        Maximum File size: 50MB
        {/* <a
          href="/MoneyHQ-BankStatement1687553920409.xlsx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download sample (102kb)
        </a> */}
      </p>
      {/* {file ? (
        <div>
          <p>File Selected:</p>
          <p>{file.name}</p>
        </div>
      ) : (
        <div>
          <p>Drag and drop a file here</p>
          <input type="file" accept=".pdf" onChange={handleInputChange} />
        </div>
      )} */}
    </div>
  );
};

export default SingleDragAndDrop;
