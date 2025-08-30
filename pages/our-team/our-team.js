function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function shuffleTeamMembers() {
  // Simple animation for page load
  document.addEventListener("DOMContentLoaded", function () {
    const members = document.querySelectorAll(".member");
    members.forEach((member, index) => {
      member.style.opacity = "0";
      member.style.transform = "translateY(20px)";

      setTimeout(() => {
        member.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        member.style.opacity = "1";
        member.style.transform = "translateY(0)";
      }, 100 + index * 150);
    });
  });
  const teamMembers = document.querySelectorAll(".ot-wrapper > div");
  const array = shuffleArray([1, 2, 3, 4, 5]);
  for (let i = 0; i < teamMembers.length; i++) {
    teamMembers[i].style.order = array[i];
  }
}
