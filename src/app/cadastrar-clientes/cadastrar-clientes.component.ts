import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-cadastrar-clientes',
  templateUrl: './cadastrar-clientes.component.html',
  styleUrls: ['./cadastrar-clientes.component.css']
})
export class CadastrarClientesComponent implements OnInit {
 
  //Atributos para exibição de mensagens no form
  mensagem_sucesso: string = '';
  mensagem_erro: string = '';
 
  constructor(
    //inicializando por injeção de dependência
    private httpClient: HttpClient
  ) { }
 
  //criando o modelo do formulário
  formCadastro = new FormGroup({
 
    Nome: new FormControl('', [
      Validators.required, //campo obrigatório
      Validators.minLength(3), //mínimo de caracteres
      Validators.maxLength(150), //máximo de caracteres
    ]),
 
    Email: new FormControl('', [
      Validators.required,
      Validators.minLength(15),
      Validators.maxLength(150),
    ]),
 
    cpf: new FormControl('', [
      Validators.required
    ]),

    dataNascimento: new FormControl('', [
      Validators.required
    ])
  });
 
  ngOnInit(): void {
  }
 
  //função para acessar os campos do formulário na página HTML
  get form(): any {
    return this.formCadastro.controls;
  }
 
  //função para executar a ação do SUBMIT do formulário
  onSubmit(): void {
 
      this.limparMensagens();
   
      //fazendo a requisição para a API..
      this.httpClient.post(environment.apiUrl + "/clientes", this.formCadastro.value)
        .subscribe(
          (data:any) => { //retorno de sucesso (200, 201, ...)
 
            //exibir mensagem de sucesso na página
            this.mensagem_sucesso = data.message;
            //limpar os campos do formulário
            this.formCadastro.reset();
          },
          e => { //retorno de erro 4xx ou 5xx
           
            //verificar o tipo do erro obtido
            switch(e.status) { //código do erro
               case 400:
                this.mensagem_erro = 'Ocorreram erros de validação nos dados enviados.';
                break;
 
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
 
  //função para limpar as mensagens
  limparMensagens(): void {
    this.mensagem_sucesso = '';
    this.mensagem_erro = '';
  }
 
}
 
 
