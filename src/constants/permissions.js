export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  PUBLIC: 'PUBLIC'
});

export const Permission = Object.freeze({
  CREATE_QUIZ: 'CREATE_QUIZ',
  EDIT_QUIZ: 'EDIT_QUIZ',
  DELETE_QUIZ: 'DELETE_QUIZ',
  VIEW_QUIZ: 'VIEW_QUIZ'
});

export const rolePermissions = Object.freeze({
  [UserRole.ADMIN]: [
    Permission.CREATE_QUIZ,
    Permission.EDIT_QUIZ,
    Permission.DELETE_QUIZ,
    Permission.VIEW_QUIZ
  ],
  [UserRole.PUBLIC]: [Permission.VIEW_QUIZ, Permission.START_QUIZ,]
});
