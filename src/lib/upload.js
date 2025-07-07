const upload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    throw new Error("ImgBB upload error: " + error.message);
  }
};

export default upload;
