import {Stack} from "expo-router";

export default function CategoriesLayout() {
    return (
        <Stack>
            <Stack.Screen options={{ headerShown: false }} name="categories" />
        </Stack>
    );
}