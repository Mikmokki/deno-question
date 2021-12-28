import { bcrypt, validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";
const registrationValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};
const getRegistrationData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};
const registerUser = async ({ request, response, render }) => {
  const registrationData = await getRegistrationData(request);
  const [passes, errors] = await validasaur.validate(
    registrationData,
    registrationValidationRules,
  );
  if (!passes) {
    registrationData.validationErrors = errors;
    console.log(errors);
    render("auth/registration.eta", registrationData);
  } else {
    await userService.addUser(
      registrationData.email,
      await bcrypt.hash(registrationData.password),
    );
    response.redirect("/auth/login");
  }
};

const showRegistrationForm = ({ render }) => {
  render("auth/registration.eta");
};
const showLoginForm = ({ render }) => {
  render("auth/login.eta");
};
const processLogin = async ({ request, response, render, state }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(
    params.get("email"),
  );
  if (userFromDatabase.length != 1) {
    return render("auth/login.eta", {
      error: "The username or password you have entered is invalid.",
    });
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  if (!passwordMatches) {
    return render("auth/login.eta", {
      error: "The username or password you have entered is invalid.",
    });
  }

  await state.session.set("user", user);
  response.redirect("/questions");
};

const logOut = async ({ response, state }) => {
  await state.session.set("user", null);
  response.redirect("/");
};

export {
  logOut,
  processLogin,
  registerUser,
  showLoginForm,
  showRegistrationForm,
};
