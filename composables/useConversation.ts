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
  const { user } = useAuth(); // Récupérer l'utilisateur connecté

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
  const createConversation = async (label: string, participants: string[]) => {
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
  };
};
