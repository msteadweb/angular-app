import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoading = true;
  transactions: any[] = [];
  private authSubscription: (() => void) | null = null;
  private transactionSubscription: (() => void) | null = null;

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {}

  ngOnInit() {
    this.authSubscription = onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.isLoading = false;
      if (user) {
        this.fetchTransactions();
      }
    });
  }

  fetchTransactions() {
    const transactionsRef = collection(this.firestore, 'transactions');

    this.transactionSubscription = onSnapshot(transactionsRef, (snapshot) => {
      this.transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }, (error) => {
      console.error('Error fetching transactions:', error);
    });
  }

  async logout() {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
      this.authSubscription = null;
    }
    if (this.transactionSubscription) {
      this.transactionSubscription();
      this.transactionSubscription = null;
    }
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }
}
