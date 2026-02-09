<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">รายการรายรับ–รายจ่าย</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- สรุปยอดเงิน -->
      <ion-card>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="summary-item income">
                  <div class="label">รายรับ</div>
                  <div class="amount">{{ formatCurrency(totalIncome) }}</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="summary-item expense">
                  <div class="label">รายจ่าย</div>
                  <div class="amount">{{ formatCurrency(totalExpense) }}</div>
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <div class="summary-item balance">
                  <div class="label">คงเหลือ</div>
                  <div class="amount">{{ formatCurrency(balance) }}</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- รายการ -->
      <ion-list v-if="expenses.length > 0">
        <ion-item 
          v-for="expense in expenses" 
          :key="expense.id"
          @click="goToEdit(expense.id)"
          button>
          <ion-label>
            <h2>{{ expense.title }}</h2>
            <p>{{ expense.category }} • {{ formatDate(expense.createdAt) }}</p>
            <p v-if="expense.note" class="note">{{ expense.note }}</p>
          </ion-label>
          <ion-note slot="end" :color="expense.type === 'income' ? 'success' : 'danger'">
            <strong>{{ expense.type === 'income' ? '+' : '-' }}{{ formatCurrency(expense.amount) }}</strong>
          </ion-note>
        </ion-item>
      </ion-list>

      <div v-else class="empty-state ion-padding ion-text-center">
        <ion-icon :icon="walletOutline" size="large" color="medium"></ion-icon>
        <p>ยังไม่มีรายการ</p>
        <p class="ion-text-wrap">เริ่มต้นบันทึกรายรับรายจ่ายของคุณ</p>
      </div>

      <!-- ปุ่มเพิ่มรายการ -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="goToAdd">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon
} from '@ionic/vue';
import { add, walletOutline } from 'ionicons/icons';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: any;
}

const expenses = ref<Expense[]>([]);
let unsubscribe: (() => void) | null = null;

// คำนวณยอดรวม
const totalIncome = computed(() => {
  return expenses.value
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
});

const totalExpense = computed(() => {
  return expenses.value
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
});

const balance = computed(() => totalIncome.value - totalExpense.value);

// ฟังก์ชันจัดรูปแบบเงิน
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(amount);
};

// ฟังก์ชันจัดรูปแบบวันที่
const formatDate = (date: any) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

const goToAdd = () => {
  router.push('/add-expense');
};

const goToEdit = (id: string) => {
  router.push(`/edit/${id}`);
};

// ดึงข้อมูลแบบ Realtime
onMounted(() => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[];
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.summary-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: var(--ion-color-light);
}

.summary-item.income {
  background: rgba(16, 220, 96, 0.1);
}

.summary-item.expense {
  background: rgba(235, 68, 90, 0.1);
}

.summary-item.balance {
  background: var(--ion-color-primary-tint);
  color: white;
}

.summary-item .label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.summary-item .amount {
  font-size: 1.5rem;
  font-weight: bold;
}

.note {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 4px;
}

.empty-state {
  margin-top: 40%;
}

.empty-state ion-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--ion-color-medium);
}
</style>