import { setupFilterButtons} from '../worksFilter.js';
import { editMode} from '../editMode.js';

/**
 *  Efface les cookies 
 */
function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, _] = cookie.trim().split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

/**
 * Récupère les informations utilisateur dans les cookies du navigateur 
 * @returns  userId et Token 
 */
export function getUserDataFromCookies() {
  const cookies = document.cookie.split(";");
  let userData = {
    userId: null,
    token: null,
  };

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "userId") {
      userData.userId = value;
    }
    if (name === "token") {
      userData.token = value;
    }
  }
  return userData;
}

/**
 * @returns true si user.id et token sont définis , false en cas contraire
 */
function checkSession() {
  const userData = getUserDataFromCookies();
  if(userData.userId && userData.token) {
    return true
  }
  else {
   return false 
  } 
}

/**
 * Remplace le lien login du header par logout
 * ajoute un événement au click pour supprimer les cookies 
 */
function loginLogout() {
  const navLog = document.getElementById("nav-login");
  if(checkSession()) {
  navLog.textContent = "logout";
  navLog.addEventListener("click", (event) => {
    event.preventDefault();
    deleteAllCookies();
    location.reload();
  });
  }
}


if (checkSession()) {
  const storedUserData = getUserDataFromCookies();
  const userId = storedUserData.userId;
  const token = storedUserData.token;
  loginLogout();
  editMode();
  // Utilisez l'ID de l'utilisateur et le token pour effectuer des opérations sécurisées
} else {
 setupFilterButtons()
}
