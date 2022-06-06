import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consultar-clientes',
  templateUrl: './consultar-clientes.component.html',
  styleUrls: ['./consultar-clientes.component.css']
})
export class ConsultarClientesComponent implements OnInit {

  clientes: any[] = []; //array vazio!
 
  mensagem_sucesso : string = '';
  mensagem_erro : string = '';

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
   
    this.httpClient.get(environment.apiUrl + "/clientes")
      .subscribe( 
        data => {          
          this.clientes = data as any[];          
        }
      )
  }
 
  //função para excluir a cliente selecionado
  excluirCliente(idCliente : string): void {
 
    if(window.confirm('Deseja realmente excluir o cliente selecionado ?')){
 
      this.limparMensagens();
 
      this.httpClient.delete(environment.apiUrl + "/clientes/" + idCliente)
        .subscribe(
          (data:any) => {
 
            //exibir mensagem de sucesso
            this.mensagem_sucesso = data.message;
            //fazer uma nova consulta na API
            this.ngOnInit();
          },
          e => {
            //verificar o tipo do erro obtido
            switch(e.status) { //código do erro
              case 422:
                this.mensagem_erro = e.error.message;
                break;
              case 500:
                this.mensagem_erro = "Erro! Entre em contato com o suporte.";
                break;
            }
          }
        )
    }
  }
 
 
   //função para limpar as mensagens
   limparMensagens(): void {
    this.mensagem_sucesso = '';
    this.mensagem_erro = '';
  }
 
}
 
 
