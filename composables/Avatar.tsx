import { supabase } from "./supabaseClient";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const uploadAvatar = async (fileUri: string) => {
  try {
    // Retrieve the current user's ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("User is not authenticated");
    }
    const userId = userData.user.id;

    // Compress the image to 64x64 pixels
    const compressedImage = await ImageManipulator.manipulateAsync(
      fileUri,
      [{ resize: { width: 64, height: 64 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Read the compressed file as base64
    const base64File = await FileSystem.readAsStringAsync(compressedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to ArrayBuffer
    const binaryFile = Uint8Array.from(atob(base64File), (char) =>
      char.charCodeAt(0)
    ).buffer;

    // Generate the file name
    const fileName = `avatar.jpg`;

    // Upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(userId+"/"+fileName, binaryFile, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError.message);
      return null;
    }

    //console.log("Uploaded avatar path:", uploadData.path);

    // Update the user's profile with the new avatar URL
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar: uploadData.path })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError.message);
      return null;
    }

    //console.log("Profile updated successfully with new avatar.");
    return uploadData;
  } catch (error) {
    console.error("Error processing file:", error);
    return null;
  }
};

export const getAvatarUrl = async (avatar: string) => {
  try {
    //console.log("Fetched avatar path:", avatar);
    const avatarUrl = supabase.storage.from("avatars").getPublicUrl(avatar);

    //console.log("Avatar URL:", avatarUrl);
    return avatarUrl;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return null;
  }
};

export const getCurrentProfileAvatar = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("User is not authenticated");
    }
    const userId = userData.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("avatar")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    if (!profileData?.avatar) {
      throw new Error("Avatar not found in profile");
    }

    const avatarUrl = supabase.storage
      .from("avatars")
      .createSignedUrl(profileData.avatar, 60);

    return (await avatarUrl).data?.signedUrl || null;
  } catch (error) {
    console.error(
      "Error fetching current profile avatar:",
      (error as Error).message
    );
    return null;
  }
};
