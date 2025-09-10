import axios from "axios";
import { EventMetadata } from "@/data/events";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

const PINATA_BASE_URL = "https://api.pinata.cloud";

export const uploadFileToIPFS = async (file: File): Promise<string> => {
  const url = `${PINATA_BASE_URL}/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: `SomPass Image - ${file.name}`,
  });
  formData.append("pinataMetadata", metadata);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("Failed to upload file to IPFS.");
  }
};

export const uploadMetadataToIPFS = async (metadata: EventMetadata): Promise<string> => {
  const url = `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`;

  try {
    const response = await axios.post(
      url,
      {
        pinataContent: metadata,
        pinataMetadata: {
          name: `SomPass Event - ${metadata.title}`,
        },
      },
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS.");
  }
};

export const getIPFSUrl = (cid: string) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};