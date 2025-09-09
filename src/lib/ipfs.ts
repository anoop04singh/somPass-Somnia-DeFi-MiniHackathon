import axios from "axios";
import { EventMetadata } from "@/data/events";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

const PINATA_BASE_URL = "https://api.pinata.cloud";

export const uploadToIPFS = async (metadata: Omit<EventMetadata, 'imageUrl'>): Promise<string> => {
  const url = `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`;

  const dataToUpload = {
    ...metadata,
    // Using a placeholder image for now, this can be replaced with image upload logic
    imageUrl: "https://gateway.pinata.cloud/ipfs/QmY3s5s6d8f9gH2j4k5m6n7p8q9r1s2t3u4v5w6x7y8z9",
  };

  try {
    const response = await axios.post(
      url,
      {
        pinataContent: dataToUpload,
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
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS.");
  }
};

export const getIPFSUrl = (cid: string) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};