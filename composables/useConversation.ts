import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./Auth";

export type Conversation = {
  id: string;
  label: string;
  participants: string[];
  admin_id?: string | null;
  created_at: string;
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth(); // Récupérer l'utilisateur connecté

  // 🔄 Récupérer les conversations où l'utilisateur est participant
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

    // 🔹 Mise à jour du label pour les conversations DM (2 participants)
    const updatedConversations = await Promise.all(
      data.map(async (conversation) => {
        if (conversation.participants.length === 2) {
          const otherUserId = conversation.participants.find(
            (id: any) => id !== user.id
          );
          if (!otherUserId) return conversation;

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", otherUserId)
            .single();

          if (!profileError && profile) {
            return {
              ...conversation,
              label: `${profile.first_name} ${profile.last_name}`,
            };
          }
        }
        return conversation;
      })
    );

    setConversations(updatedConversations);
    setLoading(false);
  };

  // ➕ Créer une nouvelle conversation
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

  // ✏️ Modifier une conversation (ex: changer le label ou les participants)
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

  // ❌ Supprimer une conversation
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

  // Charger les conversations au montage
  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
  };
};
