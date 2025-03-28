import {Stack} from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen options={{ headerShown: false }} name="index" />
        </Stack>
    );
}