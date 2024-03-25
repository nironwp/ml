setcookie('paginaAtual','login');
function criarConta(){
	$('#campoEscolha').hide();
	$('#campoEntrar').hide();
	$('#campoCriarConta').fadeIn(150);
	return;
	}
function entrar(){
	$('#campoEscolha').hide();
	$('#campoCriarConta').hide();
	$('#campoEntrar').fadeIn(150);
	return;
	}
function continuarLogin(){
	login = $('#loginEntrar').val();
	//verificação
	if(login.length<3){ 
		$('#erroLoginEntrar').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroLoginEntrar').fadeOut(150);
			},1500);
		return;
		}

	$('#loginDoUsuario').text(login);
	
	$('#tituloEntrar1').hide();
	$('#campoLoginUsuario1').hide();
	$('#botoesLogin1').hide();

	$('#tituloEntrar2').fadeIn(150).css('display','block');
	$('#campoLoginUsuario2').fadeIn(150).css('display','flex');
	$('#campoSenhaUsuario').fadeIn(150);
	$('#botoesLogin2').fadeIn(150);
	return;
	}
function voltarParaLogin(){
	$('#loginEntrar').val('');

	$('#tituloEntrar1').fadeIn(150).css('display','block');
	$('#campoLoginUsuario1').fadeIn(150).css('display','flex');
	$('#botoesLogin1').fadeIn(150);

	$('#tituloEntrar2').hide();
	$('#campoLoginUsuario2').hide();
	$('#campoSenhaUsuario').hide();
	$('#botoesLogin2').hide();
	return;
	}
function acessar(){
	login = $('#loginEntrar').val();
	if(login.length<3){ 
		voltarParaLogin();
		$('#erroLoginEntrar').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroLoginEntrar').fadeOut(150);
			},1500);
		return;
		}
	senha = $('#senhaEntrar').val();
	if(senha.length<6){
		$('#erroSenhaEntrar').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroSenhaEntrar').fadeOut(150);
			},1500);
		return;
		}
	loading('loading2');
	setcookie('email',login);
	setcookie('nome','');
	setcookie('telefone','');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=salvarLogin&login='+login+'&senha='+senha,dataType: 'html', 
		success: function(){
			setTimeout(function(){
				window.location.href = '/endereço';
				},1000);
			}
		});
	return;
	}
function criarMinhaConta(){
	email = $('#emailCadastro').val();
	if(!email.includes('@') && !email.includes('.')){ 
		$('#erroEmailCadastro').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroEmailCadastro').fadeOut(150);
			},1500);
		return;
		}
	nome = $('#nomeCadastro').val();
	if(!nome.includes(' ')){ 
		$('#erroNomeCadastro').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroNomeCadastro').fadeOut(150);
			},1500);
		return;
		}
	telefone = $('#telefoneCadastro').val();
	if(!telefone.includes(' ') && !telefone.includes('-')){ 
		$('#erroTelefoneCadastro').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroTelefoneCadastro').fadeOut(150);
			},1500);
		return;
		}
	senha = $('#senhaCadastro').val();
	if(senha.length<6){ 
		$('#erroSenhaCadastro').fadeIn(150).css('display','flex');
		setTimeout(function(){
			$('#erroSenhaCadastro').fadeOut(150);
			},1500);
		return;
		}
	loading('loading2');
	setcookie('email',email);
	setcookie('nome',nome);
	setcookie('telefone',telefone);
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=salvarLogin&login='+email+'&senha='+senha,dataType: 'html', 
		success: function(){
			setTimeout(function(){
				window.location.href = '/endereço';
				},1000);
			}
		});
	return;
	}
jQuery(document).ready(function($){


	});
