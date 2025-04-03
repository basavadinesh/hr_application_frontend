export const LoginMsgResProps = {
  head: {
    title: {
      login: "Login",
    },
  },
  body: {
    content: {
      login: "Login",
      setPassword: "Set Password",
      setPasswordPrefix: "Hello ",
      setPasswordInfo:
        "Please create a new password to access Site IQ application.",
      forgotPassword: "Forgot Password?",
      recoverPassword: "Recover Password",
      recoverPasswordPrefix: "Hello ",
      recoverPasswordInfo:
        "A confirmation code is sent to <email>. Provide the code and new password details below.",
      passwordRequirement: "Password requirement",
      passwordRequirementInfo: {
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
      newToSiteIQ: "New to SiteIQ?",
      joinNowOrLearnMore: "Join now or Learn more",
      alreadyOnSiteIQ: "Already on SiteIQ?",
      joinNow: "Join Now",
    },
    form: {
      loginId: { label: "Username / Email" },
      password: { label: "Password" },
      login: { label: "Login" },
      newPassword: { label: "New Password" },
      retypePassword: { label: "Retype Password" },
      submit: { label: "Submit" },
      ok: { label: "OK" },
      username: { label: "Username" },
      email: { label: "Email" },
      confirmationCode: {
        label: "Confirmation Code",
      },
      revover: { label: "Recover" },
      name: { label: "Name" },
      company: { label: "Company" },
      message: { label: "Message" },
    },
    notification: {
      success: {
        loginPass: "Login Successful.",
        setPasswordPass: "Your Password is updated successfully.",
        recoverPasswordPass: "Your Password is updated successfully.",
      },
      error: {
        loginFail: "Incorrect Username or Password.",
        defaultError: "An error has occured, please try later.",
        loginId: {
          empty: "Username / Email is required.",
        },
        password: {
          empty: "Password is required.",
        },
        newPassword: {
          empty: "New Password is required.",
          invalid: "Password is not valid.",
        },
        retypePassword: {
          empty: "Retype Password is required.",
          invalid: "New Password & Retype Password should be same.",
        },
        username: {
          empty: "Username is required.",
        },
        email: {
          empty: "Email Address is required.",
          invalid: "Email Address is not valid.",
        },
        confirmationCode: {
          empty: "Confirmation Code is required.",
        },
        name: {
          empty: "Name is required.",
        },
        company: {
          empty: "Company is required.",
        },
      },
    },
  },
};
