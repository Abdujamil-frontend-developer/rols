export type IUserFeatures = {
  id: number;
  name: string;
};

export interface IUser {
  id: number;
  fullName: string;
  login: string;
  password?: string;
  phoneNumber: string;
  permissions?: IUserFeatures[];
  userRoles?: IUserFeatures[];
  last_activity: string;
  roleIds?: number[];
  permissionIds?: number[];
}

export type ModalTypes =
  | { type: "delete"; userId: number }
  | { type: "unsaved" }
  | null;

export interface UserFormProps {
  open: boolean;
  editingUser: IUser | null;
  onClose: () => void;
  onSubmit: (data: IUser) => void;
  setConfirmModal: React.Dispatch<React.SetStateAction<ModalTypes>>;
}

export interface ISelectAll {
    checked: boolean;
    field: "roleIds" | "permissionIds";
    options: { id: number }[];
    setAll: React.Dispatch<React.SetStateAction<boolean>>;
  }
