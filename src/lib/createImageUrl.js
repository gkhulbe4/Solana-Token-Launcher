export async function createImageUrl(img) {
  try {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("network", "public");
    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });
    const result = await response.json();
    console.log(result.data.cid);
    const url = `https://${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${
      result.data.cid
    }`;
    // console.log(url);
    return url;
  } catch (error) {
    console.log(error);
  }
}
