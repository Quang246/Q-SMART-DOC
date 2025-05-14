export default class Validations {
  static checkemail(email) {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return true;
    }
    return false;
  }
  static checkUsername(userName) {
    const regex = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/; // Bắt đầu bằng chữ cái, không chứa ký tự đặc biệt, độ dài từ 6-20 ký tự
    // Kiểm tra username với biểu thức chính quy
    if (regex.test(userName.trim())) {
      return true; // Username hợp lệ
    } else {
      return false; // Username không hợp lệ
    }
  }
  static checkUsernameLength(userName) {
    const regex = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/; // Bắt đầu bằng chữ cái, không chứa ký tự đặc biệt, độ dài từ 6-20 ký tự
    // Kiểm tra username với biểu thức chính quy
    if (regex.test(userName.trim())) {
      return true; // Username hợp lệ
    } else {
      return false; // Username không hợp lệ
    }
  }
  static checkPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^*?&()])[A-Za-z\d@#$!%^*?&()]{8,}$/;
    if (regex.test(password)) {
      return true;
    } else {
      return false;
    }
  }
  static minLength(name, minLength) {
    if (name.length < minLength) {
      return false;
    }
    return true;
  }
}
