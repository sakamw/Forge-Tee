import axiosInstance from "../api/axios";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "newisakrandom");
  const cloudName = "dv8k0z6na";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url as string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  createdAt: string;
  dateJoined?: string;
  updatedAt?: string;
}

export async function updateUserAvatarUrl(avatarUrl: string): Promise<User> {
  const response = await axiosInstance.patch("/users/avatar-url", {
    avatar: avatarUrl,
  });
  return response.data;
}
