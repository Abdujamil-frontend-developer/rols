import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API } from '@/services/api';

type Role = 'admin' | 'user';

export interface User {
  id: number;
  username: string; 
  role: Role;
  permissions: string[];
  isMainAdmin: boolean;
}

export interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
}

export interface Todo {
  id: number;
  title: string;
  short_description: string;
  description: string;
}

interface AppState {
  // --- Auth State ---
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // --- Tab State ---
  tabs: TabItem[];
  activeKey: string;
  addTab: (tab: TabItem) => void;
  removeTab: (targetKey: string) => void;
  setActiveKey: (key: string) => void;
  resetTabs: () => void;

  // --- Todo/Products State ---
  todos: Todo[];
  isTodoLoading: boolean;
  todoError: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (data: { title: string; short_description: string; description: string }) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
}

const initialTabs: TabItem[] = [
  { key: '/home', label: 'Home', closable: false },
];

export const useAppStore = create<AppState>()(
  (persist as any)(
    (set: any, get: any) => ({
      // --- Auth Setup ---
      user: null as User | null,
      token: null as string | null,
      isAuthenticated: false as boolean,
      isAuthLoading: false as boolean,
      authError: null as string | null,

      login: async (username: string, password: string) => {
        set({ isAuthLoading: true, authError: null });

        try {
          const response = await API.auth.login({ login: username, password });
          
          const { access_token, user: userData } = response.data;
          
          if(access_token) {
              localStorage.setItem('token', access_token);
          }

          const roleId = Number(userData.role_id);
          const isMainAdmin = userData.login === 'admin';
          const role: Role = (roleId === 2 || isMainAdmin) ? 'admin' : 'user'; 

          const permissions = userData.access || [];

          const mappedUser: User = {
            id: userData.id,
            username: userData.login || userData.name,
            role: role,
            permissions: permissions,
            isMainAdmin
          };

          set({ user: mappedUser, token: access_token, isAuthenticated: true, isAuthLoading: false });
          return true;
        } catch (error: any) {
          set({ 
            isAuthLoading: false, 
            authError: error.response?.data?.message || "Login failed" 
          });
          return false;
        }
      },

      logout: async () => {
        try {
            await API.auth.logout();
        } catch(e) {
            console.error(e);
        }
        
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        get().resetTabs(); // Reset tabs on logout
      },

      checkAuth: async () => {
        const state = get();
        if (!state.token) return;

        try {
            const response = await API.auth.me();
            const userData = response.data.user;
            const access = response.data.access; 

            // role_id: 1=user, 2=admin
            const roleId = Number(userData.role_id);
            const isMainAdmin = userData.login === 'admin';
            const role: Role = (roleId === 2 || isMainAdmin) ? 'admin' : 'user'; 
            
            // Use permissions from backend (or 'tabs' if your backend provides it as tabs)
            const permissions = access || userData.access || [];

            const mappedUser: User = {
                id: userData.id,
                username: userData.login || userData.name,
                role: role,
                permissions: permissions,
                isMainAdmin
            };

            const localUser = state.user;

            if (localUser?.role === 'admin' && mappedUser.role !== 'admin') {
                 console.log("Tamper detected! Redirecting to 404...");
                 set({ user: null, token: null, isAuthenticated: false });
                 localStorage.removeItem('token');
                 window.location.href = '/404'; 
                 return;
            }

            set({ user: mappedUser, isAuthenticated: true });
        } catch (error) {
            console.error("Token checking failed:", error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // --- Tab Setup ---
      tabs: initialTabs,
      activeKey: '/home',

      addTab: (tab: TabItem) => 
        set((state: AppState) => {
          const exists = state.tabs.find((t: TabItem) => t.key === tab.key);
          if (exists) {
            return { activeKey: tab.key };
          }
          return {
            tabs: [...state.tabs, tab],
            activeKey: tab.key,
          };
        }),

      removeTab: (targetKey: string) =>
        set((state: AppState) => {
          const newTabs = state.tabs.filter((tab: TabItem) => tab.key !== targetKey);
          let newActiveKey = state.activeKey;

          if (state.activeKey === targetKey) {
            newActiveKey = newTabs[newTabs.length - 1]?.key || '/home';
          }

          return {
            tabs: newTabs.length > 0 ? newTabs : initialTabs,
            activeKey: newActiveKey,
          };
        }),

      setActiveKey: (key: string) => set({ activeKey: key }),

      resetTabs: () => set({ tabs: initialTabs, activeKey: '/home' }),

      // --- Todo Setup ---
      todos: [] as Todo[],
      isTodoLoading: false as boolean,
      todoError: null as string | null,

      fetchTodos: async () => {
        set({ isTodoLoading: true });
        try {
          const response = await API.products.getAll();
          set({ todos: response.data.data || response.data, isTodoLoading: false });
        } catch (error) {
          set({ isTodoLoading: false, todoError: "Failed to fetch todos" });
        }
      },

      addTodo: async (data: { title: string; short_description: string; description: string }) => {
        try {
          await API.products.create(data); 
          await get().fetchTodos(); 
        } catch (error) {
           console.error(error);
        }
      },

      deleteTodo: async (id: number) => {
        try {
          await API.products.delete(id);
          set({ todos: get().todos.filter((t: Todo) => t.id !== id) });
        } catch (error) {
          console.error(error);
        }
      },

      updateTodo: async (updatedTodo: Todo) => {
        try {
          await API.products.update(updatedTodo.id, { 
            title: updatedTodo.title,
            short_description: updatedTodo.short_description,
            description: updatedTodo.description
          });
          set({ todos: get().todos.map((t: Todo) => t.id === updatedTodo.id ? updatedTodo : t) });
        } catch (error) {
          console.error(error);
        }
      },

    }),
    {
      name: 'app-storage',
      // only persist auth and tabs
      partialize: (state: AppState) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated,
        tabs: state.tabs,
        activeKey: state.activeKey
      }), 
    }
  )
);
