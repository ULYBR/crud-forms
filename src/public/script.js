document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pessoa-form');
  const pessoasList = document.getElementById('pessoas');
  const modal = document.getElementById('modal');
  const updateForm = document.getElementById('update-form');
  const closeModalBtn = document.querySelector('.modal .close');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  form.appendChild(errorMessage);

  // Função para renderizar uma pessoa na lista
  const renderPessoa = (pessoa) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>Email:</strong> ${pessoa.email}<br>
      <strong>Nome:</strong> ${pessoa.nome}<br>
      <strong>Idade:</strong> ${pessoa.idade}<br>
      <strong>Endereço:</strong> ${pessoa.endereco.rua}, ${pessoa.endereco.cidade}, ${pessoa.endereco.estado}<br>
      <button class="delete-btn" style="background-color: red;" data-id="${pessoa._id}">Deletar</button>
      <button class="update-btn" data-id="${pessoa._id}">Atualizar</button>
    `;
    pessoasList.appendChild(li);
  };

  // Função para limpar o formulário
  const clearForm = (form) => {
    form.reset();
    errorMessage.textContent = '';
  };

  // Função para carregar todas as pessoas da API e renderizar na lista
  const loadPessoas = async () => {
    try {
      const response = await fetch('http://localhost:3000/pessoa');
      const data = await response.json();
      pessoasList.innerHTML = '';
      data.forEach(pessoa => renderPessoa(pessoa));
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  // Event listener para adicionar uma pessoa
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const rua = document.getElementById('rua').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    const pessoa = {
      email,
      nome,
      idade,
      endereco: {
        rua,
        cidade,
        estado,
      }
    };

    try {
      // Adicionar a pessoa se não existir
      const response = await fetch('http://localhost:3000/pessoa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pessoa)
      });

      if (response.ok) {
        loadPessoas();
        clearForm(form);
      } else {
        console.error('Erro ao adicionar pessoa:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error);
    }
  });

  // Event listener para abrir o modal de atualização
  pessoasList.addEventListener('click', (event) => {
    if (event.target.classList.contains('update-btn')) {
      const id = event.target.getAttribute('data-id');
      openModal(id);
    }
  });

  // Event listener para fechar o modal
  closeModalBtn.addEventListener('click', closeModal);

  // Função para abrir o modal de atualização e preencher os campos com os dados da pessoa selecionada
  const openModal = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/pessoa/${id}`);
      const pessoa = await response.json();
      document.getElementById('update-id').value = pessoa._id;
      document.getElementById('update-email').value = pessoa.email;
      document.getElementById('update-nome').value = pessoa.nome;
      document.getElementById('update-idade').value = pessoa.idade;
      document.getElementById('update-rua').value = pessoa.endereco.rua;
      document.getElementById('update-cidade').value = pessoa.endereco.cidade;
      document.getElementById('update-estado').value = pessoa.endereco.estado;
      modal.style.display = 'block';
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
    }
  };

  // Função para fechar o modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Event listener para atualizar uma pessoa
 updateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  closeModal();
  const id = document.getElementById('update-id').value;
  const email = document.getElementById('update-email').value;
  const nome = document.getElementById('update-nome').value;
  const idade = parseInt(document.getElementById('update-idade').value);
  const rua = document.getElementById('update-rua').value;
  const cidade = document.getElementById('update-cidade').value;
  const estado = document.getElementById('update-estado').value;

  const updatedPessoa = {
    email,
    nome,
    idade,
    endereco: {
      rua,
      cidade,
      estado,
    }
  };

  try {
    const response = await fetch(`http://localhost:3000/pessoa/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPessoa)
    });

    if (response.ok) {
      loadPessoas();
    } else {
      console.error('Erro ao atualizar pessoa:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
  }
});


  // Event listener para deletar uma pessoa
  pessoasList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const id = event.target.getAttribute('data-id');

      try {
        const response = await fetch(`http://localhost:3000/pessoa/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          loadPessoas();
        } else {
          console.error('Erro ao deletar pessoa:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao deletar pessoa:', error);
      }
    }
  });

  // Carrega as pessoas ao carregar a página
  loadPessoas();
});
