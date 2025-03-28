import {Stack} from "expo-router";

export default function CalendarLayout() {
    return (
        <Stack>
            <Stack.Screen options={{ title: "Gamo tin expo" }} name="index" />
        </Stack>
    );
}