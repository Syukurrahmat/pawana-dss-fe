import { IconBook2, IconBuildingCottage, IconBuildingFactory2, IconBuildingStore, IconBuildingTunnel, IconChecks, IconCircleDot, IconClipboardText, IconHeartHandshake, IconLock, IconNote, IconPaint, IconProgress, IconRocket, IconToggleLeft, IconToggleRight, IconTool, IconToolsKitchen2, IconTrees, IconUser, IconUserBolt, IconUserCancel, IconUserCog, IconUserShield, IconWindow, IconWorld, IconZzz } from "@tabler/icons-react";

type objType = { [key: string]: string }
type attributes = { [key: string]: { icon: any, color: string, name: string, note?: string } }



export const eventLogsTypeAttr: attributes = {
    production: {
        icon: IconBuildingFactory2,
        color: 'green',
        name: 'Produksi'
    },
    maintenance: {
        icon: IconPaint,
        color: 'blue',
        name: 'Pemeliharaan'
    },
    training: {
        icon: IconBook2,
        color: 'orange',
        name: 'Pelatihan'
    },
    administrative: {
        icon: IconClipboardText,
        color: 'purple',
        name: 'Administratif'
    },
    repair: {
        icon: IconTool,
        color: 'red',
        name: 'Perbaikan'
    },
    other: {
        icon: IconNote,
        color: 'gray',
        name: 'Lainnya'
    }


};





export const companyTypeAttr: attributes = {
    tofufactory: {
        icon: IconBuildingFactory2,
        color: 'blue',
        name: 'Pabrik tahu'
    },
    service: {
        icon: IconHeartHandshake,
        color: 'purple',
        name: 'Layanan'
    },
    agriculture: {
        icon: IconBuildingCottage,
        color: 'teal',
        name: 'Pertanian'
    },
    retailstore: {
        icon: IconBuildingStore,
        color: 'orange',
        name: 'Retail'
    },
    restaurant: {
        icon: IconToolsKitchen2,
        color: 'yellow',
        name: 'Restoran'
    },
    other: {
        icon: IconBuildingTunnel,
        color: 'gray',
        name: 'Lainnya'
    },
    regular: {
        icon: IconCircleDot,
        color: 'green',
        name: 'Node yang Anda Ikuti'
    }
};

export const nodeEnvironmentAttr: attributes = {
    indoor: { icon: IconWindow, color: 'yellow', name: 'Indoor' },
    outdoor: { icon: IconTrees, color: 'green', name: 'Outdoor' },
}

export const nodeTypeAttr: attributes = {
    private: { icon: IconLock, color: 'orange', name: 'Private', note: 'Node hanya dapat diikuti oleh pemiliknya' },
    public: { icon: IconWorld, color: 'blue', name: 'Publik', note: 'Node dapat diikuti semua pengguna' }
}


export const nodeStatusAttr: (attributes) = {
    active: { icon: IconToggleRight, color: 'green', name: 'Aktif', note: 'Node berjalan dengan baik' },
    nonactive: { icon: IconToggleLeft, color: 'red', name: 'Nonaktif', note: 'Node tidak menerima data' },
    idle: { icon: IconZzz, color: 'orange', name: 'Diam', note: 'Lebih dari 6 jam node tidak menerima data' },
    neversentdata: { icon: IconZzz, color: 'orange', name: 'Menunggu', note: 'Belum pernah mengirimkan data' }
}

export const userRoleAttr: attributes = {
    regular: { icon: IconUser, color: 'green', name: 'Reguler' },
    manager: { icon: IconUserBolt, color: 'blue', name: 'Manajer' },
    admin: { icon: IconUserCog, color: 'orange', name: 'Admin' },
    gov: { icon: IconUserShield, color: 'yellow', name: 'Pemerintah' },
    unverified: { icon: IconUserCancel, color: 'gray', name: 'Belum diverifikasi' },
}

export const eventLogStatusAttr: attributes = {
    inProgress: { icon: IconRocket, color: 'green', name: 'Berlangsung' },
    completed: { icon: IconChecks, color: 'blue', name: 'Selesai' },
    upcoming: { icon: IconProgress, color: 'orange', name: 'Belum Dimulai' },
    
}



export const roleTagColor: objType = {
    regular: 'green',
    manager: 'blue',
    admin: 'orange',
    gov: 'gray',
};

export const nodeLocationTagColor: objType = {
    indoor: 'green',
    outdoor: 'blue',
};
