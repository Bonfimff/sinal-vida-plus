document.addEventListener('DOMContentLoaded', async function() {
    
    // Lista de todos os IDs de select de categoria encontrados no HTML
    const seletoresCategorias = [
        'categoria-produto-consulta',   
        'categoria-entrada',           
        'categoria',                    
        'categoria-kit'                 
    ];

    // Lista de todos os IDs de select de patrimônio
    const seletoresPatrimonio = [
        'patrimonio-entrada', 
        'patrimonio',
        'patrimonio-cadastro',
        'patrimonio-consulta'
    ];

    // Lista de todos os IDs de select de local de estoque
    const seletoresLocalEstoque = [
        'local-estoque',
        'local-estoque-cadastro',
        'local-estoque-entrada'
    ];

    //  LISTA DE TODOS OS IDs DE SELECT DE FINALIDADE
    const seletoresFinalidade = [
        'retirada-finalidade',          
        'finalidade',                   
        'finalidade-entrada',           
        'finalidade-consulta'           
    ];

    //  LISTA COMPLETA DE INPUTS DE NOME DE PRODUTO (PARA SUGESTÕES)
    const seletoresNomeProduto = [
        'nome-produto',                 
        'nome-produto-entrada',         
        'nome-produto-consulta',        
        'nome-produto-kit',             
        'produto-nome',                 
        'nome-item',                    
        'produto',                      
        'retirada-produto',             
        'devolucao-produto',            
        'nome-kit'                     
    ];
    
    // Função para carregar categorias do servidor
    async function carregarCategorias() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            // Faz requisição para buscar os parâmetros
            const response = await fetch('https://api.exksvol.website/parametros/categoria', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 'ok' && data.categorias) {
                    let selectsEncontrados = 0;
                    let selectsAtualizados = 0;

                    // Itera sobre todos os seletores de categoria
                    seletoresCategorias.forEach(seletorId => {
                        const selectCategoria = document.getElementById(seletorId);
                        
                        if (selectCategoria) {
                            selectsEncontrados++;
                            
                            // Salva a primeira opção (placeholder) se existir
                            const primeiraOpcao = selectCategoria.querySelector('option[value=""]');
                            const opcaoPlaceholder = primeiraOpcao ? 
                                primeiraOpcao.cloneNode(true) : 
                                (() => {
                                    const opcao = document.createElement('option');
                                    opcao.value = '';
                                    opcao.textContent = 'Selecione uma categoria';
                                    return opcao;
                                })();
                            
                            // Limpa todas as opções
                            selectCategoria.innerHTML = '';
                            
                            // Recoloca o placeholder
                            selectCategoria.appendChild(opcaoPlaceholder);

                            // Adiciona as categorias do servidor
                            data.categorias.forEach(categoria => {
                                const option = document.createElement('option');
                                option.value = categoria.valor;
                                option.textContent = categoria.valor;
                                selectCategoria.appendChild(option);
                            });

                            selectsAtualizados++;
                        }
                    });
                } else {
                    console.warn('⚠️ Nenhuma categoria encontrada ou formato de resposta inválido');
                }
            } else {
                console.error('❌ Erro na requisição:', response.status, response.statusText);
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Detalhes do erro:', errorData);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
        }
    }

    //  FUNÇÃO ESPECÍFICA PARA CARREGAR PATRIMÔNIOS
    async function carregarPatrimonios() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            // Faz requisição para buscar os patrimônios
            const response = await fetch('https://api.exksvol.website/parametros/patrimonio', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 'ok' && data.parametros) {
                    let selectsEncontrados = 0;
                    let selectsAtualizados = 0;

                    // Itera sobre todos os seletores de patrimônio
                    seletoresPatrimonio.forEach(seletorId => {
                        const selectPatrimonio = document.getElementById(seletorId);
                        
                        if (selectPatrimonio) {
                            selectsEncontrados++;
                            
                            // Salva a primeira opção (placeholder) se existir
                            const primeiraOpcao = selectPatrimonio.querySelector('option[value=""]');
                            const opcaoPlaceholder = primeiraOpcao ? 
                                primeiraOpcao.cloneNode(true) : 
                                (() => {
                                    const opcao = document.createElement('option');
                                    opcao.value = '';
                                    opcao.textContent = 'Selecione um patrimônio';
                                    return opcao;
                                })();
                            
                            // Limpa todas as opções
                            selectPatrimonio.innerHTML = '';
                            
                            // Recoloca o placeholder
                            selectPatrimonio.appendChild(opcaoPlaceholder);

                            // Adiciona os patrimônios do servidor
                            data.parametros.forEach(patrimonio => {
                                const option = document.createElement('option');
                                option.value = patrimonio.valor;
                                option.textContent = patrimonio.valor;
                                selectPatrimonio.appendChild(option);
                            });

                            selectsAtualizados++;
                        }
                    });
                } else {
                    console.warn('⚠️ Nenhum patrimônio encontrado ou formato de resposta inválido');
                }
            } else {
                console.error('❌ Erro na requisição de patrimônio:', response.status, response.statusText);
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Detalhes do erro:', errorData);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar patrimônios:', error);
        }
    }

    //  FUNÇÃO ESPECÍFICA PARA CARREGAR LOCAIS DE ESTOQUE
    async function carregarLocaisEstoque() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            // Faz requisição para buscar os locais de estoque
            const response = await fetch('https://api.exksvol.website/parametros/localEstoque', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 'ok' && data.parametros) {
                    let selectsEncontrados = 0;
                    let selectsAtualizados = 0;

                    // Itera sobre todos os seletores de local de estoque
                    seletoresLocalEstoque.forEach(seletorId => {
                        const selectLocalEstoque = document.getElementById(seletorId);
                        
                        if (selectLocalEstoque) {
                            selectsEncontrados++;
                            
                            // Salva a primeira opção (placeholder) se existir
                            const primeiraOpcao = selectLocalEstoque.querySelector('option[value=""]');
                            const opcaoPlaceholder = primeiraOpcao ? 
                                primeiraOpcao.cloneNode(true) : 
                                (() => {
                                    const opcao = document.createElement('option');
                                    opcao.value = '';
                                    opcao.textContent = 'Selecione um local de estoque';
                                    return opcao;
                                })();
                            
                            // Limpa todas as opções
                            selectLocalEstoque.innerHTML = '';
                            
                            // Recoloca o placeholder
                            selectLocalEstoque.appendChild(opcaoPlaceholder);

                            // Adiciona os locais de estoque do servidor
                            data.parametros.forEach(localEstoque => {
                                const option = document.createElement('option');
                                option.value = localEstoque.valor;
                                option.textContent = localEstoque.valor;
                                selectLocalEstoque.appendChild(option);
                            });

                            selectsAtualizados++;
                        }
                    });
                } else {
                    console.warn('⚠️ Nenhum local de estoque encontrado ou formato de resposta inválido');
                }
            } else {
                console.error('❌ Erro na requisição de local de estoque:', response.status, response.statusText);
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Detalhes do erro:', errorData);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar locais de estoque:', error);
        }
    }

    //  FUNÇÃO ESPECÍFICA PARA CARREGAR FINALIDADES
    async function carregarFinalidades() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            // Faz requisição para buscar as finalidades
            const response = await fetch('https://api.exksvol.website/parametros/finalidade', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 'ok' && data.parametros) {
                    let selectsEncontrados = 0;
                    let selectsAtualizados = 0;

                    // Itera sobre todos os seletores de finalidade
                    seletoresFinalidade.forEach(seletorId => {
                        const selectFinalidade = document.getElementById(seletorId);
                        
                        if (selectFinalidade) {
                            selectsEncontrados++;
                            
                            // Salva a primeira opção (placeholder) se existir
                            const primeiraOpcao = selectFinalidade.querySelector('option[value=""]');
                            const opcaoPlaceholder = primeiraOpcao ? 
                                primeiraOpcao.cloneNode(true) : 
                                (() => {
                                    const opcao = document.createElement('option');
                                    opcao.value = '';
                                    opcao.textContent = 'Selecione uma finalidade';
                                    return opcao;
                                })();
                            
                            // Limpa todas as opções
                            selectFinalidade.innerHTML = '';
                            
                            // Recoloca o placeholder
                            selectFinalidade.appendChild(opcaoPlaceholder);

                            // Adiciona as finalidades do servidor
                            data.parametros.forEach(finalidade => {
                                const option = document.createElement('option');
                                option.value = finalidade.valor;
                                option.textContent = finalidade.valor;
                                selectFinalidade.appendChild(option);
                            });

                            selectsAtualizados++;
                        }
                    });
                } else {
                    console.warn('⚠️ Nenhuma finalidade encontrada ou formato de resposta inválido');
                }
            } else {
                console.error('❌ Erro na requisição de finalidade:', response.status, response.statusText);
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Detalhes do erro:', errorData);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar finalidades:', error);
        }
    }

    // Função para carregar outras opções (unidade de medida, fornecedor, etc.)
    async function carregarOutrosParametros() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            //  MAPEAMENTO REDUZIDO (patrimonio, localEstoque e finalidade agora têm funções próprias)
            const parametrosMap = {
                'unidadeMedida': [  
                    'unidade-medida',           
                    'unid-medida-entrada',      
                    'unid-medida',              
                    'unidade-medida-consulta',  
                    'unid-medida-kit'          
                ],
                'local-destino': [
                    'retirada-local',
                    'local-destino'
                ],
                'fornecedor': [
                    'fornecedor',
                    'fornecedor-entrada',
                    'fornecedor-cadastro'
                ]
            };

            // Para cada tipo de parâmetro, busca e carrega as opções
            for (const [tipoParametro, seletores] of Object.entries(parametrosMap)) {
                try {
                    const response = await fetch(`https://api.exksvol.website/parametros/${tipoParametro}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        
                        if (data.status === 'ok' && data.parametros) {
                            let seletoresEncontrados = 0;
                            
                            seletores.forEach(seletorId => {
                                const select = document.getElementById(seletorId);
                                if (select) {
                                    seletoresEncontrados++;
                                    
                                    // Preserva opção padrão
                                    const opcaoPadrao = select.querySelector('option[value=""]');
                                    const placeholder = opcaoPadrao ? 
                                        opcaoPadrao.cloneNode(true) : 
                                        (() => {
                                            const opcao = document.createElement('option');
                                            opcao.value = '';
                                            opcao.textContent = `Selecione ${tipoParametro.replace('-', ' ')}`;
                                            return opcao;
                                        })();
                                    
                                    select.innerHTML = '';
                                    select.appendChild(placeholder);

                                    // Adiciona as opções do servidor
                                    data.parametros.forEach(param => {
                                        const option = document.createElement('option');
                                        option.value = param.valor;
                                        option.textContent = param.valor;
                                        select.appendChild(option);
                                    });
                                }
                            });
                        } else {
                            console.warn(`⚠️ Nenhum parâmetro encontrado para ${tipoParametro}`);
                        }
                    } else {
                        console.warn(`⚠️ Erro ao buscar ${tipoParametro}: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`❌ Erro ao carregar ${tipoParametro}:`, error);
                }
            }

        } catch (error) {
            console.error('❌ Erro ao carregar outros parâmetros:', error);
        }
    }

    //  FUNÇÃO ESPECÍFICA PARA CARREGAR SUGESTÕES DE NOMES DE PRODUTOS
    async function carregarSugestoesProdutos() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Token não encontrado');
                return;
            }

            // Faz requisição para buscar os nomes de produtos
            const response = await fetch('https://api.exksvol.website/produtos/sugestoes-nomes', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 'ok' && data.nomes && data.nomes.length > 0) {
                    let inputsEncontrados = 0;
                    let inputsAtualizados = 0;

                    // Itera sobre todos os inputs de nome de produto
                    seletoresNomeProduto.forEach(seletorId => {
                        const inputNome = document.getElementById(seletorId);
                        
                        if (inputNome) {
                            inputsEncontrados++;
                            
                            // Cria lista de sugestões (datalist)
                            let datalistId = `${seletorId}-sugestoes`;
                            let datalist = document.getElementById(datalistId);
                            
                            // Se não existe, cria o datalist
                            if (!datalist) {
                                datalist = document.createElement('datalist');
                                datalist.id = datalistId;
                                document.body.appendChild(datalist);
                            }
                            
                            // Limpa sugestões antigas
                            datalist.innerHTML = '';

                            // Adiciona as sugestões de nomes de produtos
                            data.nomes.forEach(nomeProduto => {
                                const option = document.createElement('option');
                                option.value = nomeProduto.nome;
                                option.textContent = nomeProduto.nome;
                                datalist.appendChild(option);
                            });

                            //  ASSOCIA O DATALIST AO INPUT
                            inputNome.setAttribute('list', datalistId);
                            
                            //  VERIFICA SE JÁ EXISTE UM DATALIST HARDCODED NO HTML
                            const existingDatalist = inputNome.getAttribute('list');
                            if (existingDatalist && existingDatalist !== datalistId) {
                                const oldDatalist = document.getElementById(existingDatalist);
                                if (oldDatalist) {
                                    // Copia as opções antigas para o novo datalist
                                    Array.from(oldDatalist.options).forEach(oldOption => {
                                        const newOption = document.createElement('option');
                                        newOption.value = oldOption.value;
                                        newOption.textContent = oldOption.textContent;
                                        datalist.appendChild(newOption);
                                    });
                                }
                            }

                            inputsAtualizados++;
                        }
                    });
                } else {
                    console.warn('⚠️ Nenhuma sugestão de produto encontrada ou formato de resposta inválido');
                }
            } else {
                console.error('❌ Erro na requisição de sugestões de produtos:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('❌ Detalhes do erro:', errorText);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar sugestões de produtos:', error);
        }
    }

    // Função para recarregar categorias (pode ser chamada externamente)
    window.recarregarCategorias = function() {
        carregarCategorias();
    };

    //  NOVAS FUNÇÕES DE RECARGA ESPECÍFICAS
    window.recarregarPatrimonios = function() {
        carregarPatrimonios();
    };

    window.recarregarLocaisEstoque = function() {
        carregarLocaisEstoque();
    };

    window.recarregarFinalidades = function() {
        carregarFinalidades();
    };

    //  ADICIONE NOVA FUNÇÃO DE RECARGA ESPECÍFICA
    window.recarregarSugestoesProdutos = function() {
        carregarSugestoesProdutos();
    };

    // Função para recarregar todos os parâmetros
    window.recarregarTodosParametros = function() {
        carregarCategorias();
        carregarPatrimonios();      
        carregarLocaisEstoque();
        carregarFinalidades();
        carregarSugestoesProdutos(); 
        carregarOutrosParametros();
    };

    //  CARREGA TODAS AS FUNÇÕES AUTOMATICAMENTE AO INICIALIZAR
    await carregarCategorias();
    await carregarPatrimonios();      
    await carregarLocaisEstoque();
    await carregarFinalidades();
    await carregarSugestoesProdutos(); 
    await carregarOutrosParametros();
});

