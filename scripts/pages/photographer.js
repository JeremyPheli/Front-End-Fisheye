//on recupere l'id du photographe dans l'url
const searchParams = new URLSearchParams(location.search);
const photographerId = +searchParams.get("id");
let photographer;
let orderBy = "title";
let medias;
const likes = [];

//  on crée une fonction pour récupérer les infos du photographe
(async () => {
  try {
    //on attend une reponse de la requete fetch pour recuperer les infos du photographe
    const response = await fetch("./data/photographers.json");
    //on attend une reponse de la requete fetch pour recuperer les donnes en JSON
    const data = await response.json();
    //on affecte les infos du photographe a la variable photographer
    photographer = data.photographers.find(
      (photographer) => photographer.id === photographerId
    );
    //on affecte les medias du photographe a la variable medias
    medias = data.media.filter(
      (media) => media.photographerId === photographerId
    );
    //on appelle la fonction orderMedias qui effectue un premier tri des medias
    orderMedias(photographer);
    //on appelle la fonction fillHeader qui affiche les infos du photographe
    fillHeader(photographer);
    //on appelle la fonction displayLikePrice qui affiche le nombre de likes et le tarif journalier du photographe
    displayLikePrice(medias, photographer.price);
    //on cree un évenement qui verifie que la modal est affiché
    addEventListener("keydown", (event) => {
      if (media_modal.style.display !== "none") {
        //on verifie que la touche left est appuyer
        if (event.code === "ArrowLeft") {
          return changeMedia("left");
        }
        //on verifie que la touche right est appuyer
        if (event.code === "ArrowRight") {
          return changeMedia("right");
        }
        if (event.code === "Escape") {
          return closeMediaModal();
        }
      }
      if (
        contact_modal.style.display &&
        contact_modal.style.display !== "none"
      ) {
        if (event.code === "Escape") {
          contact_modal.style.display = "none";
        }
      }
    });
    // //Dès que l'utilisateur modifie la valeur de trie des medias on appelle la fonction orderMedias qui retrie les medias en fonction de la nouvelle valeur de tri
    const menuChange = dropdown.querySelector(".menu");
    const date = document.getElementById("date");
    const title = document.getElementById("title");
    const pop = document.getElementById("pop");

    menuChange.addEventListener("click", (event) => {
      console.log(event);
      if ((event.target = date)) {
        orderMedias(photographer, (orderBy = "date"));
      }
    });

    menuChange.addEventListener("click", (event) => {
      console.log(event);
      if ((event.target = title)) {
        orderMedias(photographer, (orderBy = "title"));
      }
    });

    menuChange.addEventListener("click", (event) => {
      console.log(event);
      if ((event.target = pop)) {
        orderMedias(photographer, (orderBy = "pop"));
      }
    });

    //on va chercher le titre qui se situe dans contact modal dans le DOM
    const contactTitle = document.querySelector("#contact_modal h2");
    //on ajoute le nom du photographe au titre de la modal
    contactTitle.textContent += " " + photographer.name;
    //on definie une erreur si le fetch ne fonctionne pas
  } catch (error) {
    console.error(error);
    const errorElement = document.createElement("h2");
    errorElement.classList.add("photographers_error");
    errorElement.textContent =
      "Erreur lors de la récupération des données des photographes.";
    main.appendChild(errorElement);
  }
})(); //on appelle la fonction

function fillHeader(photographer) {
  //on cible les éléments du DOM qui contiennent les infos du photographe
  const { name, city, country, tagline, portrait } = photographer;
  const nameElement = document.querySelector(".photograph_infos > h1");
  const locationElement = document.querySelector(
    ".photograph_infos > p:nth-child(2)"
  );
  const taglineElement = document.querySelector(
    ".photograph_infos > p:last-child"
  );
  const header = document.querySelector(".photograph-header");
  //on crée un élément img pour afficher la photo de profil du photographe
  const image = document.createElement("img");
  //on ajoute les attributs à nos éléments
  nameElement.textContent = name;
  locationElement.textContent = city + ", " + country;
  taglineElement.textContent = tagline;
  image.src = `./assets/photographers/${portrait}`;
  image.alt = photographer.name;
  //on ajoute l'élément à son parent
  header.appendChild(image);
}

// on crée une fonction qui affiche le nombre de like et le tarif journalier des photographes
function displayLikePrice(medias, price) {
  const element = document.querySelector(".photograph_likeprice");

  element.children[0].textContent =
    medias.reduce((sum, media) => sum + media.likes, 0) + " ♥";
  element.children[1].textContent = price + "€ / jour";
}

// on crée une fonction qui trie les médias

function orderMedias(photographer, orderBy = "pop") {
  switch (orderBy) {
    //trie par popularité
    case "pop": {
      medias.sort((a, b) => b.likes - a.likes);
      break;
    }
    //trie par date
    case "date": {
      medias.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    }
    //trie par titre
    case "title": {
      medias.sort((a, b) => a.title.localeCompare(b.title));
      break;
    }
  }
  //on appelle la fonction qui affiche les médias
  displayMedias(photographer, medias);
}

