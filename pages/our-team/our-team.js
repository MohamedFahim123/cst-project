function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function shuffleTeamMembers() {
  const teamMembers = document.querySelectorAll(".ot-wrapper > div");
  const array = shuffleArray([1, 2, 3, 4, 5]);
  for (let i = 0; i < teamMembers.length; i++) {
    teamMembers[i].style.order = array[i];
  }
}
