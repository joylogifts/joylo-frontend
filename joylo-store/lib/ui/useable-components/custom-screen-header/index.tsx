// Core
import { useApptheme } from "@/lib/context/theme.context";
import { Text, View } from "react-native";

export default function CustomScreenHeader({ title }: { title: string }) {
  // Hooks
  const { appTheme } = useApptheme();

  return (
    <View className={`p-1 w-full mx-auto block justify-center items-center`}>
      <Text
        className="font-bold text-lg"
        style={{ color: appTheme.fontMainColor }}
      >
        {title}
      </Text>
    </View>
  );
}
