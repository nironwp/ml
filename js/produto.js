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

// Função para gerar um novo user_id
function generateUserId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

setcookie('paginaAtual','produto');
function toggleFullScreen(){
	document.requestFullscreen();
  }
//AVALIAÇÕES
function avaliação(id,fullid,ação){
	corForte = $('#corForte').text();
	corFraca = $('#corFraca').text();
	
	corLike = $('#corLike'+id).css('color');
	corUnlike = $('#corUnlike'+id).css('color');
	
	likes = $('#likes'+id).text();
	unlikes = $('#unlikes'+id).text();
	
	$.ajax({
		url: '/api/',type: "POST",async: true,data: 'metodo=avaliação&id='+id+'&fullid='+fullid+'&ação='+ação+'&corForte='+corForte+'&corFraca='+corFraca+'&corLike='+corLike+'&corUnlike='+corUnlike+'&likes='+likes+'&unlikes='+unlikes,dataType: "html",
		success: function(resposta){ resposta = resposta.trim();	
			/* console.log(resposta); */
			resposta = resposta.split('|');
			$('#likes'+id).text(resposta[0]);
			$('#unlikes'+id).text(resposta[1]);
			
			$('.corLike'+id).css('color',resposta[2]);
			$('#corLike'+id).css('color',resposta[2]);
			$('#botaoLike'+id).css('border-color',resposta[2]);
			
			$('.corUnlike'+id).css('color',resposta[3]);
			$('#corUnlike'+id).css('color',resposta[3]);
			$('#botaoUnlike'+id).css('border-color',resposta[3]);

			}
		});
	return;
	}
function selecionarVariação(fullid,variação,atributo,ir){
	let totalDeAtributosDaVariação = $('.totalDeAtributosDaVariação'+variação).text();
	for(c=0;c<totalDeAtributosDaVariação;c++){
		if(parseInt(c)==parseInt(atributo)){
			$('.variação'+variação+'atributo'+atributo).css('border','solid 2px #3483fa');
			}else{
				$('.variação'+variação+'atributo'+c).css('border','dashed 1px rgba(0,0,0,.25)');
				}
		}
	textoDoAtributo = $('.textovariação'+variação+'atributo'+atributo).text();
	$('.atributoDaVariação'+variação).text(textoDoAtributo);
	
	imagemDoAtributo = $('.imagemvariação'+variação+'atributo'+atributo).text();
	$('.imagemDaVariação'+variação).css('background-image','url("'+imagemDoAtributo+'")');
	
	fullidAtributo = $('.fullidvariação'+variação+'atributo'+atributo).text();
	if(fullidAtributo.length==9 && ir!='não'){
		window.location.href = 'https://'+$('#dominio').text()+'/'+fullidAtributo;
		}
	return;
	}
function selecionarQuantidade(quantidade){
	if(quantidade=='manual'){
		quantidade = $('.quantidadePersonalizada').val();
		$('.quantidadeEscolhida').text(quantidade);	
		modal("modalQuantidade");	
		setTimeout(function(){
			quantidadeManual();
			},150);
		$('.quantidadePersonalizada').val('')
		return;
		}
	$('.quantidadeEscolhida').text(quantidade);
	modal("modalQuantidade");
	return;
	}
function quantidadeManual(){
	if($('.listaDeQuantidades').css('display')=='flex'){
		$('.listaDeQuantidades').hide();
		$('.quantidadeManual').fadeIn(150).css('display','flex');
		}else{
			$('.listaDeQuantidades').fadeIn(150).css('display','flex');
			$('.quantidadeManual').hide();
			}
	return;
	}
function perguntasDoProduto(){
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=perguntasDoProduto'+'&produto='+$('#idProduto'),dataType: 'html', 
			success: function(resposta){ 
			}
		});
	return;
	}
function perguntar(){
	pergunta = outputFilter($('#pergunta').val());
	if(pergunta.length==0){return;}
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=perguntar&pergunta='+pergunta+'&produto='+$('#idProduto'),dataType: 'html', 
			success: function(resposta){ 
				$('#perguntaFeita').fadeIn(150).css('display','flex');
				perguntasDoProduto();
				$('#pergunta').val('');
				setTimeout(function(){
					loading('loading2');
					setTimeout(function(){
						$('#perguntaFeita').fadeOut(150);
						},4000);
					},1000);
				
			}
		});
	return;
	}	
function comoPerguntar(){
	$('#pergunta').focus();
	return;
	}
function fecharPerguntaFeita(){
	$('#perguntaFeita').fadeOut(150);
	return;
	}
function adicionarAoCarrinho(destino){
	loading('loading2');
	if(checkoutExterno('Ao clicar em comprar na página produto')==true){
		return;
		}
	quantidade = document.querySelectorAll('.quantidadeEscolhida')[0]['innerText'];
	quantidadeTotal = $('#quantidadeTotal').text();
	variações = '';
	totalDeVariações = $('.totalDeVariações').text();
	for(c=0;c<totalDeVariações;c++){
		tituloDaVariação = document.querySelectorAll('.tituloDaVariação'+c)[0]['innerText'];
		atributoDaVariação = document.querySelectorAll('.atributoDaVariação'+c)[0]['innerText'];
		variações = variações+tituloDaVariação+':::'+atributoDaVariação+'||';
		}
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=adicionarProdutoNoCarrinho&quantidade='+quantidade+'&quantidadeTotal='+quantidadeTotal+'&variações='+variações+'&destino='+destino+'&userID='+getUserId()+'&fullid='+$('#idProduto').text(),dataType: 'html', 
		success: function(){
			window.location.href = '/'+destino;
			}
		});
	return;
	}


jQuery(document).ready(function($){

	$("#imagens-do-produto").owlCarousel({
		navigation : true,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		items : 1});


	$('.quantidadePersonalizada').keyup(function(){
		q = $('.quantidadePersonalizada').val();
		qt = $('#quantidadeTotal').text();
		if(parseInt(q)>parseInt(qt)){
			$('.quantidadePersonalizada').val(qt);
			}
		});
	});
