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
      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="expense">
        <ion-list>
          <ion-item>
            <ion-input 
              label="ชื่อรายการ" 
              label-placement="floating"
              v-model="expense.title"
              placeholder="เช่น ซื้อของ, เงินเดือน">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              label="จำนวนเงิน"
              label-placement="floating"
              type="number"
              v-model="expense.amount"
              placeholder="0.00">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-select 
              label="ประเภท" 
              label-placement="floating"
              v-model="expense.type">
              <ion-select-option value="income">รายรับ</ion-select-option>
              <ion-select-option value="expense">รายจ่าย</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-input 
              label="หมวดหมู่" 
              label-placement="floating"
              v-model="expense.category"
              placeholder="เช่น อาหาร, เงินเดือน, ช้อปปิ้ง">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-textarea 
              label="หมายเหตุ" 
              label-placement="floating"
              v-model="expense.note"
              :rows="3"
              placeholder="บันทึกเพิ่มเติม...">
            </ion-textarea>
          </ion-item>
        </ion-list>

        <ion-button 
          expand="block" 
          @click="updateExpense"
          :disabled="!expense.title || !expense.amount"
          class="ion-margin-top">
          บันทึกการแก้ไข
        </ion-button>

        <ion-button 
          expand="block" 
          color="danger"
          fill="outline"
          @click="confirmDelete"
          class="ion-margin-top">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          ลบรายการนี้
        </ion-button>
      </div>

      <div v-else class="ion-text-center ion-padding">
        <p>ไม่พบข้อมูล</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonButtons, IonBackButton, 
  IonSpinner, IonIcon, alertController
} from "@ionic/vue";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter, useRoute } from "vue-router";
import { trashOutline } from 'ionicons/icons';

const router = useRouter();
const route = useRoute();

interface Expense {
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
}

const expense = ref<Expense | null>(null);
const loading = ref(true);
const expenseId = route.params.id as string;

onMounted(async () => {
  try {
    const docRef = doc(db, "expenses", expenseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      expense.value = docSnap.data() as Expense;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching expense:", error);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    loading.value = false;
  }
});

const updateExpense = async () => {
  if (!expense.value) return;
  
  try {
    const docRef = doc(db, "expenses", expenseId);
    await updateDoc(docRef, {
      title: expense.value.title,
      amount: Number(expense.value.amount),
      type: expense.value.type,
      category: expense.value.category,
      note: expense.value.note,
      updatedAt: new Date()
    });
    
    router.push("/tabs/tab1");
  } catch (error) {
    console.error("Error updating expense:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    buttons: [
      {
        text: 'ยกเลิก',
        role: 'cancel',
      },
      {
        text: 'ลบ',
        role: 'confirm',
        handler: () => {
          deleteExpense();
        },
      },
    ],
  });

  await alert.present();
};

const deleteExpense = async () => {
  try {
    const docRef = doc(db, "expenses", expenseId);
    await deleteDoc(docRef);
    router.push("/tabs/tab1");
  } catch (error) {
    console.error("Error deleting expense:", error);
    alert("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};
</script>