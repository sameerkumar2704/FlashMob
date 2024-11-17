export async function getAvatarUsingInitialCharcter(username) {
  return await fetch(`https://ui-avatars.com/api/?name=${username}`);
}
