import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

const CustomButton = ({ title, handlePress, variant = "primary", containerStyles="", titleStyles="", isLoading=false }) => {
    return (
        <TouchableOpacity
            disabled={isLoading}
            onPress={handlePress}
            className={`${variant === 'primary' ? "bg-purple-500" : "bg-white border border-purple-300"} w-full px-2 rounded-md flex flex-row justify-center items-center py-2 ${containerStyles}`}
        >
            <Text
                className={`${variant === "primary" ? "text-white" : "text-purple-500"} text-lg font-semibold ${titleStyles}`}
            >{title}</Text>
            {
                isLoading &&
                <ActivityIndicator
                    size={"small"}
                    animating={isLoading}
                    color={variant === "primary" ? "white" : "purple"}

                />
            }
        </TouchableOpacity>
    )
}

export default CustomButton