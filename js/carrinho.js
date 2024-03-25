setcookie('paginaAtual','carrinho');

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

// Função para gerar um novo user_id
function generateUserId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function mostrarCarrinho(){
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=mostrarCarrinho'+'&userID='+getUserId(),dataType: 'html', 
		success: function(resposta){
			if(resposta=='carrinhoVazio'){
				window.location.href = $('#caminhoAtual').text()+'/produto';
				return;
				}
			setTimeout(function(){
				$('#produtosNoCarrinho').html(resposta);
				loading('loading2');
				},500);
			}
		});
	return;
	}
function removerProdutoDoCarrinho(fullid){
	loading('loading2');
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=removerProdutoDoCarrinho&fullid='+fullid+'&userID='+getUserId(),dataType: 'html', 
		success: function(){
			loading('loading2');
			mostrarCarrinho();
			}
		});
	return;
	}
function buscarQuantidades(fullid){
	modal("modalQuantidade");
	quantidadeTotal = $('#quantidadeTotal'+fullid).text();
	$('#fullidDoProdutoParaAlterarAQuantidade').text(fullid);
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=buscarQuantidades&fullid='+fullid+'&quantidadeTotal='+quantidadeTotal+'&userID='+getUserId(),dataType: 'html', 
		success: function(resposta){
			$('.listaDeQuantidades').html(resposta);
			}
		});
	return;
	}
function alterarQuantidadeDoProdutoNoCarrinho(quantidade){
	fullid = $('#fullidDoProdutoParaAlterarAQuantidade').text();
	if(typeof fullid=='undefined' || fullid==''){
		quantidade = $('.quantidadePersonalizada').val();
	}
	loading('loading2');
	quantidadeTotal = $('#quantidadeTotal'+fullid).text();
	$.ajax({
		url: '/api/',type: 'POST',async: true, data: 'metodo=alterarQuantidadeDoProdutoNoCarrinho&fullid='+fullid+'&quantidade='+quantidade+'&quantidadeTotal='+quantidadeTotal+'&userID='+getUserId(),dataType: 'html', 
		success: function(){
			modal("modalQuantidade");
			loading('loading2');
			mostrarCarrinho();
			}
		});
	return;
	}
function quantidadeManual(fullid){
	$('#qtdpnc').text($('#quantidadeTotal'+fullid).text());
	$('.quantidadePersonalizada').val('');
	if($('.listaDeQuantidades').css('display')=='flex'){
		$('.listaDeQuantidades').hide();
		$('.quantidadeManual').fadeIn(150).css('display','flex');
		}else{
			$('.listaDeQuantidades').fadeIn(150).css('display','flex');
			$('.quantidadeManual').hide();
			}
	return;
	}

jQuery(document).ready(function($){

	mostrarCarrinho();

	$('.quantidadePersonalizada').keyup(function(){
		q = $('.quantidadePersonalizada').val();
		qt = $('#qtdpnc').text();
		if(parseInt(q)>parseInt(qt)){
			$('.quantidadePersonalizada').val(qt);
			}
		});

	});
