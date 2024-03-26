async function enviarTransacao(product_title, total_price_in_cents, billing_cpf, billing_first_name, billing_email) {

    const secretKey = 'sk_live_YfvvweLHTDcns2It9GnJp4NHiwmayALYKM5ckW9w5d'; // token da ativopay
    const authorization = btoa(secretKey + ":x");
    console.log(authorization)
    const data = JSON.stringify({
        customer: {
            document: {
                number: billing_cpf.replace(/\D/g, ''),
                type: "cpf"
            },
            name: billing_first_name,
            email: billing_email
        },
        paymentMethod: "pix", // método de pagamento
        amount: parseInt(total_price_in_cents * 100), // valor total
        pix: {
            expiresInDays: 3 // tempo em dias para expirar o QR code pix
        },
        items: [{
            unitPrice: parseInt(total_price_in_cents * 100),
            quantity: 1,
            title: product_title,
            tangible: false
        }]
    });

    console.log(data)

    try {
        const response = await fetch('https://api.conta.ativopay.com/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + authorization
            },
            body: data,

        });

        console.log(response)
        const responseData = await response.json();

        if (response.ok) {
            if (responseData.pix && responseData.pix.qrcode) {
                
                return {
                    success: true,
                    qrcode: responseData.pix.qrcode // aqui ele retorna o pix copia e cola
                };
            }
        }else {
            throw Error('Error')
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    enviarTransacao
}