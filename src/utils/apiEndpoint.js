export const BASE_URL = "http://localhost:8080";


//AUTHORIZATION
export const FORGOT_PASSWORD = `/api/auth/forgot_password`;
export const VERIFY_OTP = `/api/auth/verify_otp`;
export const RESET_PASSWORD_OTP = `/api/auth/reset_password`;
export const ME = `/api/auth/me`;
export const CHECK_AUTH = `/api/auth/check_auth`;
export const PAGE_ACCESS = `/api/auth/page_access`;
export const LOGIN = `/api/auth/login`;
export const LOGOUT = `/api/auth/logout`;

//ADMIN ENDPOINTS
export const USERS = `/api/users`;
export const GETUSERS = `/api/users`;
export const CREATE_SERVICE = `/api/admin/create_service`;
export const UPDATE_SERVICE = `/api/admin/update_service`;
export const UPDATE_TEMPLATE = `/api/admin/update_template`;
export const CREATE_TEMPLATE = `/api/admin/create_template`;
export const DELETE_TEMPLATE = `/api/admin/delete_template`;
export const DELETE_SERVICE = `/api/admin/delete_service`;
export const DELETE_USER = `/api/admin/delete_user`;
export const CREATE_FAQ = `/api/admin/create_faq`;
export const UPDATE_FAQ = `/api/admin/update_faq`; 
export const DELETE_FAQ = `/api/admin/delete_faq`;
export const GET_FAQ = `/api/admin/get_faqs`;
export const GET_TEMPLATES = `/api/admin/get_templates`;


//USER ENDPOINTS
export const UPDATE_ACCOUNT = `/api/users/update_account`;
export const SUBMIT_QUOTE = `/api/users/submit_quote`;
export const CREATE_ACCOUNT = `/api/users/create_account`;


//PUBLIC ENDPOINTS
export const SUBMIT_FEEDBACK = `/api/users/public/submit_feedback`;
export const GET_PUBLIC_FAQ = `/api/users/public/get_faqs`;
export const GET_SERVICES = `/api/users/public/get_services`;

