# Welcome to neobill 👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. a. Start the app on Android device

   ```bash
    npm run android
   ```
   b. Start the app on iOS device

   ```bash
    npm run ios
   ```

app
├── (tabs)
│   ├── _layout.tsx          ──► Layout for tab navigation
│   ├── calendar.tsx         ──► Calendar screen
│   ├── categories.tsx       ──► Categories screen
│   ├── index.tsx            ──► Main screen
│   ├── settings.tsx         ──► Settings screen
│
├── modals
│   ├── addCategoryModal.tsx         ──► Modal for adding a new category from categories
│   ├── categoryModal.tsx            ──► Modal that displays all data of each category on categories
│   ├── categorySelectionModal.tsx   ──► Modal for selecting categories from index
│   ├── newAccountModal.tsx          ──► Modal for adding a new account from settings
│   ├── terms&conditionsModal.tsx    ──► Modal for terms and conditions in settings called from newaccount
│
├── styles
│   ├── categoriesStyles.ts   ──► Styles for categories screen
│   ├── indexStyles.ts        ──► Styles for the main screen
│   ├── newaccStyles.ts       ──► Styles for the new account modal
│   ├── savedStyles.ts        ──► Styles for the saved items screen
│   ├── settingsStyles.ts     ──► Styles for the settings screen
│
├── _layout.tsx               ──► Main layout file
├── saved.tsx                 ──► Saved items screen 
│


├── assets                    ──► Static assets (images, icons, etc.)
├── components                ──► Reusable components


├── scripts
    ├── database.ts           ──► connects with locadb
    ├── autoScrape.ts         ──► autoscrapes on background to backend