// название, его владелец и количество звезд 
class CreatorElements {
    constructor() {
        this.form = document.querySelector('.form');
        this.resultSearch = document.querySelector('.result-container');
        this.resultContainer = document.querySelector('.repositories-added');
        this.searchLine = this.createElement('input', 'input-search');
        this.searchLine.placeholder = 'Введите название';
        this.form.prepend(this.searchLine);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createResultSearch(itemData) {
        const item = this.createElement('li', 'added-item');
        const itemName = this.createElement('p', 'item-name');
        itemName.innerText = itemData.name;
        item.addEventListener('click', () => this.createRersultContainer(itemData));

        item.prepend(itemName);
        return this.resultSearch.append(item);
    }
    createRersultContainer(itemData) {
        this.resultSearch.textContent = '';
        const item = this.createElement('li', 'container-add-item');
        const itemContainer = this.createElement('div', 'container-add-left');
        const itemName = this.createElement('p', 'container-add-left__subtitle');
        itemName.innerText = 'Name: ' + itemData.name;
        const itemOwner = this.createElement('p', 'container-add-left__subtitle');
        itemOwner.innerText = 'Owner: ' + itemData.owner.login;
        const itemStars = this.createElement('p', 'container-add-left__subtitle');
        itemStars.innerText = 'Stars: ' + itemData.stargazers_count;
        itemContainer.append(itemName, itemOwner, itemStars);
        const itemDelete = this.createElement('div', 'container-delete');
        const itemImageDelFirst = this.createElement('img', 'image-delete');
        const itemImageDelSecond = this.createElement('img', 'image-delete');
        itemImageDelFirst.src = './images/Vector 8.svg';
        itemImageDelSecond.src = './images/Vector 8.svg';
        itemImageDelFirst.alt = 'Удалить';
        itemImageDelSecond.alt = 'Удалить';
        itemDelete.append(itemImageDelFirst, itemImageDelSecond);
        itemDelete.addEventListener('click', function () {
            item.remove();
        })
        item.append(itemContainer, itemDelete)
        this.searchLine.value = '';

        return this.resultContainer.prepend(item);
    }
}

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchLine.addEventListener('input', this.debounceSearch(this.searchRepositories, 500));

    }
    debounceSearch(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);

            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    };

    async searchRepositories() {
        if (this.view.searchLine.value !== '') {
            this.clearRepositories();
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchLine.value}`)
                .then((res) => {


                    res.json()
                        .then(res => {
                            res.items
                                .slice(0, 4)
                                .forEach(item => {
                                    this.view.createResultSearch(item);
                                })


                        })

                        .catch((err) => {
                            throw new Error('Ошибка, неверный адрес api: ', err.name);
                        })
                })
        }
        else {
            this.clearRepositories();
        }
    }

    clearRepositories() {
        this.view.resultSearch.textContent = '';
    }
}

let result = new Search(new CreatorElements());







