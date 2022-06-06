import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-editar-clientes',
  templateUrl: './editar-clientes.component.html',
  styleUrls: ['./editar-clientes.component.css']
})
export class EditarClientesComponent implements OnInit {
 
  mensagem_sucesso: string = '';
  mensagem_erro: string = '';
 
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }
 
  formEdicao = new FormGroup({
 
    //campo para armazenar o id do cliente
    idCliente: new FormControl('', []),
 
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
    ]),
 
    email: new FormControl('', [
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
 
    //ler o id da cliente enviado pela URL
    const idCliente = this.activatedRoute.snapshot.paramMap.get('idCliente');
 
    //consultar a cliente na API atraves do ID
    this.httpClient.get(environment.apiUrl + "/clientes/" + idCliente)
      .subscribe(
        (data:any) => {
          //Enviar a data na fortamatção yyyy-mm-dd
          data.dataNascimento = data.dataNascimento.split('T')[0];
          //populando o formulário
          this.formEdicao.patchValue(data);
        }
      )
 
  }
 
  get form(): any {
    return this.formEdicao.controls;
  }
 
  onSubmit(): void {
 
    this.limparMensagens();
 
     this.httpClient.put(environment.apiUrl + "/clientes", this.formEdicao.value)
     .subscribe(
       (data:any) => { 
         this.mensagem_sucesso = data.message;
       },
       e => {        
         switch(e.status) {
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
 
  limparMensagens(): void {
    this.mensagem_sucesso = '';
    this.mensagem_erro = '';
  }
}