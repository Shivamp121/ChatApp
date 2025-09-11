import { useDispatch } from "react-redux";
import { apiConnector } from "../apiconnecter";
import toast from "react-hot-toast";
import { clearNotification, setChats, setSelectedChat, setUser } from "../../slices/chatSlice";
// import { setLoading } from "../slices/authSlice";  // uncomment if you have setLoading in Redux


export function signUp(
  name,
  email,
  password,
  confirmPassword,
  pic,   // file object
  navigate
) {
  return async(dispatch)=>{
    const toastId = toast.loading("Loading...");
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (pic) {
      formData.append("pic", pic);
    }

    const response = await apiConnector(
      "POST",
      "https://chatapp-server-blzi.onrender.com/api/v1/auth/signup",
      formData,
    );

    // console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    toast.success("Signup Successful");
    
  } catch (error) {
    console.error("SIGNUP API ERROR............", error);
    toast.error(error.response?.data?.message || "Signup Failed");
  } finally {
    toast.dismiss(toastId);
  }
  }
}


export function login(email, password, navigate) {
  return async (dispatch)=>{
    const toastId = toast.loading("Logging in...");
  
  try {
    const response = await apiConnector(
      "POST",
      "https://chatapp-server-blzi.onrender.com/api/v1/auth/login",
      { email, password },
      { "Content-Type": "application/json" }
    );

    // console.log("LOGIN API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    dispatch(setUser(response?.data?.user));
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    toast.success("Login Successful");
    navigate("/chat");
  } catch (error) {
    console.error("LOGIN API ERROR............", error);
    toast.error(error.response?.data?.message || "Login Failed");
  } finally {
    toast.dismiss(toastId);
  }
  }
}
export const logout = () => (dispatch) => {
  // clear redux user
  dispatch(setUser(null));
  // optionally clear other states
  dispatch(setSelectedChat(null));
  dispatch(clearNotification());
  dispatch(setChats([]));
};
