import { create } from 'zustand'
import { persist , devtools} from 'zustand/middleware'

const UserStore = (set) => ({
    user: null,
    project_urls: [],

    setUser: (User) => set(() => ({
        user: User 
        })),
    setProjectUrls: (project_urls) => {
        set(() => ({
            project_urls: project_urls
        }));
    },
});

export const useUser = create(persist(devtools(UserStore), { name: 'userStore' }));
