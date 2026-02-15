<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      
      <div v-if="currentUser" class="ion-text-center">
        <img :src="currentUser.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" 
             style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 20px;">
        
        <h2>{{ currentUser.displayName || 'No Name' }}</h2>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>UID:</strong> {{ currentUser.uid }}</p>
        <p><strong>Phone:</strong> {{ currentUser.phoneNumber || '-' }}</p>

        <ion-button expand="block" color="medium" class="ion-margin-top" @click="handleLogout">
          Logout
        </ion-button>
      </div>

      <div v-else class="ion-text-center">
        <ion-spinner></ion-spinner>
        <p>Loading...</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSpinner } from '@ionic/vue';
import { authService } from '@/auth/auth-service';
import type { AuthUser } from '@/auth/auth-interface';

const currentUser = ref<AuthUser | null>(null);
const router = useRouter();

onMounted(async () => {
  // ดึงข้อมูล User เมื่อหน้าโหลดเสร็จ
  currentUser.value = await authService.getCurrentUser();
});

const handleLogout = async () => {
  await authService.logout();
  router.replace('/login');
};
</script>