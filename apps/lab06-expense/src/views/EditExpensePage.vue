<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อรายการ" label-placement="floating" fill="outline" v-model="title" class="ion-margin-bottom"></ion-input>
      <ion-input label="จำนวนเงิน" label-placement="floating" fill="outline" type="number" v-model="amount" class="ion-margin-bottom"></ion-input>
      <ion-select label="ประเภท" label-placement="floating" fill="outline" v-model="type" class="ion-margin-bottom">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>
      <ion-input label="หมวดหมู่" label-placement="floating" fill="outline" v-model="category" class="ion-margin-bottom"></ion-input>
      <ion-textarea label="หมายเหตุ" label-placement="floating" fill="outline" v-model="note" class="ion-margin-bottom"></ion-textarea>

      <ion-button expand="block" @click="updateExpense" class="ion-margin-bottom">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button expand="block" color="danger" fill="outline" @click="deleteExpense">
        ลบรายการ
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonButtons, IonBackButton
} from '@ionic/vue';

const route = useRoute();
const router = useRouter();
const expenseId = route.params.id as string; // รับ ID จาก URL

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

// ดึงข้อมูลเก่ามาแสดงตอนเปิดหน้า
onMounted(async () => {
  const docRef = doc(db, "expenses", expenseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    title.value = data.title;
    amount.value = data.amount;
    type.value = data.type;
    category.value = data.category;
    note.value = data.note;
  } else {
    alert("ไม่พบข้อมูล");
    router.push('/tabs/tab1');
  }
});

// ฟังก์ชันอัปเดตข้อมูล (Update)
const updateExpense = async () => {
  try {
    const docRef = doc(db, "expenses", expenseId);
    await updateDoc(docRef, {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value
    });
    router.push('/tabs/tab1'); // กลับหน้าหลัก
  } catch (error) {
    console.error(error);
    alert("แก้ไขไม่สำเร็จ");
  }
};

// ฟังก์ชันลบข้อมูล (Delete) - ทำเผื่อไว้เลย
const deleteExpense = async () => {
  if(!confirm("ยืนยันการลบ?")) return;
  try {
    await deleteDoc(doc(db, "expenses", expenseId));
    router.push('/tabs/tab1');
  } catch (error) {
    console.error(error);
  }
};
</script>