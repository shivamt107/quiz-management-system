import { useMemo } from 'react';
import { rolePermissions } from '../constants/permissions';

export const usePermissions = (userRole) => {
  const permissions = useMemo(() => {
    return rolePermissions[userRole] || [];
  }, [userRole]);

  const hasPermission = useMemo(() => {
    return (permission) => permissions.includes(permission);
  }, [permissions]);

  return { permissions, hasPermission };
};
