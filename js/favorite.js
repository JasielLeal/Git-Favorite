export class GithubUsers {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
            .then(data => data.json())
            .then(({ login, name, public_repos, followers }) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
}


export class Favorite {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favotires: ')) || []
    }

    save(){
        localStorage.setItem('@github-favotires: ', JSON.stringify(this.entries))
    }


    async add(username){
        
        try{


           const user = await GithubUsers.search(username)
            
            const userExists = this.entries.find(entry => entry.login === username)

           

            if(userExists){
                throw new Error('User já favoritado')
            }

            if(user.login === undefined || user.login === null){
                throw new Error('User não encontrado')
            }
            this.hideOn()
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error){
            alert(error.message)
        }
    }


    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoriteView extends Favorite {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }


    onAdd(){
        const addButton = this.root.querySelector('.searchInput button')

        addButton.onclick = () =>{
            const {value} = this.root.querySelector('.searchInput input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const rowTable = this.createRowTable()

            rowTable.querySelector('.user img').src = `https://github.com/${user.login}.png`
            rowTable.querySelector('.user p').textContent = user.name
            rowTable.querySelector('.user span').textContent = user.login
            rowTable.querySelector('.user a').href = `https://github.com/${user.login}`
            rowTable.querySelector('.repositories').textContent = user.public_repos
            rowTable.querySelector('.followers').textContent = user.followers

            rowTable.querySelector('.remove').onclick = () => {
                const isOk = confirm('Deseja realmente deletar?')

                if (isOk) {
                    this.delete(user)
                    this.hideOff()
                }
            }



            this.tbody.append(rowTable)
        })

    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

    createRowTable() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">  
                <img src="https://github.com/jasielleal.png" alt="">
                <a href="#" target='_blank'>
                    <p>Jasiel Leal</p>
                    <span>/JasielLeal</span>
                </a>
        </td>
        <td class="repositories">3</td>
        <td class="followers">333333</td>
        <td class="remove">
            <button>Remove</button>
        </td>
        `
        return tr;
    }

    hideOn(){
        const window = this.root.querySelector('.noFavorite')

        window.classList.add('hide')
        this.save()
    }
    hideOff(){
        const window = this.root.querySelector('.noFavorite')

        window.classList.remove('hide')
        this.save()
    }
}

