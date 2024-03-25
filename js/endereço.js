setcookie('paginaAtual','endereço');

function continuar(){
	nome = $('#nomeEndereço').val();if(!nome.includes(' ')){ $('#erroNomeEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroNomeEndereço').fadeOut(150);},1500);return; }
	cep = $('#cepEndereço').val();if(cep.length<5 || cep.length>10){ $('#erroCepEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroCepEndereço').fadeOut(150);},1500);return; }
	estado = $('#estadoEndereço').val();if(estado.length<2 || estado.length>64){ $('#erroEstadoEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroEstadoEndereço').fadeOut(150);},1500);return; }
	cidade = $('#cidadeEndereço').val();if(cidade.length<2 || cidade.length>128){ $('#erroCidadeEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroCidadeEndereço').fadeOut(150);},1500);return; }
	bairro = $('#bairroEndereço').val();if(bairro.length<2 || bairro.length>64){ $('#erroBairroEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroBairroEndereço').fadeOut(150);},1500);return; }
	logradouro = $('#logradouroEndereço').val();if(logradouro.length<2 || logradouro.length>128){ $('#erroLogradouroEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroLogradouroEndereço').fadeOut(150);},1500);return; }
	numero = $('#numeroEndereço').val();if(numero.length<1 || numero.length>6){ $('#erroNumeroEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroNumeroEndereço').fadeOut(150);},1500);return; }
	telefone = $('#telefoneEndereço').val();if(telefone.length<1 || telefone.length>32){ $('#erroTelefoneEndereço').fadeIn(150).css('display','flex');setTimeout(function(){$('#erroTelefoneEndereço').fadeOut(150);},1500);return; }
	complemento = $('#complementoEndereço').val();

	loading('loading2');
	setcookie('nomeEndereço',nome);
	setcookie('cepEndereço',cep);
	setcookie('estadoEndereço',estado);
	setcookie('cidadeEndereço',cidade);
	setcookie('bairroEndereço',bairro);
	setcookie('logradouroEndereço',logradouro);
	setcookie('numeroEndereço',numero);
	setcookie('complementoEndereço',complemento);
	setcookie('telefone',telefone);

	$('#endereçoParaEntrega').hide();
	$('#formasDeEntrega').fadeIn(150).css('display','flex');
	$('#envioPara').text(logradouro+', '+numero);
	setTimeout(function(){
		loading('loading2');
		},1000);
	return;
	}
function selecionarFormaDeEntrega(id){
	$('.iconeSelecionar').html("&#xe836;");
	$('.iconeSelecionar').css('color','#ededed');
	$('#iconeSelecionar'+id).html("&#xe837;");
	$('#iconeSelecionar'+id).css('color','#3483fa');
	$('#valorDaEntrega').text($('#valorDaEntrega'+id).text());
	$('#valorDaEntrega').css('color',$('#valorDaEntrega'+id).css('color'));

	setcookie('formaDeEntregaEscolhida',$('#prazoDaEntrega'+id).text());
	
	$.ajax({
		url: '/api/' ,data: 'metodo=selecionarFormaDeEntrega&id='+id,type: 'POST',async: true,dataType: 'html',
		success: function(){  }
		});
	return;
	}
function pagar(){
	loading('loading2');
	setTimeout(function(){
		window.location.href = '/pagamento';
		},1000);
	return;
	}
function mascaraCep(id,pais){
	cep = $('#'+id).val();
	cep = cep.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	cep = cep.replaceAll('.','');
	cep = cep.replaceAll('-','');
	if(cep.length==6){
		cep = cep[0]+cep[1]+cep[2]+cep[3]+cep[4]+'-'+cep[5];
		}else if(cep.length==7){
			cep = cep[0]+cep[1]+cep[2]+cep[3]+cep[4]+'-'+cep[5]+cep[6];
			}else if(cep.length>=8){
				cep = cep[0]+cep[1]+cep[2]+cep[3]+cep[4]+'-'+cep[5]+cep[6]+cep[7];
				console.log(cep);
				$.ajax({
					url: '/api/' ,data: 'metodo=consultarCEP&cep='+cep,type: 'POST',async: true,dataType: 'html',
					success: function(resposta){ resposta = resposta.trim();
						console.log(resposta);
						resposta = resposta.split('|');
						$('#logradouroEndereço').val(resposta[0]);
						$('#bairroEndereço').val(resposta[1]);
						$('#cidadeEndereço').val(resposta[2]);
						estado = resposta[3];
						estado = estado.trim();
						$('#estadoEndereço').val(estado);
						$('#numeroEndereço').focus();
						}
					 }); 
				}
	$('#'+id).val(cep);
	return;
	}
jQuery(document).ready(function($){

	if(getcookie('nome')!=''){
		$('#nomeEndereço').val(getcookie('nome'));
		}
	if(getcookie('telefone')!=''){
		$('#telefoneEndereço').val(getcookie('telefone'));
		}

	//auto preencher endereço
	if(getcookie('nomeEndereço')!='' && getcookie('nomeEndereço')!='undefined' && getcookie('nomeEndereço')!='null'){
		$('#nomeEndereço').val(getcookie('nomeEndereço'));
		}
	if(getcookie('cepEndereço')!='' && getcookie('cepEndereço')!='undefined' && getcookie('cepEndereço')!='null'){
		$('#cepEndereço').val(getcookie('cepEndereço'));
		}
	if(getcookie('estadoEndereço')!='' && getcookie('estadoEndereço')!='undefined' && getcookie('estadoEndereço')!='null'){
		$('#estadoEndereço').val(getcookie('estadoEndereço'));
		}
	if(getcookie('cidadeEndereço')!='' && getcookie('cidadeEndereço')!='undefined' && getcookie('cidadeEndereço')!='null'){
		$('#cidadeEndereço').val(getcookie('cidadeEndereço'));
		}
	if(getcookie('bairroEndereço')!='' && getcookie('bairroEndereço')!='undefined' && getcookie('bairroEndereço')!='null'){
		$('#bairroEndereço').val(getcookie('bairroEndereço'));
		}
	if(getcookie('logradouroEndereço')!='' && getcookie('logradouroEndereço')!='undefined' && getcookie('logradouroEndereço')!='null'){
		$('#logradouroEndereço').val(getcookie('logradouroEndereço'));
		}
	if(getcookie('numeroEndereço')!='' && getcookie('numeroEndereço')!='undefined' && getcookie('numeroEndereço')!='null'){
		$('#numeroEndereço').val(getcookie('numeroEndereço'));
		}
	if(getcookie('telefone')!='' && getcookie('telefone')!='undefined' && getcookie('telefone')!='null'){
		$('#telefoneEndereço').val(getcookie('telefone'));
		}
	if(getcookie('complementoEndereço')!='' && getcookie('complementoEndereço')!='undefined' && getcookie('complementoEndereço')!='null'){
		$('#complementoEndereço').val(getcookie('complementoEndereço'));
		}
	});

