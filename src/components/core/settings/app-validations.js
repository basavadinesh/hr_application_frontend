export const AppValidations = {
  identity: {
    username: /^[a-zA-Z][\w,.]*[a-zA-Z0-9]$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`])\S{8,30}$/,
    //email: /^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/,
    firstName: /^[A-Za-z0-9 .]{2,50}$/,
    lastName: /^[A-Za-z0-9 .]{2,50}$/,
    zipCode: /^[0-9]{5}(-[0-9]{4})?/,
  },
};
