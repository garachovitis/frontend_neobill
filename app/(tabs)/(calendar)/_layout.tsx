import {Stack} from "expo-router";

export default function CalendarLayout() {
    return (
        <Stack>
            <Stack.Screen options={{ headerShown: false }} name="calendar" />
        </Stack>
    );
}