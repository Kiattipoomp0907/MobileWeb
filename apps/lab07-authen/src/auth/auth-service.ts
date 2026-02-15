import { Capacitor } from "@capacitor/core";
import type { IAuthService } from "./auth-interface";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

// ถ้าเป็น Native (Android/iOS) ให้ใช้ Class App
// ถ้าไม่ใช่ (เป็น Browser) ให้ใช้ Class Web
export const authService: IAuthService = Capacitor.isNativePlatform()
    ? new FirebaseAppAuthService()
    : new FirebaseWebAuthService();