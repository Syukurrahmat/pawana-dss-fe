import * as Yup from 'yup';

export const userValidationSchema = (withEmail : boolean = true) => Yup.object().shape({
    name: Yup.string()
        .min(2, 'Terlalu Pendek')
        .max(32, 'Terlalu Panjang')
        .required('Wajib diisi'),
    phone: Yup.string()
        .matches(/\d+/g, 'Nomor telepon tidak valid')
        .min(10, 'Terlalu Pendek')
        .max(14, 'Terlalu Panjang')
        .required('Wajib diisi'),
    address: Yup.string()
        .min(3, 'Terlalu Pendek')
        .max(255, 'Terlalu Panjang')
        .required('Wajib diisi'),
    description: Yup.string().max(255, 'Terlalu Panjang').nullable(),
    ...(withEmail ? { email: Yup.string().email('Surel Tidak Valid').required('Wajib diisi'), } : null)
})