// Função utilitária para debug (opcional)
function debugParametros() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select, index) => {
        console.log(`Select ${index + 1}:`, {
            id: select.id,
            name: select.name,
            options: select.options.length,
            valores: Array.from(select.options).map(opt => opt.value).filter(val => val !== '')
        });
    });
}

// Função para verificar quais selects de categoria existem na página
function debugCategorias() {
    const seletoresCategorias = [
        'categoria-produto-consulta',
        'categoria-entrada', 
        'categoria',
        'categoria-kit'
    ];
    
    seletoresCategorias.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
          
        } else {
            console.log(`❌ #${id} NÃO encontrado`);
        }
    });
}

//  NOVAS FUNÇÕES DE DEBUG ESPECÍFICAS
function debugPatrimonios() {
    const seletoresPatrimonio = [
        'patrimonio-entrada', 
        'patrimonio',
        'patrimonio-cadastro',
        'patrimonio-consulta'
    ];
    
    seletoresPatrimonio.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            console.log(`   Valores:`, Array.from(select.options).map(opt => opt.value).filter(val => val !== ''));
        } else {
            console.log(`❌ #${id} NÃO encontrado`);
        }
    });
}

function debugLocaisEstoque() {
    const seletoresLocalEstoque = [
        'local-estoque',
        'local-estoque-cadastro',
        'local-estoque-entrada'
    ];
    
    seletoresLocalEstoque.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
          
            console.log(`   Valores:`, Array.from(select.options).map(opt => opt.value).filter(val => val !== ''));
        } else {
            console.log(`❌ #${id} NÃO encontrado`);
        }
    });
}

