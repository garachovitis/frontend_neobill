import {Stack} from "expo-router";

export default function RootLayout () {
    return (
        <Stack>
            <Stack.Screen options={{ headerShown: false }} name="saved" />
        </Stack>
    );
}