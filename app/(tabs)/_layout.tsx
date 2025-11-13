import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingHorizontal: 22,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -20 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          
          elevation: 6, // 🔹 untuk Android shadow
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "library") {
            iconName = focused ? "library" : "library-outline";
          } else {
            iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="library" options={{ title: "Library" }} />
    </Tabs>
  );
}
