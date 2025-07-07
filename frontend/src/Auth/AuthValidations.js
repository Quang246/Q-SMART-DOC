import Validations from "./Validations";
import message from "./message";
export default class AuthValidations {
  constructor(email, userName, password) {
    this.email = email;
    this.userName = userName;
    this.password = password;
  }

  checkValidations() {
    let errors = [];

    if (!Validations.checkemail(this.email)) {
      errors["email"] = message.emailInvalid;
    }

    if (!Validations.checkUsername(this.userName)) {
      errors["userName"] = message.usernameInvalid;
    }
    // if (!Validations.checkUsernameLength(this.userName)) {
    //   errors["userName"] = message.usernameMinLength;
    // }
    //password Validations
    if (!Validations.checkPassword(this.password)) {
      errors["password"] = message.passwordInvalid;
    }
    return errors;
  }
}
