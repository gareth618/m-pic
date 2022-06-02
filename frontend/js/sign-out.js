function signOut() {
  localStorage.removeItem('M-PIC.user');
  window.location.href = '/sign-in';
}
