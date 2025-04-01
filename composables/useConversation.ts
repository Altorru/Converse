import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./Auth";
import { getAvatarUrl } from "./Avatar";

export type Conversation = {
  id: string;
  label: string;
  avatar_url?: string | null;
  participants: string[];
  admin_id?: string | null;
  created_at: string;
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]); // State to store users
  const { user } = useAuth(); // Get the authenticated user

  // 🔄 Fetch users
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []);
    }
  };

  // 🔄 Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .contains("participants", JSON.stringify([user.id]));

    if (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
      return;
    }

    const updatedConversations = await Promise.all(
      data.map(async (conversation) => {
        if (conversation.participants.length === 2) {
          const otherUserId = conversation.participants.find(
            (id: any) => id !== user.id
          );
          if (!otherUserId) return conversation;

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("first_name, last_name, avatar")
            .eq("id", otherUserId)
            .single();

          const avatarUrl = await getAvatarUrl(profile?.avatar);

          if (!profileError && profile) {
            return {
              ...conversation,
              label: `${profile.first_name} ${profile.last_name}`,
              avatar_url: avatarUrl?.data?.signedUrl,
            };
          }
        }
        return conversation;
      })
    );

    setConversations(updatedConversations);
    setLoading(false);
  };

  // ➕ Create a new conversation
  const createConversation = async (label: string | null, participants: string[]) => {
    setLoading(true);
    const isGroup = participants.length > 2;

    const { data, error } = await supabase
      .from("conversations")
      .insert([
        { label, participants, admin_id: isGroup ? participants[0] : null },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
    } else {
      setConversations((prev) => [...prev, data]);
    }

    setLoading(false);
  };

  // ✏️ Update a conversation
  const updateConversation = async (
    id: string,
    updates: Partial<Conversation>
  ) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating conversation:", error);
    } else {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv))
      );
    }

    setLoading(false);
  };

  // ❌ Delete a conversation
  const deleteConversation = async (id: string) => {
    setLoading(true);

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting conversation:", error);
    } else {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
    }

    setLoading(false);
  };

  // 🔄 Fetch participants of a conversation
  const fetchParticipants = async (conversationId: string) => {
    setLoading(true);

    // Fetch the conversation to get participants and admin_id
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("participants, admin_id")
      .eq("id", conversationId)
      .single();

    //console.log("Conversation:", conversation);

    if (conversationError) {
      console.error("Error fetching conversation:", conversationError);
      setLoading(false);
      return null;
    }

    // Fetch participant details from the profiles table
    const { data: participants, error: participantsError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar")
      .in("id", conversation.participants);

    //console.log("Participants:", participants);

    if (participantsError) {
      console.error("Error fetching participants:", participantsError);
      setLoading(false);
      return null;
    }

    // Map participants to include admin status
    const participantsWithAdminStatus = participants.map((participant) => ({
      id: participant.id,
      first_name: participant.first_name,
      last_name: participant.last_name,
      avatar: participant.avatar,
      is_admin: conversation.admin_id ? participant.id === conversation.admin_id : false, // Check if the participant is the admin
    }));

    setLoading(false);
    return participantsWithAdminStatus;
  };

  // 🔄 Fetch users after deleting a conversation
  useEffect(() => {
    fetchUsers();
  }, [conversations]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    users, // Expose users state
    loading,
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    fetchParticipants, // Expose the fetchParticipants function
  };
};
