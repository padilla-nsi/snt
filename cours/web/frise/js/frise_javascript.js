//*******************VARIABLE GLOBALE **********************************

/*data est une variable globale, elle contiendra les données chargées 
par la fonction charge depuis le fichier CSV
*/

var timeline;

function charge(){
    Papa.parse('frise_data.csv', {
        header: true,  // pour que la première ligne du csv soit interprétée comme le nom des colonnes et non comme une donnée
        //  dynamicTyping: true,  // les dates seront interprétées comme des chiffres et non comme des chaînes de caractères (si on a besoin de faire des calculs dessus)
        download: true,  // permet de télécharger le fichier passé en argument directement au lieu de passer par un objet File.
        delimiter:",",
        newline: "", // auto-detection du caractère de fin de ligne
        skipEmptyLines : true,  //les lignes vides sont sautées
        complete: function (results){
            let data =  results.data;
            let frise_json = genererFrise(data);
            console.log(frise_json);
            timeline = new TL.Timeline('timeline-embed',frise_json);
            console.log(results.data)
        }
      });
}


//*******************GENERATION DE HTML*********************************

// création des div en fonction du contenu du csv parsé par Papa
function genererFrise(data) {
  let frise_json = {"title" : genererSlide(data[0]),
                    "events" : []
                   };
  console.log(data);
  for (let i = 1; i < data.length;i++){
      frise_json["events"].push(genererSlide(data[i]));
  }
  return frise_json;  
}

function suppression_espace_apres_href(chaine){
    let newchaine = '';
    let regex = /href\s+=\s+/gi;
    let match = regex.exec(chaine);
    if (match === null) {
        return chaine
    }
   else {
        for (let i = 0; i < match.length; i++){
                    newchaine = chaine.replace(match[i], match[i].replace(/\s/g,""));
                    }
        return newchaine}
}    


function conversion_guillemet(chaine){    
    let newchaine = '';
    let regex = /[\u2019,\u2018]http.+[\u2019,\u2018]/gi;
    let match = regex.exec(chaine);
    if (match === null) {
        return chaine
    }
   else {
        for (let i = 0; i < match.length; i++){
                    newchaine = chaine.replace(match[i], match[i].replace(/[\u2019,\u2018]/gi,"'"));
                    }
                console.log(newchaine);
        return newchaine}
}


function genererSlide(row){   
   return {
        "start_date": {
          "year": row["start_date_year"],
           "day": row["start_date_day"],
          "month" : row["start_date_month"]
        },
        "end_date": {
          "year": row["end_date_year"],
          "day": row["end_date_day"],
          "month" : row["end_date_month"]
        },
       "media": {
          "url": suppression_espace_apres_href(conversion_guillemet(row["media_url"])),
          "caption": suppression_espace_apres_href(conversion_guillemet(row["media_caption"])),
          "credit": suppression_espace_apres_href(conversion_guillemet(row["media_credit"]))
        },
        "text": {
          "headline": suppression_espace_apres_href(conversion_guillemet(row["text_headline"])),
          "text": suppression_espace_apres_href(conversion_guillemet(row["text_text"]))
        }       
   }    
}

    
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-charger').addEventListener('click', charge);
}   
                          );
        
