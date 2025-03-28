import {Stack} from "expo-router";

export default function RootLayout () {
    return (
        <Stack>
            <Stack.Screen
                name="saved"
                options={{
                    headerShown: false,
                    headerBackTitle: "Πίσω",
                    headerStyle: { backgroundColor: '#3b8193' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontSize: 20 },
                }}
            />
        </Stack>
    );
}