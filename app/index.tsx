import Loader from "@/components/Loader";
import { Post } from "@/interface/Post";
import { instance } from "@/utils/axios";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const PostsSCreen = () => {
  const toast = useToast();
  const { data, isLoading, isError } = useQuery<Post[]>(
    "posts",
    async () => {
      const response = await instance.get("/posts");
      return response.data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError: () => {
        toast.show("Failed to get posts", {
          type: "danger",
        });
      },
    }
  );
  const router = useRouter();
  return (
    <SafeAreaView className="bg-white flex-1">
      <Text className="text-center font-bold text-xl mt-6 py-2 ">Posts</Text>
      <Pressable
        onPress={() => {
          router.push("/add");
        }}
        className="flex-row items-center bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ml-auto mr-2"
      >
        <Text className="text-white font-medium mr-1">Add Post</Text>
        <Entypo name="plus" size={24} color="white" />
      </Pressable>
      {isLoading ? (
        <View className="items-center justify-center h-[90%]">
          <Loader />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text>Error getting posts</Text>
        </View>
      ) : (
        <ScrollView className="px-4 mt-4">
          {data?.map((post) => (
            <View className="bg-white p-3 mb-3 rounded-md border border-gray-200">
              <Pressable
                onPress={async () => {
                  try {
                    toast.show("Deleting Post", {
                      type: "warning",
                    });
                    await instance.delete(`/posts/${post.id}`);
                    toast.show("Post Deleted", {
                      type: "success",
                    });
                  } catch (error) {
                    toast.show("Failed to delete post", {
                      type: "danger",
                    });
                  }
                }}
                className="ml-auto mb-5"
              >
                <MaterialIcons name="delete" size={24} color="rgb(239,68,68)" />
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push(`/post/${post.id}`);
                }}
              >
                <View
                  className="bg-[#EDEDED] mx-auto mb-3 p-3 rounded-full"
                  style={{
                    height: 50,
                    width: 50,
                  }}
                >
                  <FontAwesome5 name="user-alt" size={24} color="#8280FF" />
                </View>
            
                <View className="flex-row gap-2 items-center ">
                  <Text
                    className="text-blue-600 text-start"
                  >
                    Title: {post.title}
                  </Text>
                </View>
                <Text className="text-gray-500 text-start">
                  Body: {post.body}
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PostsSCreen;
