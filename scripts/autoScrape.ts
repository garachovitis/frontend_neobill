import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as SecureStore from 'expo-secure-store';
import { deleteAllData, addBillingInfo } from './database';

const BACKGROUND_TASK = 'refresh-billing-data';

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  console.log('🔄 Running background task: refreshing billing data...');
  
  try {
    const username = await SecureStore.getItemAsync('username');
    const password = await SecureStore.getItemAsync('password');
    const service = await SecureStore.getItemAsync('service');

    if (username && password && service) {
      console.log('🔑 Found credentials in SecureStore for servise:${service}');
      
      const response = await fetch('https://backend-billy.onrender.com/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        console.log('✅ Data refreshed successfully:', data);

        await deleteAllData(); 

        const billingData = JSON.stringify(data.data);
        await addBillingInfo(service, username, null, billingData);

        console.log('✅ Local DB updated with new billing data');
      } else {
        console.error('❌ Failed to refresh data:', data);
      }
    } else {
      console.warn('⚠️ No credentials found in SecureStore');
    }
  } catch (error) {
    console.error('❌ Error in background task:', error);
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const registerBackgroundTask = async () => {
  const status = await BackgroundFetch.getStatusAsync();

  if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 5 * 60, 
      stopOnTerminate: false, 
      startOnBoot: true, 
    });

    console.log('✅ Background task registered');
  } else {
    console.log('⚠️ Background fetch not available');
  }
};