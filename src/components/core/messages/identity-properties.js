export const IdentityMsgResProps = {
  head: {
    title: {
      account: "Account",
    },
  },
  body: {
    navigation: {
      user: "User",
      myAccount: "My Account",
      logout: "Logout",
      notification: "Notification"
    },
    content: {
      myAccount: "My Account",
      changePassword: "Change Password",
      updateProfile: "Update Profile",
      logout: "Logout",
      logoutConfirmation: "Are you sure you want to Logout?",
      noDataFound: "No data found",
    },
    form: {
      username: {
        label: "Username",
      },
      email: {
        label: "Email",
      },
      currentPassword: {
        label: "Current Password",
      },
      newPassword: {
        label: "New Password",
        info: {
          header: "Password requirement",
          text:
            "Minimum of 8 characters.\n" +
            "Must contain a lower case letter.\n" +
            "Must contain an upper case letter.\n" +
            "Must contain a number.\n" +
            "Must contain a special character form this set:\n" +
            "^ $ * . [ ] { } ( ) ? \" ! @ # % & /  , > < ' : ; | _ ~ `\n\n" +
            "The plus '+', minus '-', equals '=' sign do not meet special character requirement.",
        },
      },
      retypePassword: {
        label: "Retype Password",
      },
      firstName: {
        label: "First Name",
      },
      lastName: {
        label: "Last Name",
      },
      mobile: {
        label: "Mobile",
      },
      streetAddress1: {
        label: "Street Address 1",
      },
      streetAddress2: {
        label: "Street Address 2",
      },
      city: {
        label: "City",
      },
      state: {
        label: "State",
      },
      country: {
        label: "Country",
      },
      zipCode: {
        label: "ZIP Code",
      },
    },
    notification: {
      success: {
        changePasswordPass: "Your Password is updated successfully.",
        updateProfilePass: "Your Profile is updated successfully.",
      },
      error: {
        message: "An error has occured.",
        changePasswordFail: "Password information provided is not correct.",
        updateProfileFail: "Unable to update the Profile information.",
        currentPassword: {
          empty: "Current Password is required.",
          invalid: "Current Password is not valid.",
        },
        newPassword: {
          empty: "New Password is required.",
          invalid: "New Password is not valid.",
        },
        retypePassword: {
          empty: "Retype Password is required.",
          invalid: "Password and Retype Password should be same.",
        },
        firstName: {
          empty: "First Name is required.",
          invalid: "First Name is not valid.",
        },
        lastName: {
          empty: "Last Name is required.",
          invalid: "Last Name is not valid.",
        },
        email: {
          empty: "Email Address is required.",
          invalid: "Email Address is not valid.",
          duplicate: "Email Address already exists.",
        },
        mobile: {
          empty: "Mobile Number is required.",
          invalid: "Mobile Number is not valid.",
        },
        zipCode: {
          invalid: "ZIP Code is not valid.",
        },
      },
    },
  },
};
