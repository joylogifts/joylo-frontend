// Components
import {
  CustomContinueButton,
  CustomRadioButton,
} from "@/lib/ui/useable-components";

// Constants
import { LANGUAGES } from "@/lib/utils/constants";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useLanguage } from "@/lib/context/global/language.context";

export default function LanguageMain() {
  // States
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [tempSelectedLang, setTempSelectedLang] = useState<string | null>(null);

  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation, selectedLanguage, setSelectedLanguage, languages } = useLanguage();

  // Initialize tempSelectedLang with current language
  useEffect(() => {
    setTempSelectedLang(selectedLanguage);
  }, [selectedLanguage]);

  // Handlers
  const handleLanguageSelection = (langCode: string) => {
    setTempSelectedLang(langCode);
  };

  const handleSubmission = async () => {
    if (!tempSelectedLang) return;
    
    try {
      setIsChangingLang(true);
      setSelectedLanguage(tempSelectedLang);
      setIsChangingLang(false);
    } catch (e) {
      console.error(e);
      setIsChangingLang(false);
    }
  };

  return (
    <View
      className="h-[85%] w-[90%] items-center justify-between mx-auto p-4"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {languages.map((lng, index) => {
        return (
          <View
            key={`lng-${index}`}
            className="w-full mx-auto flex flex-row items-center justify-between border-b-2 border-b-gray-300 h-12"
            style={{ backgroundColor: appTheme.themeBackground }}
          >
            <View className="flex flex-row gap-3 items-center justify-center px-3">
              <View className="overflow-hidden items-center justify-start w-8 h-6">
                <Image
                  source={LANGUAGES.find((l) => l.code === lng.code)?.icon}
                  width={100}
                  height={100}
                  className="max-w-8 max-h-8"
                />
              </View>
              <Text style={{ color: appTheme.fontMainColor }}>{lng.label}</Text>
            </View>
            <View>
              <CustomRadioButton
                label={lng.code}
                isSelected={lng.code === tempSelectedLang}
                showLabel={false}
                onPress={() => handleLanguageSelection(lng.code)}
              />
            </View>
          </View>
        );
      })}
      <View>
        <CustomContinueButton
          title={
            isChangingLang
              ? getTranslation("please_wait")
              : getTranslation("update_language")
          }
          onPress={() => handleSubmission()}
          disabled={tempSelectedLang === selectedLanguage}
        />
      </View>
    </View>
  );
}
