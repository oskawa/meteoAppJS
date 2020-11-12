'use strict'
// Stockage des tâches
class cityStorage{

    constructor(name) {
        // name va se transormer en 'cities'
        this.name = name
        this.list = this.get()
    }

    get(){
        // Si l'utilisateur n'est pas encore venu sur le site, récupérer et créer un tableau vide
        if (!localStorage.getItem(this.name)){
            localStorage.setItem(this.name, '[]')
        }
        //Transformer la chaîne de caractère en tableau
        return JSON.parse(localStorage.getItem(this.name))
    }

    set(value){
        //ajouter en fin de tableau une valeur
        this.list.push(value)
        //Ecraser ancienne valeur et sauvegarde
        // Stringify : tableau en chaine de caractère pour la sauvegarde
        localStorage.setItem(this.name, JSON.stringify(this.list))

    }

    remove(value){
        // Récupérer un élément du tableau en fonction de sa position
        const index = this.list.indexOf(value)
        // Splice permet de supprimer des éléments
        this.list.splice(index, 1)
        localStorage.setItem(this.name, JSON.stringify(this.list))

    }

    clear(){
        localStorage.removeItem(this.name)

    }
}