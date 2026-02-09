<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input 
            label="ชื่อรายการ" 
            label-placement="floating"
            v-model="title"
            placeholder="เช่น ซื้อของ, เงินเดือน">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            label="จำนวนเงิน"
            label-placement="floating"
            type="number"
            v-model="amount"
            placeholder="0.00">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-select 
            label="ประเภท" 
            label-placement="floating"
            v-model="type">
            <ion-select-option value="income">รายรับ</ion-select-option>
            <ion-select-option value="expense">รายจ่าย</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-input 
            label="หมวดหมู่" 
            label-placement="floating"
            v-model="category"
            placeholder="เช่น อาหาร, เงินเดือน, ช้อปปิ้ง">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-textarea 
            label="หมายเหตุ" 
            label-placement="floating"
            v-model="note"
            :rows="3"
            placeholder="บันทึกเพิ่มเติม...">
          </ion-textarea>
        </ion-item>
      </ion-list>

      <ion-button 
        expand="block" 
        @click="saveExpense"
        :disabled="!title || !amount"
        class="ion-margin-top">
        บันทึกข้อมูล
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonButtons, IonBackButton
} from "@ionic/vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date()
    });
    
    // Reset form
    title.value = "";
    amount.value = null;
    type.value = "expense";
    category.value = "";
    note.value = "";
    
    // กลับไปหน้ารายการ
    router.push("/tabs/tab1");
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};
</script>