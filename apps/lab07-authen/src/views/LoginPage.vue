<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login Lab07</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input v-model="email" label="Email" label-placement="floating" placeholder="user@example.com"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password" type="password" label="Password" label-placement="floating"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="block" @click="handleEmailLogin">Login with Email</ion-button>

      <div class="ion-text-center ion-margin-vertical">OR</div>

      <ion-button expand="block" color="danger" @click="handleGoogleLogin">
        Login with Google
      </ion-button>

      <div class="ion-text-center ion-margin-vertical">OR</div>

      <div v-if="!verificationId">
        <ion-item>
          <ion-input v-model="phoneNumber" label="Phone (+66...)" label-placement="floating" placeholder="+668xxxxxxxx"></ion-input>
        </ion-item>
        <div id="recaptcha-container"></div>
        <ion-button expand="block" color="success" @click="handleSendOtp">Send OTP</ion-button>
      </div>

      <div v-else>
        <ion-item>
          <ion-input v-model="otpCode" label="Enter OTP" label-placement="floating"></ion-input>
        </ion-item>
        <ion-button expand="block" color="warning" @click="handleVerifyOtp">Verify OTP</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton } from '@ionic/vue';
import { authService } from '@/auth/auth-service';

const router = useRouter();

// ตัวแปรรับค่า
const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const otpCode = ref('');
const verificationId = ref(''); // ถ้ามีค่าแสดงว่าส่ง OTP แล้ว รอ user กรอก code

// 1. Email Login
const handleEmailLogin = async () => {
  try {
    await authService.loginWithEmailPassword({ email: email.value, password: password.value });
    router.replace('/tabs/tab1');
  } catch (e: any) {
    alert("Email Login Error: " + e.message);
  }
};

// 2. Google Login
const handleGoogleLogin = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace('/tabs/tab1');
  } catch (e: any) {
    alert("Google Login Error: " + e.message);
  }
};

// 3. Phone Login (Step 1: Send OTP)
const handleSendOtp = async () => {
  try {
    const res = await authService.startPhoneLogin({ phoneNumberE164: phoneNumber.value });
    verificationId.value = res.verificationId; // ได้ ID มาแล้ว เปลี่ยนหน้าจอเป็นช่องกรอก OTP
  } catch (e: any) {
    alert("Send OTP Error: " + e.message);
  }
};

// 3. Phone Login (Step 2: Verify Code)
const handleVerifyOtp = async () => {
  try {
    await authService.confirmPhoneCode({ 
      verificationId: verificationId.value, 
      verificationCode: otpCode.value 
    });
    router.replace('/tabs/tab1');
  } catch (e: any) {
    alert("Verify OTP Error: " + e.message);
  }
};
</script>

<div id="recaptcha-container"></div>