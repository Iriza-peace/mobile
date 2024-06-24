import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Formik, ErrorMessage } from "formik";
import { ZodError, z } from "zod";
import { instance } from "@/utils/axios";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { TextInput, Pressable } from "react-native";

const postSchema = z.object({
  title: z.string().min(3).max(255),
  body: z.string().min(3),
});

type FormValues = z.infer<typeof postSchema>;

const AddPostScreen = () => {
  const toast = useToast();
  const validateForm = (values: FormValues) => {
    try {
      postSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Formik<FormValues>
        initialValues={{
          title: "",
          body: "",
        }}
        onSubmit={async (values) => {
          try {
            toast.show("Adding Post...", {
              type: "warning",
            });
            await instance.post("/posts", {
              ...values,
            });
            toast.show("Added Post", {
              type: "success",
            });
            router.back();
          } catch (error) {
            toast.show("Error logging in", {
              type: "danger",
            });
          }
        }}
        validate={validateForm}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <SafeAreaView>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 24, marginBottom: 20 }}>
                Add a new post
              </Text>
              <View style={{ marginBottom: 10 }}>
                <Text className="mb-1 font-medium text-gray-600">Title</Text>
                <TextInput
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  placeholder="Title..."
                  className="border border-[#BEC5D1] px-5 py-2 rounded-md"
                  value={values.title}
                />
                <ErrorMessage name="title">
                  {(msg) => <Text style={{ color: "red" }}>{msg}</Text>}
                </ErrorMessage>
              </View>
              <View className="mb-5">
                <Text className="mb-1 font-medium text-gray-600">Body</Text>
                <TextInput
                  onChangeText={handleChange("body")}
                  onBlur={handleBlur("body")}
                  placeholder="Body..."
                  className="border border-[#BEC5D1] px-5 py-2 rounded-md"
                  value={values.body}
                />
                <ErrorMessage name="body">
                  {(msg) => <Text style={{ color: "red" }}>{msg}</Text>}
                </ErrorMessage>
              </View>
              <Pressable
                onPress={(e) =>
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
                className="bg-blue-500 p-3 rounded-md"
              >
                <Text className="text-white text-center font-medium">
                  Add Post
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        )}
      </Formik>
    </ScrollView>
  );
};

export default AddPostScreen;
