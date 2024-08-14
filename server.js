const express= require('express');
const bodyParser = require ('body-parser');
const app = express();
require('dotenv').config();

const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox',
 client_id: '-',
 client_secret: '-'
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.post('/webhook', (req,res)=>{
  console.log('Recebido webhook:',req.body);

const event = req.body;
if(event && event.event_type === 'PAYMENT.SALE.COMPLETED'){
  console.log('Pagamento concluído com sucesso:', event);
}else{
  console.log('Evento não processado:', event);
}
res.sendStatuts(200);
});
app.listen(3000,()=>{
  console.log('Servidor escutando na porta 3000')
});