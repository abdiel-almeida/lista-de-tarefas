const Main = {

    tasks: [], //Iniciando um array vazio que será usado para adicionar as tarefas

    
    init: function(){
        this.cacheSelectors() // Neste contexto, o THIS está referenciando o Main (O pai do objeto)
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    //chave         valor
    cacheSelectors: function(){ //seleciona elementos do HTML e armazena-os em um variável
        this.$checkButtons = document.querySelectorAll('.check') // o THIS está colocando essa variável no Main, a tornando disponíveis para as outras funções
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function(){ //adiciona eventos

        const self = this // Main

        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click
        }) // o forEach é usado para selecionar todos as ocorrências do checkbutton

        //Main.$inputTask.onkeypress = Main.Events.inputTask_keypress
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButtons_click.bind(self)
        })
    },

    getStoraged: function() {//Obtem os items salvos no localStorage e os transforma em objetos
        const tasks = localStorage.getItem('tasks')
        this.tasks = JSON.parse(tasks)//Armazena os items obtidos do localStorage no objeto designado para guardar os tarefas (linha 3)
    },

    getTaskHtml: function(task,done){//Modelo de cada item da lista de tarefas [usado na função buildTasks]
        if (done){
            return `
            <li class="done">
                <div class="check"></div>
                <label for="" class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
        }
    
        return `
            <li class="">
                <div class="check"></div>
                <label for="" class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function() { //Monta a lista de tarefas de acordo com os dados armazenados no localStorage

        let html = '' //variável para armazenar temporariamente as li's que serão montadas de acordo com as tarefas salvas no localStorage
        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task,item.done)
        })


        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    //Objeto dentro de um objeto
    Events: { //Eventos que serão usados na aplicação

        //Quando clicar em concluir a tarefa, o botão será marcado adicionando a classe 'done' na div. É verificado se a classe já está adicionada para saber se tem que ser feita e exclusão ou inclusão da classe
        checkButton_click: function(e){
            console.log(e)
            const li = e.target.parentElement
            const label = e.target.nextSibling.nextSibling.innerText
            console.log(label) 

            const isDone = li.classList.contains('done')
            if (!isDone){
                li.classList.add('done')


            }

            li.classList.remove('done')
        },

        //Ao pressionar a tecla 'ENTER', o testo escrito no input vai ser adicionado como tarefa
        inputTask_keypress: function(e){
            const key = e.key //Capturando qual tecla foi pressionada
            const value = e.target.value //Valor digitado no campo input

            if(key === 'Enter'){
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = ''

                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    {task: value, done: true},
                    ...savedTasksObj, //SPREAD OPERATOR - copiar um array ou obj existem em outro
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButtons_click: function(e){
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTasksState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            },300)
        }
    }

}

Main.init()