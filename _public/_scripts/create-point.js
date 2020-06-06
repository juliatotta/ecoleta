function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")
    const urlUF = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`

    fetch(urlUF)
        .then(res => res.json())
        .then(states => {
            // res => res.json() é uma função anonima que está retornando um valor

            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }

        })
}

populateUFs()


function getCities(event) {

    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    //toda vez que entrar nessa função, eu limpo o campo de cidade (antes mesmo de fazer a chamada), 
    //caso o estado mude
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            // res => res.json() é uma função anonima que está retornando um valor

            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false
        })
}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)
//procurando o select que tenha o nome uf
//o eventlistener está ouvindo a mudança (change)
//o () => é uma function anonima, chamada de arrowfunction


//Ítens de coleta
//pegar todos os li`s
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    //adicionar ou remover uma classe com js
    itemLi.classList.toggle("selected")
    const itemId = itemLi.dataset.id


    //verificar se existem itens selecionados, se sim, pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId
        return itemFound
    })


    //se já estiver selecionado, tirar da seleção 
    if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        //se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}