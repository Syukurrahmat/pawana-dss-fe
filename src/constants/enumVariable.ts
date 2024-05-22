import { IconBuildingCottage, IconBuildingFactory2, IconBuildingStore, IconBuildingTunnel, IconHeartHandshake, IconLock, IconToggleLeft, IconToggleRight, IconToolsKitchen2, IconUser, IconUserBolt, IconUserCancel, IconUserCog, IconUserHexagon, IconUserShield, IconWorld, IconZzz } from "@tabler/icons-react";

type objType = { [key: string]: string }
type attributes = { [key: string]: { icon: any, color: string, name: string } }

export const companyTypeAttr: attributes = {
    'tofufactory': {
        icon: IconBuildingFactory2,
        color: 'blue',
        name: 'Pabrik tahu'
    },
    'service': {
        icon: IconHeartHandshake,
        color: 'purple',
        name: 'Layanan'
    },
    'agriculture': {
        icon: IconBuildingCottage,
        color: 'teal',
        name: 'Pertanian'
    },
    'retailstore': {
        icon: IconBuildingStore,
        color: 'orange',
        name: 'Retail'
    },
    'restaurant': {
        icon: IconToolsKitchen2,
        color: 'yellow',
        name: 'Restoran'
    },
    'other': {
        icon: IconBuildingTunnel,
        color: 'gray',
        name: 'Lainnya'
    }
};

export const nodeTypeAttr: attributes = {
    private: { icon: IconLock, color: 'orange', name: 'Private' },
    public: { icon: IconWorld, color: 'blue', name: 'Publik' }
}

export const nodeStatusAttr: attributes = {
    active: { icon: IconToggleRight, color: 'green', name: 'Aktif' },
    nonactive: { icon: IconToggleLeft, color: 'red', name: 'Nonaktif' },
    idle: { icon: IconZzz, color: 'orange', name: 'Diam' }
}

export const userRoleAttr: attributes = {
    regular: { icon: IconUser, color: 'green', name: 'Reguler' },
    manager: { icon: IconUserBolt, color: 'blue', name: 'Manajer' },
    admin: { icon: IconUserCog, color: 'orange', name: 'Admin' },
    gov: { icon: IconUserShield, color: 'yellow', name: 'Pemerintah' },
    unverified: { icon: IconUserCancel, color: 'gray', name: 'Belum diverifikasi' },
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
