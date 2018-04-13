export const getUserToken = () =>
  localStorage.getItem('Meteor.loginToken') || null
