import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "react-query";
import { instance } from "@/utils/axios";
import { useToast } from "react-native-toast-notifications";
import { Post } from "@/interface/Post";
import Loader from "@/components/Loader";
import { Comment } from "@/interface/Comment";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

const PostScreen = () => {
  const toast = useToast();
  const { id } = useLocalSearchParams();
  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isErrorPost,
  } = useQuery<Post>(
    ["post", id],
    async () => {
      const response = await instance.get(`/posts/${id}`);
      return response.data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
      onError: () => {
        toast.show("Failed to get post", {
          type: "danger",
        });
      },
    }
  );

  const {
    data: comments,
    isLoading: isLoadingComments,
    isError: isErrorComments,
  } = useQuery<Comment[]>(
    ["comments", id],
    async () => {
      const response = await instance.get(`/posts/${id}/comments`);
      return response.data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
      onError: () => {
        toast.show("Failed to get comments", {
          type: "danger",
        });
      },
    }
  );

  if (isLoadingPost || isLoadingComments) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader />
      </View>
    );
  }

  if (isErrorPost || isErrorComments) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error getting post or comments</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          className="bg-[#EDEDED] mx-auto mb-3 p-3 rounded-full"
          style={{
            height: 50,
            width: 50,
          }}
        >
          <FontAwesome5 name="user-alt" size={24} color="#8280FF" />
        </View>
        <View className="p-4">
          <Text
            className="text-blue-600 font-semibold text-[18px] mb-2 text-start"
            style={{ flex: 1 }}
          >
            {post?.title}
          </Text>
          <Text className="text-gray-500 text-start font-medium">
            {post?.body}
          </Text>
        </View>
        <View className="p-4">
          <Text className="font-bold text-xl ">Comments</Text>
          {comments?.map((comment) => (
            <View
              key={comment.id}
              className="bg-white p-3 mb-3 rounded-md border border-gray-200"
            >
              <Text className="text-blue-600 text-start">{comment.name}</Text>
              <Text className="text-gray-500 text-start">{comment.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostScreen;
