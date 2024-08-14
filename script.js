let cartTotal = 0;
function addItemToCart(price){
  cartTotal += price;
  updateCartTotal();
}
function updateCartTotal(){
  document.getElementById('cart-total').textContent = `R$${cartTotal.toFixed(2)}`
renderPaypalButton(cartTotal);
}
function renderPaypalButton(amount) {

  document.getElementById('paypal-button-container').innerHTML = '';

  paypal.Buttons({
      style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: (amount / 100).toFixed(2) 
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
              alert('Transação concluída por ' + details.payer.name.given_name + '!');

            
              fetch('/paypal-transaction-complete', {
                  method: 'post',
                  headers: {
                      'content-type': 'application/json'
                  },
                  body: JSON.stringify({
                      orderID: data.orderID,
                      payerID: data.payerID,
                      paymentDetails: details
                  })
              }).then(function(response) {
                  return response.json();
              }).then(function(data) {
                  console.log('Resposta do servidor:', data);
              }).catch(function(error) {
                  console.error('Erro ao enviar dados para o servidor:', error);
              });
          });
      },
      onError: function(err) {
          console.error('Erro no pagamento:', err);
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
      }
  }).render('#paypal-button-container'); 
}


renderPaypalButton(cartTotal);
