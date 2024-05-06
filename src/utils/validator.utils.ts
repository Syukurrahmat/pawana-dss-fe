import * as Yup from 'yup';

export const name = Yup.string()
    .trim()
    .min(2, 'Terlalu Pendek')
    .max(32, 'Terlalu Panjang');

export const phone = Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Nomor telepon tidak valid')
    .min(10, 'Terlalu Pendek')
    .max(14, 'Terlalu Panjang');

export const address = Yup.string()
    .trim()
    .min(3, 'Terlalu Pendek')
    .max(255, 'Terlalu Panjang')

export const description = Yup.string()
    .trim().max(255, 'Terlalu Panjang')

export const email = Yup.string()
    .trim().email('Surel Tidak Valid')

export const password = Yup.string()

export const newPassword = Yup.string()
    .trim()
    .min(8, 'minimal 8 Karakter')
    .max(32, 'Maksimal 32 karakter')

export const confirmPassword = Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Kata sandi tidak sama')

export const nodeStatus = Yup.string()
    .trim()
    .oneOf(['normal', 'maintenance', 'nonactive'], 'Tidak valid')

export const environment = Yup.string()
    .trim()
    .oneOf(['indoor', 'outdoor'], 'Tidak valid')

