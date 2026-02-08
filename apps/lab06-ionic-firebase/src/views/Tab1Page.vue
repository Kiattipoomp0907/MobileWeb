<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการบันทึก (Realtime)</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">รายการบันทึก</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="summary-container ion-padding">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-card color="success">
                <ion-card-header>
                  <ion-card-subtitle>รายรับรวม</ion-card-subtitle>
                  <ion-card-title>+ {{ totalIncome.toLocaleString() }}</ion-card-title>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col>
              <ion-card color="danger">
                <ion-card-header>
                  <ion-card-subtitle>รายจ่ายรวม</ion-card-subtitle>
                  <ion-card-title>- {{ totalExpense.toLocaleString() }}</ion-card-title>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <ion-list>
        <ion-list-header>
          <ion-label>ประวัติล่าสุด</ion-label>
        </ion-list-header>

        <ion-item 
          v-for="item in expenses" 
          :key="item.id" 
          button 
          :detail="true"
          @click="router.push(`/edit/${item.id}`)"
        >
          <ion-icon 
            :icon="item.type === 'income' ? arrowUpCircle : arrowDownCircle" 
            slot="start" 
            :color="item.type === 'income' ? 'success' : 'danger'">
          </ion-icon>
          
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }} | {{ formatDate(item.createdAt) }}</p>
            <p v-if="item.note" style="font-size: 0.8em; color: gray;">{{ item.note }}</p>
          </ion-label>

          <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'">
            {{ item.type === 'income' ? '+' : '-' }} {{ item.amount.toLocaleString() }}
          </ion-note>
        </ion-item>
        
        <ion-item v-if="expenses.length === 0">
            <ion-label class="ion-text-center">ไม่มีรายการบันทึก</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
// เพิ่ม useRouter เข้ามา
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonNote, IonListHeader,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon
} from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';

// Firebase Imports
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

// เรียกใช้ Router
const router = useRouter();

// Interface เพื่อกำหนด Type ข้อมูล
interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: Timestamp; // รับค่าเป็น Timestamp ของ Firebase
}

const expenses = ref<Expense[]>([]);
const totalIncome = ref(0);
const totalExpense = ref(0);
let unsubscribe: any = null; // ตัวแปรสำหรับยกเลิกการฟังข้อมูลเมื่อปิดหน้า

onMounted(() => {
  // สร้าง Query ดึงข้อมูลจาก collection 'expenses' และเรียงลำดับตามเวลาล่าสุด (desc)
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

  // onSnapshot คือหัวใจของ Realtime Database
  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as Expense;
    });

    calculateTotals();
  });
});

// ฟังก์ชันคำนวณยอดรวม
const calculateTotals = () => {
  totalIncome.value = expenses.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  totalExpense.value = expenses.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
};

// ฟังก์ชันแปลงวันที่
const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  // แปลง Timestamp ของ Firebase เป็น Date Object
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('th-TH', { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' 
  });
};

// เมื่อออกจากหน้าจอนี้ ให้หยุดฟังข้อมูล (เพื่อประหยัด Resource)
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.summary-container {
  background-color: #f4f5f8;
}
</style>