// on crée la fonction qui affiche les médias
function displayMedias(photographer, medias) {
  //on cible l'element dans le DOM
  const mediasSection = document.getElementById("photograph_medias");
  //on definie l'attribut de l'element
  mediasSection.innerHTML = "";

  for (const media of medias) {
    //on crée les éléments qui vont contenir les medias
    const article = document.createElement("article");
    const link = document.createElement("a");
    const mediaElement = media.video
      ? document.createElement("video")
      : document.createElement("img");
    const divInfos = document.createElement("div");
    const spanName = document.createElement("span");
    const spanLike = document.createElement("span");
    //on ajoute les attributs à nos éléments
    article.dataset.id = media.id;
    link.href = "#";
    mediaElement.src = `./assets/photographers/${photographer.name
      .split(" ")[0]
      .replace("-", " ")}/${media.video ?? media.image}`;
    mediaElement.alt = media.title;
    mediaElement.controls = false;
    mediaElement.autoplay = false;

    spanName.textContent = media.title;
    spanLike.textContent = media.likes + " ♥";
    //on crée un évènement qui écoute le click sur l'icone like et qui incrémente le nombre de like
    spanLike.onclick = ({ target }) => {
      //Si notre tableau de like contient déjà l'id du média, on retire le like au click
      if (!likes.includes(media.id)) {
        const totalLikesElement = document.querySelector(
          ".photograph_likeprice > span:first-child"
        );
        totalLikesElement.textContent =
          parseInt(totalLikesElement.textContent) + 1 + " ♥";
        target.textContent = parseInt(target.textContent) + 1 + " ♥";
        //on ajoute le media dans le tableau
        likes.push(media.id);
      }
      return;
      // if (likes.includes(media.id)) {
      //   const totalLikesElement = document.querySelector(
      //     ".photograph_likeprice > span:first-child"
      //   );
      //   totalLikesElement.textContent =
      //     parseInt(totalLikesElement.textContent) - 1 + " ♥";
      //   target.textContent = parseInt(target.textContent) - 1 + " ♥";
      //   likes.shift(media.id);
      // }
    };

    //Quand on click sur la photo on la clone et on l'ajoute a la modal
    //on va donc sélectionner le dernier enfant de la modal qui est la div vide et lui copier la photo cloner
    mediaElement.onclick = () => {
      mediaElement.autoplay = true;
      media_modal.children[media_modal.children.length - 1].appendChild(
        mediaElement.cloneNode()
      );
      media_modal.children[media_modal.children.length - 1].appendChild(
        spanName.cloneNode(true)
      );
      //fait disparaite pour qu'il n'y est rien derrière la modal
      media_modal.style.display = "inherit";
      //on évite que la barre de défilement apparaisse
      document.body.style.overflow = "hidden";
    };

    //on ajoute l'élément a son parent
    link.appendChild(article);
    article.appendChild(mediaElement);
    article.appendChild(divInfos);
    divInfos.appendChild(spanName);
    divInfos.appendChild(spanLike);
    mediasSection.appendChild(link);
  }
}

function changeMedia(direction) {
  //on cible l'élément de contenu de la modal
  const media =
    media_modal.children[media_modal.children.length - 1].children[0];
  //on supprime le span qui contient le nom du media
  media_modal.children[media_modal.children.length - 1].children[1].remove();
  //on récupère le nom du fichier du média actuel
  const mediaSrc = media.src.split("/").pop(); //on crée un tableau avec split qui va séparer les éléments du chemin du fichier et avec pop on récupere le dernier élément du tableau qui est le nom du fichier
  const mediaIndex = medias.indexOf(
    medias.find((el) => (el.video ?? el.image) === mediaSrc)
  );
  //on supprime le media
  media.remove();

  //on défini la nouvelle valeur de l'index en fonction de la direction
  let newIndex = 0;

  if (direction === "left") {
    newIndex = mediaIndex - 1;
    if (newIndex < 0) {
      newIndex = medias.length - 1;
    }
  } else if (direction === "right") {
    newIndex = mediaIndex + 1;
    if (newIndex >= medias.length) {
      newIndex = 0;
    }
  }
  //on crée un nouvel élément qui va contenir le nouveau media et qui verifie si c'est une video ou une image
  const mediaElement = medias[newIndex].video
    ? document.createElement("video")
    : document.createElement("img");
  //on ajoute les attributs a l'élément
  const spanName = document.createElement("span");
  //on définit le contenu des éléments
  mediaElement.src = `./assets/photographers/${photographer.name
    .split(" ")[0]
    .replace("-", " ")}/${medias[newIndex].video ?? medias[newIndex].image}`;
  mediaElement.alt = medias[newIndex].title;
  spanName.textContent = medias[newIndex].title;

  media_modal.children[media_modal.children.length - 1].appendChild(
    mediaElement
  );
  media_modal.children[media_modal.children.length - 1].appendChild(spanName);
  mediaElement.autoplay = true;
}

// supprime le contenu média ferme la modal
function closeMediaModal() {
  media_modal.children[media_modal.children.length - 1].innerHTML = "";
  media_modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// // // fonction dropwndownMenu

const dropdown = document.querySelector(".dropdown");
const select = dropdown.querySelector(".select");
const caret = dropdown.querySelector(".caret");
const menu = dropdown.querySelector(".menu");
const options = dropdown.querySelectorAll(".menu li");
const selected = dropdown.querySelector(".selected");

select.addEventListener("click", () => {
  select.classList.toggle("select-clicked");
  caret.classList.toggle("caret-rotate");
  menu.classList.toggle("menu-open");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    selected.innerText = option.innerText;
    select.classList.remove("select-clicked");
    caret.classList.remove("caret-rotate");
    menu.classList.remove("menu-open");
    options.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});
