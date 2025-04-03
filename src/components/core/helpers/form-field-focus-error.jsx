import { useEffect } from "react";
import { useFormikContext } from "formik";

const FormFieldFocusError = () => {
  const { errors, isSubmitting, isValidating } = useFormikContext();

  useEffect(() => {
    if (isSubmitting && !isValidating) {
      let keys = Object.keys(errors);
      if (keys.length > 0) {
        const selector = `[name=${keys[0]}]`;
        const errorElement = document.querySelector(selector);
        if (errorElement) {
          errorElement.focus();
          //errorElement.scrollIntoView();
          window.scroll({
            top: errorElement.offsetTop,
            behavior: "smooth",
          });
        }
      }
    }
  }, [errors, isSubmitting, isValidating]);

  return null;
};

export default FormFieldFocusError;
