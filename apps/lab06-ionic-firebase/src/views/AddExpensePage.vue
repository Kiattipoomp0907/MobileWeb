<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input 
        label="ชื่อรายการ" 
        label-placement="floating" 
        fill="outline" 
        v-model="title"
        class="ion-margin-bottom"
      ></ion-input>

      <ion-input
        label="จำนวนเงิน"
        label-placement="floating"
        fill="outline"
        type="number"
        v-model="amount"
        class="ion-margin-bottom"
      ></ion-input>

      <ion-select 
        label="ประเภท" 
        label-placement="floating" 
        fill="outline" 
        v-model="type"
        interface="popover"
        class="ion-margin-bottom"
      >
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input 
        label="หมวดหมู่" 
        label-placement="floating" 
        fill="outline" 
        v-model="category"
        class="ion-margin-bottom"
      ></ion-input>

      <ion-textarea 
        label="หมายเหตุ" 
        label-placement="floating" 
        fill="outline" 
        v-model="note"
        class="ion-margin-bottom"
      ></ion-textarea>

      <ion-button expand="block" @click="saveExpense">
        บันทึกข้อมูล
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton 
} from '@ionic/vue';
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase"; // ตรวจสอบว่าไฟล์ firebase.ts อยู่ที่ src/firebase.ts
import { useRouter } from "vue-router";

const router = useRouter();

// สร้างตัวแปรรับค่าจากฟอร์ม
const title = ref("");
const amount = ref<number | null>(null); // เริ่มต้นเป็น null หรือ 0
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  // ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
  if (!title.value || !amount.value) {
    alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
    return;
  }

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date() // บันทึกเวลาที่สร้าง
    });
    
    console.log("Document written successfully");
    
    // เคลียร์ค่าในฟอร์ม
    title.value = "";
    amount.value = null;
    note.value = "";
    
    // กลับไปหน้าแสดงรายการ (เปลี่ยน path ตาม Router ที่คุณตั้งไว้)
    // โดยปกติ Template Tabs หน้าแรกคือ /tabs/tab1
    router.push("/tabs/tab1"); 
    
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("บันทึกข้อมูลไม่สำเร็จ");
  }
};
</script>