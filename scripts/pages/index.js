async function getPhotographers() {
  try {
    //Création d'une requête fetch pour recuperer les infos du photographe
    const response = await fetch("./data/photographers.json");
    //on attend une reponse de la requête fetch pour récuperer les infos du photographe
    const data = await response.json();
    //on retourne les infos du photographe
    return data;
    //on definie un erreur si la requête fetch ne fonctionne pas
  } catch (error) {
    console.error(error);
    const errorElement = document.createElement("h2");
    errorElement.classList.add("photographers_error");
    errorElement.textContent = "Erreur lors de la récupération des données.";
    main.appendChild(errorElement);
    return { photographers: [] };
  }
}

//
async function displayData(photographers) {
  //on recupere les elements du DOM
  const photographersSection = document.querySelector(".photographer_section");
  //on boucle sur les infos du photographe
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}
//on appel la fonction init
init();