// Função para debug específico do unid-medida
function debugUnidadeMedida() {
    const select = document.getElementById('unid-medida');
    
    if (select) {
        console.log('✅ Elemento encontrado:', {
            id: select.id,
            name: select.name,
            required: select.required,
            options: select.options.length,
            valores: Array.from(select.options).map(opt => ({
                value: opt.value,
                text: opt.textContent
            }))
        });
        
        // Testa se as opções estão funcionando
        if (select.options.length > 1) {
            console.log('✅ Opções carregadas com sucesso!');
        } else {
            console.log('❌ Nenhuma opção carregada');
        }
    } else {
        console.log('❌ Elemento #unid-medida NÃO encontrado');
        document.querySelectorAll('select').forEach(s => {
            console.log(`  - #${s.id || 'sem-id'} (name: ${s.name || 'sem-name'})`);
        });
    }
}

//  NOVA FUNÇÃO DE DEBUG ESPECÍFICA PARA PRODUTOS
function debugSugestoesProdutos() {
    const seletoresNomeProduto = [
        'nome-produto',
        'nome-produto-entrada',
        'nome-produto-consulta',
        'nome-produto-kit',
        'produto-nome',
        'nome-item',
        'produto',
        'retirada-produto',
        'devolucao-produto',
        'nome-kit'
    ];
    
    let encontrados = 0;
    let comSugestoes = 0;
    
    seletoresNomeProduto.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            encontrados++;
            const datalistId = input.getAttribute('list');
            const datalist = datalistId ? document.getElementById(datalistId) : null;
            
            console.log(`✅ #${id} encontrado`, {
                type: input.type,
                tagName: input.tagName,
                hasDatalist: !!datalist,
                datalistId: datalistId,
                sugestoes: datalist ? datalist.options.length : 0,
                primeirosValores: datalist ? Array.from(datalist.options).slice(0, 3).map(opt => opt.value) : []
            });
            
            if (datalist && datalist.options.length > 0) {
                comSugestoes++;
            }
        } else {
            console.log(`❌ #${id} NÃO encontrado`);
        }
    });
    
    
}

//  NOVA FUNÇÃO DE DEBUG ESPECÍFICA PARA FINALIDADES
function debugFinalidades() {
    const seletoresFinalidade = [
        'retirada-finalidade',
        'finalidade',
        'finalidade-entrada',
        'finalidade-consulta'
    ];
    
    seletoresFinalidade.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            console.log(`✅ #${id} encontrado - ${select.options.length} opções`);
            console.log(`   Valores:`, Array.from(select.options).map(opt => opt.value).filter(val => val !== ''));
        } else {
            console.log(`❌ #${id} NÃO encontrado`);
        }
    });
}

//  DISPONIBILIZA TODAS AS FUNÇÕES DE DEBUG GLOBALMENTE
window.debugParametros = debugParametros;
window.debugCategorias = debugCategorias;
window.debugPatrimonios = debugPatrimonios;          
window.debugLocaisEstoque = debugLocaisEstoque;
window.debugFinalidades = debugFinalidades;
window.debugUnidadeMedida = debugUnidadeMedida;
window.debugSugestoesProdutos = debugSugestoesProdutos;